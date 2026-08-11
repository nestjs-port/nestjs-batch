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

import { FlowExecutionStatus } from "../../flow-execution-status.js";
import type { FlowExecutor } from "../../flow-executor.interface.js";
import type { State } from "../../state.interface.js";
import { StateTransition } from "../state-transition.js";

describe("StateTransition", () => {
  const state = (endState = false): State => ({
    getName: () => "state1",
    handle: (_executor: FlowExecutor) => FlowExecutionStatus.COMPLETED,
    isEndState: () => endState,
  });

  it("test is end", () => {
    const transition = StateTransition.createEndStateTransition(state(), "");

    expect(transition.isEnd()).toBe(true);
    expect(transition.next).toBeNull();
  });

  it("test matches star", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      "*",
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });

  it("test matches null", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      null,
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });

  it("test matches empty", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      "",
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });

  it("test matches exact", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      "CONTINUABLE",
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });

  it("test matches wildcard", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      "CONTIN*",
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });

  it("test matches placeholder", () => {
    const transition = StateTransition.createStateTransition(
      state(),
      "CONTIN???LE",
      "start",
    );
    expect(transition.matches("CONTINUABLE")).toBe(true);
  });
});
