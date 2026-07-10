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
import { RepeatException } from "../../repeat-exception.js";
import { RepeatStatus } from "../../repeat-status.js";
import { NestedRepeatCallback } from "../../callback/index.js";
import { RepeatSynchronizationManager, RepeatTemplate } from "../index.js";
import { CompletionPolicySupport } from "../../policy/completion-policy-support.js";
import { SimpleCompletionPolicy } from "../../policy/simple-completion-policy.js";

describe("SimpleRepeatTemplate", () => {
  let template: RepeatTemplate;
  let count: number;

  beforeEach(() => {
    count = 0;
    template = new RepeatTemplate();
    // default stop after more items than exist in dataset
    template.setCompletionPolicy(new SimpleCompletionPolicy(8));
  });

  const callback =
    (items = 5) =>
    (_context: RepeatContextSupport) => {
      if (count >= items) return RepeatStatus.FINISHED;
      count += 1;
      return RepeatStatus.CONTINUABLE;
    };

  it("test execute", () => {
    template.iterate({ doInIteration: callback() });
    expect(count).toBe(5);
  });

  /** Check that a dedicated TerminationPolicy can terminate the batch. */
  it("test early completion with policy", () => {
    template.setCompletionPolicy(new SimpleCompletionPolicy(2));
    template.iterate({ doInIteration: callback() });
    expect(count).toBe(2);
  });

  /** Check that a dedicated TerminationPolicy can terminate the batch. */
  it("test early completion with exception", () => {
    expect(() =>
      template.iterate({
        doInIteration: () => {
          count++;
          throw new Error("foo!");
        },
      }),
    ).toThrow("foo!");
    expect(count).toBe(1);
    expect(count).toBeLessThanOrEqual(10);
  });

  /** Check that the context is closed. */
  it("test context closed on normal completion", () => {
    const closed: string[] = [];
    const context = new (class extends RepeatContextSupport {
      close(): void {
        super.close();
        closed.push("close");
      }
    })(null);
    template.setCompletionPolicy(
      new (class extends CompletionPolicySupport {
        start(): RepeatContext {
          return context;
        }
      })(),
    );
    template.iterate({
      doInIteration: () => {
        count++;
        return RepeatStatus.continueIf(count < 1);
      },
    });
    expect(count).toBe(1);
    expect(closed).toHaveLength(1);
  });

  /** Check that the context is closed. */
  it("test context closed on abnormal completion", () => {
    const closed: string[] = [];
    const context = new (class extends RepeatContextSupport {
      close(): void {
        super.close();
        closed.push("close");
      }
    })(null);
    template.setCompletionPolicy(
      new (class extends CompletionPolicySupport {
        start(): RepeatContext {
          return context;
        }
      })(),
    );
    expect(() =>
      template.iterate({
        doInIteration: () => {
          count++;
          throw new Error("foo");
        },
      }),
    ).toThrow("foo");
    expect(count).toBe(1);
    expect(closed).toHaveLength(1);
  });

  /** Check that the exception handler is called. */
  it("test exception handler called on abnormal completion", () => {
    const handled: unknown[] = [];
    template.setExceptionHandler({
      handleException: (_context, throwable) => {
        handled.push(throwable);
        throw throwable;
      },
    });
    expect(() =>
      template.iterate({
        doInIteration: () => {
          count++;
          throw new Error("foo");
        },
      }),
    ).toThrow("foo");
    expect(count).toBe(1);
    expect(handled).toHaveLength(1);
  });

  /** Check that a the context can be used to signal early completion. */
  it("test early completion with context", () => {
    const result = template.iterate({
      doInIteration: (context) => {
        const value = callback(5)(context as RepeatContextSupport);
        if (count >= 2) {
          context.setCompleteOnly();
          // If we return null the batch will terminate anyway
          // without an exception...
        }
        return value;
      },
    });
    // 2 items were processed before completion signalled
    expect(count).toBe(2);
    // Not all items processed
    expect(result.isContinuable).toBe(true);
  });

  it("test nested session", () => {
    const outer = new RepeatTemplate();
    const inner = new RepeatTemplate();
    outer.iterate(
      new NestedRepeatCallback(inner, {
        doInIteration: (context) => {
          count++;
          expect(context).not.toBe(context.parent);
          expect(RepeatSynchronizationManager.getContext()).toBe(context);
          return RepeatStatus.FINISHED;
        },
      }),
    );
    expect(count).toBe(1);
  });

  /** Test that a result is returned from the batch. */
  it("test result", () => {
    const result = template.iterate({ doInIteration: callback() });
    expect(count).toBe(5);
    // We are complete - do not expect to be called again
    expect(result.isContinuable).toBe(false);
  });

  it("test exception unwrapping", () => {
    const exception = new Error("CRASH!");
    let listenerError: unknown;
    template.setExceptionHandler({
      handleException: (_context, throwable) => {
        listenerError = throwable;
        throw throwable;
      },
    });
    expect(() =>
      template.iterate({
        doInIteration: () => {
          throw new RepeatException(
            "typically thrown by nested repeat template",
            exception,
          );
        },
      }),
    ).toThrow("CRASH!");
    expect(listenerError).toBe(exception);
  });
});
