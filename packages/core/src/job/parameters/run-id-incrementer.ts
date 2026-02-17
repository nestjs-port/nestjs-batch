import assert from "node:assert/strict";

import type { JobParametersIncrementer } from "./job-parameters-incrementer";
import type { JobParameters } from "./job-parameters";
import { JobParametersBuilder } from "./job-parameters-builder";
import { JobParameter } from "./job-parameter";

export class RunIdIncrementer implements JobParametersIncrementer {
  private static readonly RUN_ID_KEY = "run.id";

  private _key = RunIdIncrementer.RUN_ID_KEY;

  set key(value: string) {
    this._key = value;
  }

  getNext(parameters: JobParameters): JobParameters {
    assert(parameters != null, "JobParameters must not be null");
    const runIdParameter = parameters.getParameter(this._key);
    let id = 1;
    let isIdentifying = true;
    if (runIdParameter != null) {
      const parsed = Number(String(runIdParameter.value));
      if (Number.isNaN(parsed)) {
        throw new Error(`Invalid value for parameter ${this._key}`);
      }
      id = parsed + 1;
      isIdentifying = runIdParameter.identifying;
    }
    return new JobParametersBuilder(parameters)
      .addJobParameter(new JobParameter(this._key, id, Number, isIdentifying))
      .toJobParameters();
  }
}
