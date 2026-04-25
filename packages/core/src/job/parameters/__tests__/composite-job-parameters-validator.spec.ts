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

import { beforeEach, describe, expect, it, vi } from "vitest";

import { CompositeJobParametersValidator } from "../composite-job-parameters-validator.js";
import { JobParameters } from "../job-parameters.js";
import type { JobParametersValidator } from "../job-parameters-validator.js";

describe("CompositeJobParametersValidator", () => {
  let compositeValidator: CompositeJobParametersValidator;
  const parameters = new JobParameters();

  beforeEach(() => {
    compositeValidator = new CompositeJobParametersValidator();
  });

  it("should throw when validators are not set", () => {
    expect(() => compositeValidator.afterPropertiesSet()).toThrow(
      "The 'validators' may not be empty",
    );
  });

  it("should throw when validators are empty", () => {
    compositeValidator.validators = [];
    expect(() => compositeValidator.afterPropertiesSet()).toThrow(
      "The 'validators' may not be empty",
    );
  });

  it("should invoke delegate validator", () => {
    const mockValidator: JobParametersValidator = {
      validate: vi.fn(),
    };
    compositeValidator.validators = [mockValidator];
    compositeValidator.validate(parameters);

    expect(mockValidator.validate).toHaveBeenCalledWith(parameters);
  });

  it("should invoke all delegate validators", () => {
    const mockValidator1: JobParametersValidator = {
      validate: vi.fn(),
    };
    const mockValidator2: JobParametersValidator = {
      validate: vi.fn(),
    };
    compositeValidator.validators = [mockValidator1, mockValidator2];
    compositeValidator.validate(parameters);

    expect(mockValidator1.validate).toHaveBeenCalledWith(parameters);
    expect(mockValidator2.validate).toHaveBeenCalledWith(parameters);
  });
});
