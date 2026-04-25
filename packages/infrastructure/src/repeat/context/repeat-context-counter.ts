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

import assert from "node:assert/strict";

import type { RepeatContext } from "../repeat-context.js";

/**
 * Helper class for policies that need to count the number of occurrences of some event
 * (e.g. an exception type in the context) in the scope of a batch. The value of the
 * counter can be stored between batches in a nested context, so that the termination
 * decision is based on the aggregate of a number of sibling batches.
 */
export class RepeatContextCounter {
  private readonly countKey: string;

  private readonly context: RepeatContext;

  /**
   * Convenience constructor with useParent=false.
   * @param context the current context.
   * @param countKey the key to use to store the counter in the context.
   */
  constructor(context: RepeatContext, countKey: string);

  /**
   * Construct a new {@link RepeatContextCounter}.
   * @param context the current context.
   * @param countKey the key to use to store the counter in the context.
   * @param useParent true if the counter is to be shared between siblings. The state
   * will be stored in the parent of the context (if it exists) instead of the context
   * itself.
   */
  constructor(context: RepeatContext, countKey: string, useParent: boolean);

  constructor(context: RepeatContext, countKey: string, useParent = false) {
    assert(
      context != null,
      "The context must be provided to initialize a counter",
    );

    this.countKey = countKey;

    const parent = context.parent;

    this.context = useParent && parent ? parent : context;
    if (!this.context.hasAttribute(countKey)) {
      this.context.setAttribute(countKey, 0);
    }
  }

  /**
   * @returns the current value of the counter
   */
  getCount(): number {
    return this.getCounter();
  }

  /**
   * Increment the counter.
   * @param delta the amount by which to increment the counter.
   */
  increment(delta: number): void;

  /**
   * Increment by 1.
   */
  increment(): void;

  increment(delta = 1): void {
    this.context.setAttribute(this.countKey, this.getCounter() + delta);
  }

  private getCounter(): number {
    const counter = this.context.getAttribute(this.countKey);
    return typeof counter === "number" ? counter : 0;
  }
}
