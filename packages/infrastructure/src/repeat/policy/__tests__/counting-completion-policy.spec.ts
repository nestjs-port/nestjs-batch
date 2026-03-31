/*
 * Copyright 2006-2022 the original author or authors.
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
import { RepeatContextSupport } from "../../context";
import type { RepeatContext } from "../../repeat-context";
import { RepeatStatus } from "../../repeat-status";
import { CountingCompletionPolicy } from "../counting-completion-policy";

describe("CountingCompletionPolicy", () => {
  it("test default behaviour", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      protected override getCount(): number {
        return 1;
      }
    }

    const policy = new TestCountingCompletionPolicy();
    const context = policy.start(null as unknown as RepeatContext);
    expect(policy.isComplete(context)).toBe(true);
  });

  it("test null result", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      protected override getCount(): number {
        return 1;
      }
    }

    const policy = new TestCountingCompletionPolicy();
    policy.setMaxCount(10);
    const context = policy.start(null as unknown as RepeatContext);
    expect(policy.isComplete(context, null as unknown as RepeatStatus)).toBe(true);
  });

  it("test finished result", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      protected override getCount(): number {
        return 1;
      }
    }

    const policy = new TestCountingCompletionPolicy();
    policy.setMaxCount(10);
    const context = policy.start(null as unknown as RepeatContext);
    expect(policy.isComplete(context, RepeatStatus.FINISHED)).toBe(true);
  });

  it("test default behaviour with update", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      private count = 0;

      protected override getCount(): number {
        return this.count;
      }

      protected override doUpdate(_context: RepeatContext): number {
        this.count += 1;
        return 1;
      }
    }

    const policy = new TestCountingCompletionPolicy();
    policy.setMaxCount(2);
    const context = policy.start(null as unknown as RepeatContext);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(false);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(true);
  });

  it("test update not saved across session", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      private count = 0;

      protected override getCount(): number {
        return this.count;
      }

      protected override doUpdate(_context: RepeatContext): number {
        super.doUpdate(_context);
        this.count += 1;
        return 1;
      }

      override start(context: RepeatContext): RepeatContext {
        this.count = 0;
        return super.start(context);
      }
    }

    const policy = new TestCountingCompletionPolicy();
    policy.setMaxCount(2);
    const session = new RepeatContextSupport(null);
    let context = policy.start(session);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(false);
    context = policy.start(session);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(false);
  });

  it("test update saved across session", () => {
    class TestCountingCompletionPolicy extends CountingCompletionPolicy {
      private count = 0;

      protected override getCount(): number {
        return this.count;
      }

      protected override doUpdate(_context: RepeatContext): number {
        super.doUpdate(_context);
        this.count += 1;
        return 1;
      }

      override start(context: RepeatContext): RepeatContext {
        this.count = 0;
        return super.start(context);
      }
    }

    const policy = new TestCountingCompletionPolicy();
    policy.setMaxCount(2);
    policy.setUseParent(true);
    const session = new RepeatContextSupport(null);
    let context = policy.start(session);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(false);
    context = policy.start(session);
    policy.update(context);
    expect(policy.isComplete(context)).toBe(true);
  });
});
