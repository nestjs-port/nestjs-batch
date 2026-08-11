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

interface StateTransition {
  getPattern(): string;
}

/** Sorts state transitions from the most specific pattern to the most generic. */
export class DefaultStateTransitionComparator {
  static readonly STATE_TRANSITION_COMPARATOR =
    "batch_state_transition_comparator";

  compare(arg0: StateTransition, arg1: StateTransition): number {
    const arg0Pattern = arg0.getPattern();
    const arg1Pattern = arg1.getPattern();

    if (arg0Pattern === arg1Pattern) {
      return 0;
    }

    const arg0AsteriskCount = this.count(arg0Pattern, "*");
    const arg1AsteriskCount = this.count(arg1Pattern, "*");

    if (arg0AsteriskCount > 0 && arg1AsteriskCount === 0) {
      return -1;
    }
    if (arg0AsteriskCount === 0 && arg1AsteriskCount > 0) {
      return 1;
    }
    if (arg0AsteriskCount > 0 && arg1AsteriskCount > 0) {
      if (arg0AsteriskCount < arg1AsteriskCount) {
        return -1;
      }
      if (arg0AsteriskCount > arg1AsteriskCount) {
        return 1;
      }
    }

    const arg0WildcardCount = this.count(arg0Pattern, "?");
    const arg1WildcardCount = this.count(arg1Pattern, "?");

    if (arg0WildcardCount > arg1WildcardCount) {
      return -1;
    }
    if (arg0WildcardCount < arg1WildcardCount) {
      return 1;
    }

    if (
      arg0Pattern.length !== arg1Pattern.length &&
      (arg0AsteriskCount > 0 || arg0WildcardCount > 0)
    ) {
      return Math.sign(arg0Pattern.length - arg1Pattern.length);
    }

    return Math.sign(arg1Pattern.localeCompare(arg0Pattern));
  }

  private count(value: string, token: string): number {
    return [...value].filter((character) => character === token).length;
  }
}
