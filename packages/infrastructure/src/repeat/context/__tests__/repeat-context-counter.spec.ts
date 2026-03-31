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
import { RepeatContextSupport } from "../repeat-context-support";
import { RepeatContextCounter } from "../repeat-context-counter";

describe("RepeatContextCounter", () => {
  let parent: RepeatContextSupport;
  let context: RepeatContextSupport;

  beforeEach(() => {
    parent = new RepeatContextSupport(null);
    context = new RepeatContextSupport(parent);
  });

  it("test attribute created", () => {
    new RepeatContextCounter(context, "FOO");
    expect(context.hasAttribute("FOO")).toBe(true);
  });

  it("test attribute created with null parent", () => {
    new RepeatContextCounter(parent, "FOO", true);
    expect(parent.hasAttribute("FOO")).toBe(true);
  });

  it("test vanilla increment", () => {
    const counter = new RepeatContextCounter(context, "FOO");
    expect(counter.getCount()).toBe(0);
    counter.increment(1);
    expect(counter.getCount()).toBe(1);
    counter.increment(2);
    expect(counter.getCount()).toBe(3);
  });

  it("test attribute created in parent", () => {
    new RepeatContextCounter(context, "FOO", true);
    expect(context.hasAttribute("FOO")).toBe(false);
    expect(parent.hasAttribute("FOO")).toBe(true);
  });

  it("test parent increment", () => {
    let counter = new RepeatContextCounter(context, "FOO", true);
    expect(counter.getCount()).toBe(0);
    counter.increment(1);
    // now get new context with same parent
    counter = new RepeatContextCounter(new RepeatContextSupport(parent), "FOO", true);
    expect(counter.getCount()).toBe(1);
    counter.increment(2);
    expect(counter.getCount()).toBe(3);
  });
});
