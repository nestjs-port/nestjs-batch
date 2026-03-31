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

import assert from "node:assert/strict";

import { RepeatContextCounter, RepeatContextSupport } from "../context";
import type { RepeatContext } from "../repeat-context";
import type { RepeatStatus } from "../repeat-status";
import { DefaultResultCompletionPolicy } from "./default-result-completion-policy";

class CountingBatchContext extends RepeatContextSupport {
  private readonly counter: RepeatContextCounter;

  constructor(parent: RepeatContext, useParent: boolean) {
    super(parent);
    this.counter = new RepeatContextCounter(
      this,
      CountingCompletionPolicy.COUNT,
      useParent,
    );
  }

  getCounter(): RepeatContextCounter {
    return this.counter;
  }
}

export abstract class CountingCompletionPolicy extends DefaultResultCompletionPolicy {
  static readonly COUNT = `${CountingCompletionPolicy.name}.COUNT`;

  private useParent = false;

  private maxCount = 0;

  setUseParent(useParent: boolean): void {
    this.useParent = useParent;
  }

  setMaxCount(maxCount: number): void {
    this.maxCount = maxCount;
  }

  protected abstract getCount(context: RepeatContext): number;

  protected doUpdate(_context: RepeatContext): number {
    return 0;
  }

  isComplete(context: RepeatContext, result: RepeatStatus): boolean;
  isComplete(context: RepeatContext): boolean;
  override isComplete(context: RepeatContext, result?: RepeatStatus): boolean {
    if (result !== undefined) {
      return result == null || !result.isContinuable;
    }

    return this.getCountingContext(context).getCounter().getCount() >= this.maxCount;
  }

  override start(parent: RepeatContext): RepeatContext {
    return new CountingBatchContext(parent, this.useParent);
  }

  override update(context: RepeatContext): void {
    super.update(context);
    const countingContext = this.getCountingContext(context);
    countingContext.getCounter().increment(this.doUpdate(context));
  }

  private getCountingContext(context: RepeatContext): CountingBatchContext {
    assert(
      context instanceof CountingBatchContext,
      "The context must be a CountingBatchContext",
    );
    return context;
  }
}
