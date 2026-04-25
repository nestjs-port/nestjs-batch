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

import assert from "node:assert/strict";

import { JobParameter } from "./job-parameter.js";
import { JobParameters } from "./job-parameters.js";

export class JobParametersBuilder {
  private readonly _parameters: Map<string, JobParameter>;

  constructor(jobParameters: JobParameters | null = null) {
    this._parameters = new Map();
    if (jobParameters) {
      for (const param of jobParameters) {
        this._parameters.set(param.name, param);
      }
    }
  }

  addString(name: string, value: string, identifying = true): this {
    assert(value != null, `Value for parameter '${name}' must not be null`);
    this.addJobParameter(new JobParameter(name, value, String, identifying));
    return this;
  }

  addNumber(name: string, value: number, identifying = true): this {
    assert(value != null, `Value for parameter '${name}' must not be null`);
    this.addJobParameter(new JobParameter(name, value, Number, identifying));
    return this;
  }

  addDate(name: string, value: Date, identifying = true): this {
    assert(value != null, `Value for parameter '${name}' must not be null`);
    this.addJobParameter(new JobParameter(name, value, Date, identifying));
    return this;
  }

  addJobParameter(jobParameter: JobParameter): this;
  addJobParameter<T>(
    name: string,
    value: T,
    type: new (...args: never[]) => T,
    identifying: boolean,
  ): this;
  addJobParameter<T>(
    name: string,
    value: T,
    type: new (...args: never[]) => T,
  ): this;
  addJobParameter<T>(
    jobParameterOrName: JobParameter | string,
    value: T | null = null,
    type: (new (...args: never[]) => T) | null = null,
    identifying: boolean | null = null,
  ): this {
    if (jobParameterOrName instanceof JobParameter) {
      assert(jobParameterOrName != null, "JobParameter must not be null");
      this._parameters.set(jobParameterOrName.name, jobParameterOrName);
      return this;
    }
    const name = jobParameterOrName;
    assert(value != null, `Value for parameter '${name}' must not be null`);
    assert(type != null, `Type for parameter '${name}' must not be null`);
    return this.addJobParameter(
      new JobParameter(name, value as T, type, identifying ?? true),
    );
  }

  addJobParameters(jobParameters: JobParameters): this {
    assert(jobParameters != null, "jobParameters must not be null");
    for (const param of jobParameters) {
      this.addJobParameter(param);
    }
    return this;
  }

  toJobParameters(): JobParameters {
    return new JobParameters(this._parameters);
  }
}
