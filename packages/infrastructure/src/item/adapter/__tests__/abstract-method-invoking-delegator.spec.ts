/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { describe, expect, it } from "vitest";

import {
  AbstractMethodInvokingDelegator,
  InvocationTargetThrowableWrapper,
} from "../abstract-method-invoking-delegator.js";
import { DynamicMethodInvocationException } from "../dynamic-method-invocation-exception.js";

class TestDelegator<T> extends AbstractMethodInvokingDelegator<T> {
  invoke(): Promise<T | null> {
    return this.invokeDelegateMethod();
  }

  invokeWithArgument(argument: unknown | null): Promise<T | null> {
    return this.invokeDelegateMethodWithArgument(argument);
  }

  invokeWithArguments(
    arguments_: Array<unknown | null> | null,
  ): Promise<T | null> {
    return this.invokeDelegateMethodWithArguments(arguments_);
  }

  currentArguments(): Array<unknown | null> | null {
    return this.getArguments();
  }
}

class TargetService {
  extractName(item: { name: string }): string {
    return item.name;
  }

  combine(name: string, value: number): string {
    return `${name}-${value}`;
  }

  async echoAsync(value: string): Promise<string> {
    return value;
  }

  failWithError(): never {
    throw new Error("boom");
  }

  failWithThrowable(): never {
    throw "boom-throwable";
  }
}

describe("AbstractMethodInvokingDelegator", () => {
  it("should validate required properties", () => {
    const delegator = new TestDelegator<string>();
    expect(() => delegator.afterPropertiesSet()).toThrow(
      "targetObject must not be null",
    );

    delegator.setTargetObject(new TargetService());
    expect(() => delegator.afterPropertiesSet()).toThrow(
      "targetMethod must not be empty",
    );

    delegator.setTargetMethod("doesNotExist");
    expect(() => delegator.afterPropertiesSet()).toThrow(
      "target class must declare a method with matching name and parameter types",
    );
  });

  it("should validate method signature against configured arguments", () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("combine");
    delegator.setArguments(["foo"]);

    expect(() => delegator.afterPropertiesSet()).toThrow(
      "target class must declare a method with matching name and parameter types",
    );
  });

  it("should clone configured arguments", () => {
    const delegator = new TestDelegator<string>();
    const args: Array<unknown | null> = [{ name: "foo" }];

    delegator.setArguments(args);
    args[0] = { name: "bar" };

    expect(delegator.currentArguments()).toEqual([{ name: "foo" }]);
  });

  it("should invoke delegate method with configured arguments", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("combine");
    delegator.setArguments(["foo", 1]);
    delegator.afterPropertiesSet();

    await expect(delegator.invoke()).resolves.toBe("foo-1");
  });

  it("should invoke delegate method with single argument", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("extractName");
    delegator.afterPropertiesSet();

    await expect(delegator.invokeWithArgument({ name: "foo" })).resolves.toBe(
      "foo",
    );
  });

  it("should invoke delegate method with explicit arguments", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("combine");
    delegator.afterPropertiesSet();

    await expect(delegator.invokeWithArguments(["bar", 2])).resolves.toBe(
      "bar-2",
    );
  });

  it("should support async delegate methods", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("echoAsync");
    delegator.afterPropertiesSet();

    await expect(delegator.invokeWithArgument("async-value")).resolves.toBe(
      "async-value",
    );
  });

  it("should rethrow Error from delegate", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("failWithError");
    delegator.afterPropertiesSet();

    await expect(delegator.invoke()).rejects.toThrow("boom");
  });

  it("should wrap non Error throwable from delegate", async () => {
    const delegator = new TestDelegator<string>();
    delegator.setTargetObject(new TargetService());
    delegator.setTargetMethod("failWithThrowable");
    delegator.afterPropertiesSet();

    await expect(delegator.invoke()).rejects.toBeInstanceOf(
      InvocationTargetThrowableWrapper,
    );
  });

  it("should fail fast when target is not configured", async () => {
    const delegator = new TestDelegator<string>();
    await expect(delegator.invoke()).rejects.toBeInstanceOf(
      DynamicMethodInvocationException,
    );
  });
});
