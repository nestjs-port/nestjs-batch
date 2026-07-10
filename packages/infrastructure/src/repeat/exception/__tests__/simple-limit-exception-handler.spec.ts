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

import { beforeEach, describe, expect, it } from "vitest";
import { RepeatContextSupport } from "../../context/index.js";
import { SimpleLimitExceptionHandler } from "../simple-limit-exception-handler.js";

describe("SimpleLimitExceptionHandler", () => {
  let handler: SimpleLimitExceptionHandler;

  beforeEach(() => {
    handler = new SimpleLimitExceptionHandler();
    handler.onModuleInit();
  });

  it("test initialize with null context", () => {
    expect(() =>
      handler.handleException(
        null as unknown as RepeatContextSupport,
        new Error("foo"),
      ),
    ).toThrow("The context must be provided to initialize a counter");
  });

  it("test initialize with null context and null exception", () => {
    expect(() =>
      handler.handleException(null as unknown as RepeatContextSupport, null),
    ).toThrow("The context must be provided to initialize a counter");
  });

  it("test default behaviour", () => {
    const throwable = new Error("foo");
    expect(() =>
      handler.handleException(new RepeatContextSupport(null), throwable),
    ).toThrow(throwable);
  });

  it("test normal exception thrown", () => {
    /*
     * Other than nominated exception type should be rethrown, ignoring the exception
     * limit.
     */
    const throwable = new Error("foo");
    handler.setLimit(1);
    handler.setExceptionClasses([TypeError]);
    handler.onModuleInit();

    expect(() =>
      handler.handleException(new RepeatContextSupport(null), throwable),
    ).toThrow(throwable);
  });

  it("test limited exception type not thrown", () => {
    handler.setLimit(1);
    handler.setExceptionClasses([TypeError]);
    handler.onModuleInit();

    expect(() =>
      handler.handleException(
        new RepeatContextSupport(null),
        new TypeError("foo"),
      ),
    ).not.toThrow();
  });

  it("test limited exception not thrown from siblings", () => {
    /*
     * TransactionInvalidException should only be rethrown below the exception limit.
     */
    const throwable = new TypeError("foo");
    handler.setLimit(1);
    handler.setExceptionClasses([TypeError]);
    handler.onModuleInit();

    const parent = new RepeatContextSupport(null);

    expect(() => {
      let context = new RepeatContextSupport(parent);
      handler.handleException(context, throwable);
      context = new RepeatContextSupport(parent);
      handler.handleException(context, throwable);
    }).not.toThrow();
  });

  it("test limited exception thrown from siblings when using parent", () => {
    /*
     * TransactionInvalidException should only be rethrown below the exception limit.
     */
    const throwable = new TypeError("foo");
    handler.setLimit(1);
    handler.setExceptionClasses([TypeError]);
    handler.setUseParent(true);
    handler.onModuleInit();

    const parent = new RepeatContextSupport(null);

    expect(() => {
      let context = new RepeatContextSupport(parent);
      handler.handleException(context, throwable);
      context = new RepeatContextSupport(parent);
      handler.handleException(context, throwable);
    }).toThrow(throwable);
  });

  it("test exception not thrown below limit", () => {
    /**
     * Exceptions are swallowed until the exception limit is exceeded. After the limit is
     * exceeded exceptions are rethrown
     */
    const limit = 3;
    handler.setLimit(limit);
    handler.setExceptionClasses([TypeError]);
    handler.onModuleInit();

    const context = new RepeatContextSupport(null);
    for (let i = 0; i < limit; i += 1) {
      expect(() =>
        handler.handleException(
          context,
          new TypeError("below exception limit"),
        ),
      ).not.toThrow();
    }
  });

  it("test exception thrown above limit", () => {
    /**
     * TransactionInvalidExceptions are swallowed until the exception limit is exceeded.
     * After the limit is exceeded exceptions are rethrown as BatchCriticalExceptions
     */
    const limit = 3;
    handler.setLimit(limit);
    handler.setExceptionClasses([TypeError]);
    handler.onModuleInit();

    const context = new RepeatContextSupport(null);
    const exceptions = [
      ...Array.from(
        { length: limit },
        () => new TypeError("below exception limit"),
      ),
      new TypeError("above exception limit"),
    ];

    expect(() => {
      for (const exception of exceptions) {
        handler.handleException(context, exception);
      }
    }).toThrow("above exception limit");

    // after reaching the limit, behaviour should be idempotent
    expect(() =>
      handler.handleException(context, new TypeError("foo")),
    ).toThrow("foo");
  });
});
