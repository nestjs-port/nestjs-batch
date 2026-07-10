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

import { describe, expect, it } from "vitest";
import type { RepeatContext } from "../../repeat-context.js";
import type { RepeatStatus } from "../../repeat-status.js";
import { CompositeCompletionPolicy } from "../composite-completion-policy.js";
import { MockCompletionPolicySupport } from "./mock-completion-policy-support.js";

describe("CompositeCompletionPolicy", () => {
  it("test empty policies", () => {
    const policy = new CompositeCompletionPolicy();
    const context = policy.start(null);
    expect(context).not.toBeNull();
    expect(policy.isComplete(context)).toBe(false);
  });

  it("test trivial policies", () => {
    const policy = new CompositeCompletionPolicy();
    policy.setPolicies([
      new MockCompletionPolicySupport(),
      new MockCompletionPolicySupport(),
    ]);
    const context = policy.start(null);
    expect(context.startedCount).toBe(0);
    expect(policy.isComplete(context)).toBe(false);
    expect(policy.isComplete(context, null)).toBe(false);
    policy.update(context);
    expect(context.startedCount).toBe(1);
  });

  it("test non-trivial policies", () => {
    const policy = new CompositeCompletionPolicy();
    policy.setPolicies([
      new MockCompletionPolicySupport(),
      new (class extends MockCompletionPolicySupport {
        override isComplete(_context: RepeatContext): boolean {
          return true;
        }
      })(),
    ]);
    const context = policy.start(null);
    expect(policy.isComplete(context)).toBe(true);
  });

  it("test non-trivial policies with result", () => {
    const policy = new CompositeCompletionPolicy();
    policy.setPolicies([
      new MockCompletionPolicySupport(),
      new (class extends MockCompletionPolicySupport {
        override isComplete(
          _context: RepeatContext,
          _result: RepeatStatus | null,
        ): boolean {
          return true;
        }
      })(),
    ]);
    const context = policy.start(null);
    expect(policy.isComplete(context, null)).toBe(true);
  });
});
