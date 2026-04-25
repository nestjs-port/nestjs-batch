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

import { JobParameters } from "../job-parameters.js";
import { JobParametersBuilder } from "../job-parameters-builder.js";
import { RunIdIncrementer } from "../run-id-incrementer.js";

describe("RunIdIncrementer", () => {
  const incrementer = new RunIdIncrementer();

  it("test get next", () => {
    const next = incrementer.getNext(new JobParameters());
    expect(next.getNumber("run.id")).toBe(1);
    const nextNext = incrementer.getNext(next);
    expect(nextNext.getNumber("run.id")).toBe(2);
  });

  it("test get next appends", () => {
    const jobParameters = new JobParametersBuilder()
      .addString("foo", "bar")
      .toJobParameters();
    const next = incrementer.getNext(jobParameters);
    expect(next.getNumber("run.id")).toBe(1);
    expect(next.getString("foo")).toBe("bar");
  });

  it("test get next named", () => {
    const namedIncrementer = new RunIdIncrementer();
    namedIncrementer.key = "foo";
    const next = namedIncrementer.getNext(new JobParameters());
    expect(next.getNumber("foo")).toBe(1);
  });

  it("test get next when run id is string", () => {
    // given
    const parameters = new JobParametersBuilder()
      .addString("run.id", "5")
      .toJobParameters();

    // when
    const next = incrementer.getNext(parameters);

    // then
    expect(next.getNumber("run.id")).toBe(6);
  });

  it("test get next when run id is invalid string", () => {
    const jobParameters = new JobParametersBuilder()
      .addString("run.id", "foo")
      .toJobParameters();
    expect(() => incrementer.getNext(jobParameters)).toThrow(
      "Invalid value for parameter run.id",
    );
  });
});
