/*
 * Copyright 2013-present the original author or authors.
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

import { StateSupport } from "../../__tests__/state-support.js";
import { DefaultStateTransitionComparator } from "../default-state-transition-comparator.js";
import { StateTransition } from "../state-transition.js";

describe("DefaultStateTransitionComparator", () => {
  const state = new StateSupport("state1");
  const comparator = new DefaultStateTransitionComparator();

  const transition = (pattern: string): StateTransition =>
    StateTransition.createStateTransition(state, pattern, "start");

  it("test simple ordering equal", () => {
    const transition1 = transition("CONTIN???LE");

    expect(comparator.compare(transition1, transition1)).toBe(0);
  });

  it("test simple ordering more general", () => {
    const generic = transition("CONTIN???LE");
    const specific = transition("CONTINUABLE");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test simple ordering most general", () => {
    const generic = transition("*");
    const specific = transition("CONTINUABLE");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test substring and wildcard", () => {
    const generic = transition("CONTIN*");
    const specific = transition("CONTINUABLE");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test simple ordering most to next general", () => {
    const generic = transition("*");
    const specific = transition("C?");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test simple ordering adjacent", () => {
    const generic = transition("CON*");
    const specific = transition("CON?");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by number of generic wildcards", () => {
    const generic = transition("*");
    const specific = transition("**");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by number of specific wildcards", () => {
    const generic = transition("CONTI??ABLE");
    const specific = transition("CONTI?UABLE");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by length with asterisk equality", () => {
    const generic = transition("CON*");
    const specific = transition("CONTINUABLE*");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by length with wildcard equality", () => {
    const generic = transition("CON??");
    const specific = transition("CONTINUABLE??");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by alpha with asterisk equality", () => {
    const generic = transition("DOG**");
    const specific = transition("CAT**");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test order by alpha with wildcard equality", () => {
    const generic = transition("DOG??");
    const specific = transition("CAT??");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });

  it("test priority ordering with alphabetic comparison", () => {
    const generic = transition("DOG");
    const specific = transition("CAT");

    expect(comparator.compare(specific, generic)).toBe(1);
    expect(comparator.compare(generic, specific)).toBe(-1);
  });
});
