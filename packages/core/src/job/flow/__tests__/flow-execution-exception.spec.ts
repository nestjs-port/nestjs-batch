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

import { FlowExecutionException } from "../flow-execution-exception.js";

describe("FlowExecutionException", () => {
  /** Test method for the string constructor. */
  it("test flow execution exception string", () => {
    const exception = new FlowExecutionException("foo");
    expect(exception.message).toBe("foo");
  });

  /** Test method for the string and throwable constructor. */
  it("test flow execution exception string throwable", () => {
    const exception = new FlowExecutionException("foo", new Error("bar"));
    expect(exception.message).toBe("foo");
    expect((exception.cause as Error).message).toBe("bar");
  });
});
