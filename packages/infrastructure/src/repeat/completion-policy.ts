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

import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status.js";

/**
 * Interface for batch completion policies, to enable batch operations to strategise
 * normal completion conditions. Stateful implementations of batch iterators should
 * only update state using the update method. If custom behaviour is needed, consider
 * extending an existing implementation or using the composite provided.
 */
export interface CompletionPolicy {
  /**
   * Determine whether a batch is complete given the latest result from the callback. If
   * this method returns true then {@link CompletionPolicy.isComplete} should also (but
   * not necessarily vice versa, since the answer here depends on the result).
   * @param context the current batch context.
   * @param result the result of the latest batch item processing, or null.
   * @returns true if the batch should terminate.
   * @see CompletionPolicy.isComplete
   */
  isComplete(context: RepeatContext, result: RepeatStatus | null): boolean;

  /**
   * Allow the policy to signal completion according to internal state, without having
   * to wait for the callback to complete.
   * @param context the current batch context.
   * @returns true if the batch should terminate.
   */
  isComplete(context: RepeatContext): boolean;

  /**
   * Create a new context for the execution of a batch. Implementations should not return
   * the parent from this method; they must create a new context to meet the specific
   * needs of the policy.
   * @param parent the current context if one is already in progress, or null.
   * @returns a context that can be used to store internal state for a batch step.
   */
  start(parent: RepeatContext | null): RepeatContext;

  /**
   * Give implementations the opportunity to update the state of the current batch. It
   * is called once per callback after it has been launched, but not necessarily after it
   * completes if the batch is asynchronous.
   * @param context the value returned by start.
   */
  update(context: RepeatContext): void;
}
