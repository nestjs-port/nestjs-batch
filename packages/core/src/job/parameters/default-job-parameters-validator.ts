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

import { type Logger, LoggerFactory } from "@nestjs-port/core";
import { InvalidJobParametersException } from "./invalid-job-parameters-exception.js";
import type { JobParameters } from "./job-parameters.js";
import type { JobParametersValidator } from "./job-parameters-validator.js";

export class DefaultJobParametersValidator implements JobParametersValidator {
  private readonly _logger: Logger = LoggerFactory.getLogger(
    DefaultJobParametersValidator.name,
  );

  private _requiredKeys: Set<string>;

  private _optionalKeys: Set<string>;

  constructor(requiredKeys: string[] = [], optionalKeys: string[] = []) {
    this._requiredKeys = new Set(requiredKeys);
    this._optionalKeys = new Set(optionalKeys);
  }

  set requiredKeys(keys: string[]) {
    this._requiredKeys = new Set(keys);
  }

  set optionalKeys(keys: string[]) {
    this._optionalKeys = new Set(keys);
  }

  afterPropertiesSet(): void {
    for (const key of this._requiredKeys) {
      if (this._optionalKeys.has(key)) {
        throw new Error(`Optional keys cannot be required: ${key}`);
      }
    }
  }

  validate(parameters: JobParameters): void {
    if (parameters == null) {
      throw new InvalidJobParametersException(
        "The JobParameters can not be null",
      );
    }

    const keys = new Set<string>();
    for (const param of parameters) {
      keys.add(param.name);
    }

    // If there are explicit optional keys then all keys must be in that
    // group, or in the required group.
    if (this._optionalKeys.size > 0) {
      const unknownKeys: string[] = [];
      for (const key of keys) {
        if (!this._optionalKeys.has(key) && !this._requiredKeys.has(key)) {
          unknownKeys.push(key);
        }
      }
      if (unknownKeys.length > 0) {
        this._logger.warn(
          `The JobParameters contains keys that are not explicitly optional or required: [${unknownKeys.join(", ")}]`,
        );
      }
    }

    const missingKeys: string[] = [];

    for (const key of this._requiredKeys) {
      if (!keys.has(key)) {
        missingKeys.push(key);
      }
    }
    if (missingKeys.length > 0) {
      throw new InvalidJobParametersException(
        `The JobParameters do not contain required keys: [${missingKeys.join(", ")}]`,
      );
    }
  }
}
