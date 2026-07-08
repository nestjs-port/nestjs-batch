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

import type { RepeatCallback } from "../repeat-callback.js";
import type { RepeatContext } from "../repeat-context.js";
import type { RepeatOperations } from "../repeat-operations.js";
import type { RepeatStatus } from "../repeat-status.js";

/**
 * Callback that delegates to another callback, via a {@link RepeatOperations} instance.
 * Useful when nesting or composing batches in one another, e.g. for breaking a batch down
 * into chunks.
 */
export class NestedRepeatCallback implements RepeatCallback {
  private readonly _template: RepeatOperations;
  private readonly _callback: RepeatCallback;

  /**
   * Constructor setting mandatory fields.
   * @param template the {@link RepeatOperations} to use when calling the delegate
   * callback
   * @param callback the {@link RepeatCallback} delegate
   */
  constructor(template: RepeatOperations, callback: RepeatCallback) {
    this._template = template;
    this._callback = callback;
  }

  /**
   * Simply calls template.execute(callback). Clients can use this to repeat a batch
   * process, or to break a process up into smaller chunks (e.g. to change the
   * transaction boundaries).
   *
   * @see RepeatCallback#doInIteration(RepeatContext)
   */
  doInIteration(_context: RepeatContext): RepeatStatus {
    return this._template.iterate(this._callback);
  }
}
