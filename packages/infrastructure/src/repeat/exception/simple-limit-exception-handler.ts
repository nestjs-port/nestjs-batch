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
import type { ExceptionHandler } from "./exception-handler.js";
import { RethrowOnThresholdExceptionHandler } from "./rethrow-on-threshold-exception-handler.js";

/**
 * Simple implementation of exception handler which looks for given exception types.
 * If one of the types is found then a counter is incremented and the limit is checked
 * to determine if it has been exceeded and the throwable should be rethrown. Also allows
 * specifying fatal exceptions that are immediately rethrown and never counted.
 */
export class SimpleLimitExceptionHandler implements ExceptionHandler {
  private readonly delegate = new RethrowOnThresholdExceptionHandler();

  private exceptionClasses: ErrorConstructor[] = [Error];
  private fatalExceptionClasses: ErrorConstructor[] = [Error];
  private limit = 0;

  /**
   * Convenience constructor for the {@link SimpleLimitExceptionHandler} to set the limit.
   */
  constructor(limit?: number) {
    if (limit != null) {
      this.limit = limit;
    }
  }

  /**
   * Apply the provided properties to create a delegate handler when the provider
   * is initialized by NestJS.
   */
  onModuleInit(): void {
    if (this.limit <= 0) {
      return;
    }

    const thresholds = new Map<Function, number>();
    for (const type of this.exceptionClasses) {
      thresholds.set(type, this.limit);
    }
    // do the fatalExceptionClasses last so they override the others
    for (const type of this.fatalExceptionClasses) {
      thresholds.set(type, 0);
    }
    this.delegate.setThresholds(thresholds);
  }

  /**
   * Flag to indicate the exception counters should be shared between sibling contexts
   * in a nested batch (i.e. inner loop). Default is false. Set this flag to true if you
   * want to count exceptions for the whole (outer) loop in a typical container.
   */
  setUseParent(useParent: boolean): void {
    this.delegate.setUseParent(useParent);
  }

  /**
   * Rethrows only if the limit is breached for this context on the exception type specified.
   */
  handleException(context: RepeatContext, throwable: unknown): void {
    this.delegate.handleException(context, throwable);
  }

  /**
   * The limit on the given exception type within a single context before it is rethrown.
   */
  setLimit(limit: number): void {
    this.limit = limit;
  }

  /**
   * Setter for the exception classes that this handler counts. Defaults to Error.
   */
  setExceptionClasses(classes: ErrorConstructor[]): void {
    this.exceptionClasses = [...classes];
  }

  /**
   * Setter for the exception classes that should not be counted, but rethrown immediately.
   * This list has higher priority than the exception classes list.
   */
  setFatalExceptionClasses(fatalExceptionClasses: ErrorConstructor[]): void {
    this.fatalExceptionClasses = [...fatalExceptionClasses];
  }
}
