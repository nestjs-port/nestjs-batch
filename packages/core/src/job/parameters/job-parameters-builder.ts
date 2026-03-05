import assert from "node:assert/strict";

import { JobParameter } from "./job-parameter";
import { JobParameters } from "./job-parameters";

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
