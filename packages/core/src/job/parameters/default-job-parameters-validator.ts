import { type Logger, LoggerFactory } from "@nestjs-batch/commons";
import { InvalidJobParametersException } from "./invalid-job-parameters-exception";
import type { JobParameters } from "./job-parameters";
import type { JobParametersValidator } from "./job-parameters-validator";

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
