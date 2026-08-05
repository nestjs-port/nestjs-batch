/*
 * Copyright 2024-present the original author or authors.
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

import { JobParameter } from "../../../job/parameters/job-parameter.js";
import { JobParameter as PersistenceJobParameter } from "../job-parameter.js";

export class JobParameterConverter {
  toJobParameter<T>(source: PersistenceJobParameter<T>): JobParameter<T> {
    const type = Object.getOwnPropertyDescriptor(globalThis, source.type)
      ?.value as (new (...args: never[]) => T) | undefined;

    if (type == null) {
      throw new Error(`Could not resolve job parameter type: ${source.type}`);
    }

    return new JobParameter(
      source.name,
      source.value,
      type,
      source.identifying,
    );
  }

  fromJobParameter<T>(source: JobParameter<T>): PersistenceJobParameter<T> {
    return new PersistenceJobParameter(
      source.name,
      source.value,
      source.type.name,
      source.identifying,
    );
  }
}
