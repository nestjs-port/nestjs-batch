/*
 * Copyright 2006-2023 the original author or authors.
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

import { RepeatContextSupport } from "../context/index.js";
import type { RepeatContext } from "../repeat-context.js";
import type { RepeatStatus } from "../repeat-status.js";
import { CompletionPolicySupport } from "./completion-policy-support.js";

class TimeoutBatchContext extends RepeatContextSupport {
  private readonly time = Date.now();

  constructor(
    parent: RepeatContext,
    private readonly timeout: number,
  ) {
    super(parent);
  }

  isComplete(): boolean {
    return Date.now() - this.time > this.timeout;
  }
}

export class TimeoutTerminationPolicy extends CompletionPolicySupport {
  static readonly DEFAULT_TIMEOUT = 30000;

  private timeout = TimeoutTerminationPolicy.DEFAULT_TIMEOUT;

  constructor(timeout?: number) {
    super();

    if (timeout != null) {
      this.timeout = timeout;
    }
  }

  isComplete(context: RepeatContext, result: RepeatStatus): boolean;
  isComplete(context: RepeatContext): boolean;
  override isComplete(context: RepeatContext, result?: RepeatStatus): boolean {
    if (result !== undefined) {
      return super.isComplete(context, result);
    }

    return this.getTimeoutContext(context).isComplete();
  }

  override start(context: RepeatContext): RepeatContext {
    return new TimeoutBatchContext(context, this.timeout);
  }

  private getTimeoutContext(context: RepeatContext): TimeoutBatchContext {
    if (context instanceof TimeoutBatchContext) {
      return context;
    }

    throw new TypeError("The context must be a TimeoutBatchContext");
  }
}
