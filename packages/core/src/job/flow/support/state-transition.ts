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

import { StringUtils } from "@nestjs-port/core";
import type { State } from "../state.interface.js";

/**
 * Value object representing a potential transition from one {@link State} to
 * another. The originating state and the next state to execute are linked by a
 * pattern for the exit code of an execution of the originating state.
 */
export class StateTransition {
  /**
   * Create an end-state transition that explicitly goes to an end state.
   * @param state the state used to generate the outcome for this transition
   * @param pattern the pattern to match in the exit status of the state
   * @returns the created state transition
   */
  static createEndStateTransition(
    state: State,
    pattern?: string | null,
  ): StateTransition {
    return new StateTransition(state, pattern ?? null, null);
  }

  /**
   * Create a state transition with a pattern and destination state.
   * @param state the state used to generate the outcome for this transition
   * @param pattern the pattern to match in the exit status of the state
   * @param next the name of the next state to execute
   * @returns the created state transition
   */
  static createStateTransition(
    state: State,
    pattern: string | null,
    next: string | null,
  ): StateTransition;
  static createStateTransition(state: State, next: string): StateTransition;
  static createStateTransition(
    state: State,
    patternOrNext: string | null,
    next?: string | null,
  ): StateTransition {
    if (next === undefined) {
      return new StateTransition(state, null, patternOrNext);
    }
    return new StateTransition(state, patternOrNext, next);
  }

  private readonly _state: State;
  private readonly _pattern: string;
  private readonly _next: string | null;

  private constructor(
    state: State,
    pattern: string | null,
    next: string | null,
  ) {
    if (!state) {
      throw new Error("A state is required for a StateTransition");
    }
    if (state.isEndState() && StringUtils.hasText(next)) {
      throw new Error(`End state cannot have next: ${state.getName()}`);
    }

    this._state = state;
    this._pattern = StringUtils.hasText(pattern) ? pattern : "*";
    this._next = next;
  }

  /**
   * Public getter for the state.
   * @returns the originating state
   */
  get state(): State {
    return this._state;
  }

  /**
   * Get the pattern the exit code will be compared against.
   * @returns the transition pattern
   */
  get pattern(): string {
    return this._pattern;
  }

  /**
   * Get the next state name.
   * @returns the next state name, or null when this is an end transition
   */
  get next(): string | null {
    return this._next;
  }

  /**
   * Get the pattern the exit code will be compared against.
   * @returns the transition pattern
   */
  getPattern(): string {
    return this._pattern;
  }

  /**
   * Check whether the provided status matches this transition pattern.
   * @param status the status to compare
   * @returns true if the pattern matches the status
   */
  matches(status: string): boolean {
    const expression = [...this._pattern]
      .map((character) => {
        if (character === "*") return ".*";
        if (character === "?") return ".";
        return character.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      })
      .join("");
    return new RegExp(`^${expression}$`).test(status);
  }

  /**
   * Check for a special next state signalling the end of a job.
   * @returns true if this transition goes nowhere
   */
  isEnd(): boolean {
    return this._next === null;
  }
}
