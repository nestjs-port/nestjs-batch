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
import type { JobParameters } from "./job-parameters.js";
import { JobParametersBuilder } from "./job-parameters-builder.js";
import type { JobParametersIncrementer } from "./job-parameters-incrementer.js";

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
