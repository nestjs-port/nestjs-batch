/*
 * Copyright 2008-present the original author or authors.
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

import { ExitStatus } from "../../../exit-status.js";
import { SimpleSystemProcessExitCodeMapper } from "../simple-system-process-exit-code-mapper.js";

describe("SimpleSystemProcessExitCodeMapper", () => {
  const mapper = new SimpleSystemProcessExitCodeMapper();

  /**
   * 0 -> ExitStatus.COMPLETED else -> ExitStatus.FAILED
   */
  it("test mapping", () => {
    expect(mapper.getExitStatus(0)).toBe(ExitStatus.COMPLETED);
    expect(mapper.getExitStatus(1)).toBe(ExitStatus.FAILED);
    expect(mapper.getExitStatus(-1)).toBe(ExitStatus.FAILED);
  });
});
