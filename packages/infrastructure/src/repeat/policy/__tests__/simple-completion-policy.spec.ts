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
import type { RepeatContext } from "../../repeat-context.js";
import { RepeatStatus } from "../../repeat-status.js";
import { SimpleCompletionPolicy } from "../simple-completion-policy.js";

describe("SimpleCompletionPolicy", () => {
  const policy = new SimpleCompletionPolicy();
  const dummy = RepeatStatus.CONTINUABLE;
  let context: RepeatContext;

  beforeEach(() => {
    context = policy.start(null as unknown as RepeatContext);
  });

  it("test termination after default size", () => {
    for (let i = 0; i < SimpleCompletionPolicy.DEFAULT_CHUNK_SIZE - 1; i += 1) {
      policy.update(context);
      expect(policy.isComplete(context, dummy)).toBe(false);
    }

    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(true);
  });

  it("test termination after explicit chunk size", () => {
    const chunkSize = 2;
    policy.setChunkSize(chunkSize);

    for (let i = 0; i < chunkSize - 1; i += 1) {
      policy.update(context);
      expect(policy.isComplete(context, dummy)).toBe(false);
    }

    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(true);
  });

  it("test termination after null result", () => {
    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(false);
    policy.update(context);
    expect(policy.isComplete(context, null as unknown as RepeatStatus)).toBe(
      true,
    );
  });

  it("test reset", () => {
    policy.setChunkSize(2);
    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(false);
    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(true);
    context = policy.start(null as unknown as RepeatContext);
    policy.update(context);
    expect(policy.isComplete(context, dummy)).toBe(false);
  });
});
