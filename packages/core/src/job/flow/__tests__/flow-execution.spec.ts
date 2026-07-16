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

import { FlowExecution } from "../flow-execution.js";
import { FlowExecutionStatus } from "../flow-execution-status.js";

describe("FlowExecution", () => {
  it("test basic properties", () => {
    const execution = new FlowExecution("foo", new FlowExecutionStatus("BAR"));
    expect(execution.name).toBe("foo");
    expect(execution.status.name).toBe("BAR");
  });

  it("test alpha ordering", () => {
    const first = new FlowExecution("foo", new FlowExecutionStatus("BAR"));
    const second = new FlowExecution("foo", new FlowExecutionStatus("SPAM"));
    expect(first.compareTo(second)).toBeLessThan(0);
    expect(second.compareTo(first)).toBeGreaterThan(0);
  });

  it("test enum ordering", () => {
    const first = new FlowExecution("foo", FlowExecutionStatus.COMPLETED);
    const second = new FlowExecution("foo", FlowExecutionStatus.FAILED);
    expect(first.compareTo(second)).toBeLessThan(0);
    expect(second.compareTo(first)).toBeGreaterThan(0);
  });

  it("test enum starts with ordering", () => {
    const first = new FlowExecution(
      "foo",
      new FlowExecutionStatus("COMPLETED.BAR"),
    );
    const second = new FlowExecution(
      "foo",
      new FlowExecutionStatus("FAILED.FOO"),
    );
    expect(first.compareTo(second)).toBeLessThan(0);
    expect(second.compareTo(first)).toBeGreaterThan(0);
  });

  it("test enum starts with alpha ordering", () => {
    const first = new FlowExecution(
      "foo",
      new FlowExecutionStatus("COMPLETED.BAR"),
    );
    const second = new FlowExecution(
      "foo",
      new FlowExecutionStatus("COMPLETED.FOO"),
    );
    expect(first.compareTo(second)).toBeLessThan(0);
    expect(second.compareTo(first)).toBeGreaterThan(0);
  });

  it("test enum and alpha", () => {
    const first = new FlowExecution("foo", new FlowExecutionStatus("ZZZZZ"));
    const second = new FlowExecution(
      "foo",
      new FlowExecutionStatus("FAILED.FOO"),
    );
    expect(first.compareTo(second)).toBeLessThan(0);
    expect(second.compareTo(first)).toBeGreaterThan(0);
  });
});
