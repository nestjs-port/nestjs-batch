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

import { DefaultStateTransitionComparator } from "../default-state-transition-comparator.js";

const transition = (pattern: string) => ({ getPattern: () => pattern });

describe("DefaultStateTransitionComparator", () => {
  const comparator = new DefaultStateTransitionComparator();

  it.each([
    ["CONTINUABLE", "CONTIN???LE"],
    ["CONTINUABLE", "*"],
    ["CONTINUABLE", "CONTIN*"],
    ["C?", "*"],
    ["CON?", "CON*"],
    ["**", "*"],
    ["CONTI?UABLE", "CONTI??ABLE"],
    ["CONTINUABLE*", "CON*"],
    ["CONTINUABLE??", "CON??"],
    ["CAT**", "DOG**"],
    ["CAT", "DOG"],
  ])("orders %s before %s", (specific, generic) => {
    expect(comparator.compare(transition(specific), transition(generic))).toBe(
      1,
    );
    expect(comparator.compare(transition(generic), transition(specific))).toBe(
      -1,
    );
  });

  it("considers equal patterns equal", () => {
    const same = transition("CONTIN???LE");
    expect(comparator.compare(same, same)).toBe(0);
  });
});
