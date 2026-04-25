/*
 * Copyright 2006-2025 the original author or authors.
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

import { beforeEach, describe, expect, it } from "vitest";
import { RepeatContextSupport } from "../repeat-context-support.js";

describe("RepeatContextSupport", () => {
  const list: string[] = [];

  beforeEach(() => {
    list.length = 0;
  });

  it("test destruction callback sunny day", () => {
    const context = new RepeatContextSupport(null);
    context.setAttribute("foo", "FOO");
    context.registerDestructionCallback("foo", () => list.push("bar"));
    context.close();
    expect(list).toHaveLength(1);
    expect(list[0]).toBe("bar");
  });

  it("test destruction callback missing attribute", () => {
    const context = new RepeatContextSupport(null);
    context.registerDestructionCallback("foo", () => list.push("bar"));
    context.close();
    // No check for the attribute before executing callback
    expect(list).toHaveLength(1);
  });

  it("test destruction callback with exception", () => {
    const context = new RepeatContextSupport(null);
    context.setAttribute("foo", "FOO");
    context.setAttribute("bar", "BAR");
    context.registerDestructionCallback("bar", () => {
      list.push("spam");
      throw new Error("fail!");
    });
    context.registerDestructionCallback("foo", () => {
      list.push("bar");
      throw new Error("fail!");
    });
    expect(() => context.close()).toThrow("fail!");
    // ...but we do care that both were executed:
    expect(list).toHaveLength(2);
    expect(list).toContain("bar");
    expect(list).toContain("spam");
  });
});
