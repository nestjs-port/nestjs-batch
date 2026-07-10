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

import { RepeatContextCounter } from "../context/repeat-context-counter.js";
import type { RepeatContext } from "../repeat-context.js";
import type { ExceptionHandler } from "./exception-handler.js";

class IntegerHolder {
  private static nextId = 0;
  private readonly id = IntegerHolder.nextId++;

  /**
   * @param value value within holder
   */
  constructor(private readonly value: number) {}

  /**
   * Public getter for the value.
   */
  getValue(): number {
    return this.value;
  }

  toString(): string {
    return `${IntegerHolder.name}@${this.id}.${this.value}`;
  }
}

/**
 * Implementation of {@link ExceptionHandler} that rethrows when exceptions of a given
 * type reach a threshold. Requires a classifier that maps exception types to unique keys,
 * and also a map from those keys to threshold values.
 */
export class RethrowOnThresholdExceptionHandler implements ExceptionHandler {
  protected static readonly ZERO = new IntegerHolder(0);

  private thresholds = new Map<Function, IntegerHolder>();
  private useParent = false;

  /**
   * Flag to indicate the exception counters should be shared between sibling contexts
   * in a nested batch. Default is false.
   */
  setUseParent(useParent: boolean): void {
    this.useParent = useParent;
  }

  /**
   * Set up the exception handler. Creates a default exception handler and threshold
   * that maps all exceptions to a threshold of 0 - all exceptions are rethrown by
   * default.
   */
  setThresholds(thresholds: Map<Function, number>): void {
    this.thresholds = new Map(
      [...thresholds.entries()].map(([type, value]) => [
        type,
        new IntegerHolder(value),
      ]),
    );
  }

  /**
   * Classify the throwables and decide whether to rethrow based on the result. The
   * context is used to accumulate the number of exceptions of the same type according
   * to the classifier.
   */
  handleException(context: RepeatContext, throwable: unknown): void {
    const key = this.classify(throwable);
    const counter = this.getCounter(context, key);
    counter.increment();

    if (counter.getCount() > key.getValue()) {
      throw throwable;
    }
  }

  protected classify(throwable: unknown): IntegerHolder {
    for (const [type, threshold] of this.thresholds.entries()) {
      if (throwable instanceof (type as new (...args: never[]) => unknown)) {
        return threshold;
      }
    }

    return RethrowOnThresholdExceptionHandler.ZERO;
  }

  private getCounter(
    context: RepeatContext,
    key: IntegerHolder,
  ): RepeatContextCounter {
    const attribute = `${RethrowOnThresholdExceptionHandler.name}.${key}`;
    // Creates a new counter and stores it in the correct context:
    return new RepeatContextCounter(context, attribute, this.useParent);
  }
}
