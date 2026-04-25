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

import { JobParameter } from "../job-parameter.js";

describe("JobParameter", () => {
  it("test constructor name not null", () => {
    expect(
      () => new JobParameter(null as unknown as string, "test", String, true),
    ).toThrow("name must not be null");
  });

  it("test constructor value not null", () => {
    expect(
      () => new JobParameter("param", null as unknown as string, String, true),
    ).toThrow("value must not be null");
  });

  it("test constructor type not null", () => {
    expect(
      () =>
        new JobParameter(
          "param",
          "test",
          null as unknown as new (...args: never[]) => string,
          true,
        ),
    ).toThrow("type must not be null");
  });

  it("test string parameter", () => {
    const jobParameter = new JobParameter("param", "test", String, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe("test");
    expect(jobParameter.type).toBe(String);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test long parameter", () => {
    const jobParameter = new JobParameter("param", 1, Number, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe(1);
    expect(jobParameter.type).toBe(Number);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test double parameter", () => {
    const jobParameter = new JobParameter("param", 1.1, Number, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toBe(1.1);
    expect(jobParameter.type).toBe(Number);
    expect(jobParameter.identifying).toBe(true);
  });

  it("test date parameter", () => {
    const epoch = new Date(0);
    const jobParameter = new JobParameter("param", epoch, Date, true);
    expect(jobParameter.name).toBe("param");
    expect(jobParameter.value).toEqual(new Date(0));
    expect(jobParameter.type).toBe(Date);
    expect(jobParameter.identifying).toBe(true);
  });

  // Job parameters are equal if their names are equal

  it("test equals", () => {
    const jobParameter = new JobParameter("param", "test1", String, true);
    const testParameter = new JobParameter("param", "test2", String, true);
    expect(jobParameter.equals(testParameter)).toBe(true);
  });
});
