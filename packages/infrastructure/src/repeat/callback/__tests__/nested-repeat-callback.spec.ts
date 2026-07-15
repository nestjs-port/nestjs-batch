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

import { NestedRepeatCallback } from "../nested-repeat-callback.js";
import { RepeatStatus } from "../../repeat-status.js";
import type { RepeatCallback } from "../../repeat-callback.js";
import { RepeatTemplate } from "../../support/repeat-template.js";

describe("NestedRepeatCallback", () => {
  it("test execute", () => {
    let count = 0;
    const callback: RepeatCallback = {
      doInIteration: () => {
        count++;
        return RepeatStatus.continueIf(count <= 1);
      },
    };
    const template = new RepeatTemplate();
    const nestedRepeatCallback = new NestedRepeatCallback(template, callback);

    const result = nestedRepeatCallback.doInIteration(null as never);

    expect(count).toBe(2);
    // False because processing has finished
    expect(result.isContinuable).toBe(false);
  });
});
