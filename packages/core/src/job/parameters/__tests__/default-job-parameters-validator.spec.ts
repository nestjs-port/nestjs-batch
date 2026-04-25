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

import { DefaultJobParametersValidator } from "../default-job-parameters-validator.js";
import { InvalidJobParametersException } from "../invalid-job-parameters-exception.js";
import { JobParameters } from "../job-parameters.js";
import { JobParametersBuilder } from "../job-parameters-builder.js";

describe("DefaultJobParametersValidator", () => {
  const validator = new DefaultJobParametersValidator();

  it("should throw on null parameters", () => {
    expect(() => validator.validate(null as unknown as JobParameters)).toThrow(
      InvalidJobParametersException,
    );
  });

  it("should validate with no required values", () => {
    expect(() =>
      validator.validate(
        new JobParametersBuilder().addString("name", "foo").toJobParameters(),
      ),
    ).not.toThrow();
  });

  it("should validate when required values are present", () => {
    const v = new DefaultJobParametersValidator();
    v.requiredKeys = ["name", "value"];
    expect(() =>
      v.validate(
        new JobParametersBuilder()
          .addString("name", "foo")
          .addNumber("value", 111)
          .toJobParameters(),
      ),
    ).not.toThrow();
  });

  it("should throw when required values are missing", () => {
    const v = new DefaultJobParametersValidator();
    v.requiredKeys = ["name", "value"];
    expect(() => v.validate(new JobParameters())).toThrow(
      InvalidJobParametersException,
    );
  });

  it("should validate with optional values", () => {
    const v = new DefaultJobParametersValidator();
    v.optionalKeys = ["name", "value"];
    expect(() => v.validate(new JobParameters())).not.toThrow();
  });

  it("should not throw for implicit required key when optional keys are set", () => {
    const v = new DefaultJobParametersValidator();
    v.optionalKeys = ["name", "value"];
    const jobParameters = new JobParametersBuilder()
      .addString("foo", "bar")
      .toJobParameters();
    expect(() => v.validate(jobParameters)).not.toThrow();
  });

  it("should validate optional with explicit required key", () => {
    const v = new DefaultJobParametersValidator();
    v.optionalKeys = ["name", "value"];
    v.requiredKeys = ["foo"];
    expect(() =>
      v.validate(
        new JobParametersBuilder().addString("foo", "bar").toJobParameters(),
      ),
    ).not.toThrow();
  });

  it("should throw when optional values are also required", () => {
    const v = new DefaultJobParametersValidator();
    v.optionalKeys = ["name", "value"];
    v.requiredKeys = ["foo", "value"];
    expect(() => v.afterPropertiesSet()).toThrow(Error);
  });
});
