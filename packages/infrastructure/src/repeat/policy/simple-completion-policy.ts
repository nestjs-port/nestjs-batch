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

import type { RepeatContext } from "../repeat-context.js";
import type { RepeatStatus } from "../repeat-status.js";
import { RepeatContextSupport } from "../context/index.js";
import { DefaultResultCompletionPolicy } from "./default-result-completion-policy.js";

class SimpleTerminationContext extends RepeatContextSupport {
  constructor(context: RepeatContext) {
    super(context);
  }

  update(): void {
    this.increment();
  }

  isComplete(chunkSize: number): boolean {
    return this.startedCount >= chunkSize;
  }
}

/**
 * Policy for terminating a batch after a fixed number of operations. Internal state is
 * maintained and a counter incremented, so successful use of this policy requires that
 * isComplete() is only called once per batch item. Using the standard repeat template
 * should ensure this contract is kept, but it needs to be carefully monitored.
 */
export class SimpleCompletionPolicy extends DefaultResultCompletionPolicy {
  static readonly DEFAULT_CHUNK_SIZE = 5;

  private chunkSize = SimpleCompletionPolicy.DEFAULT_CHUNK_SIZE;

  constructor(chunkSize = SimpleCompletionPolicy.DEFAULT_CHUNK_SIZE) {
    super();
    this.chunkSize = chunkSize;
  }

  setChunkSize(chunkSize: number): void {
    this.chunkSize = chunkSize;
  }

  getChunkSize(): number {
    return this.chunkSize;
  }

  /** Reset the counter. */
  override start(context: RepeatContext): RepeatContext {
    return new SimpleTerminationContext(context);
  }

  isComplete(context: RepeatContext, result: RepeatStatus): boolean;
  isComplete(context: RepeatContext): boolean;
  /**
   * Terminate if the chunk size has been reached, or the result is null.
   */
  override isComplete(context: RepeatContext, result?: RepeatStatus): boolean {
    if (result !== undefined && super.isComplete(context, result)) {
      return true;
    }

    return (context as SimpleTerminationContext).isComplete(this.chunkSize);
  }

  /** Increment the counter in the context. */
  override update(context: RepeatContext): void {
    (context as SimpleTerminationContext).update();
  }

  override toString(): string {
    return `${SimpleCompletionPolicy.name}: chunkSize=${this.chunkSize}`;
  }
}
