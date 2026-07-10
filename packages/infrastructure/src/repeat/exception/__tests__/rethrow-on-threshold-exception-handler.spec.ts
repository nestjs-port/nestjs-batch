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
import { RepeatContextSupport } from "../../context/index.js";
import { RethrowOnThresholdExceptionHandler } from "../rethrow-on-threshold-exception-handler.js";

describe("RethrowOnThresholdExceptionHandler", () => {
  it("test runtime exception", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    expect(() => handler.handleException(context, new Error("Foo"))).toThrow(
      "Foo",
    );
  });

  it("test error", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    expect(() => handler.handleException(context, new Error("Foo"))).toThrow(
      "Foo",
    );
  });

  it("test not rethrown with threshold", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    handler.setThresholds(new Map([[Error, 1]]));
    // No exception...
    expect(() =>
      handler.handleException(context, new Error("Foo")),
    ).not.toThrow();
    const key = context.attributeNames()[0];
    expect(context.getAttribute(key)).toBeDefined();
  });

  it("test rethrow on threshold", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    handler.setThresholds(new Map([[Error, 2]]));
    // No exception...
    expect(() =>
      handler.handleException(context, new Error("Foo")),
    ).not.toThrow();
    // No exception...
    expect(() =>
      handler.handleException(context, new Error("Foo")),
    ).not.toThrow();
    expect(() => handler.handleException(context, new Error("Foo"))).toThrow(
      "Foo",
    );
  });

  it("test not use parent", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    handler.setThresholds(new Map([[Error, 1]]));
    // No exception...
    expect(() =>
      handler.handleException(context, new Error("Foo")),
    ).not.toThrow();
    const nextContext = new RepeatContextSupport(parent);
    // No exception again - context is changed...
    expect(() =>
      handler.handleException(nextContext, new Error("Foo")),
    ).not.toThrow();
  });

  it("test use parent", () => {
    const handler = new RethrowOnThresholdExceptionHandler();
    const parent = new RepeatContextSupport(null);
    const context = new RepeatContextSupport(parent);
    handler.setThresholds(new Map([[Error, 1]]));
    handler.setUseParent(true);
    // No exception...
    expect(() =>
      handler.handleException(context, new Error("Foo")),
    ).not.toThrow();
    const nextContext = new RepeatContextSupport(parent);
    expect(() =>
      handler.handleException(nextContext, new Error("Foo")),
    ).toThrow("Foo");
  });
});
