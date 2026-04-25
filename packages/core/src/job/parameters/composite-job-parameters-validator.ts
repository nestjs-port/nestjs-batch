import type { JobParameters } from "./job-parameters.js";
import type { JobParametersValidator } from "./job-parameters-validator.js";

export class CompositeJobParametersValidator implements JobParametersValidator {
  private _validators: JobParametersValidator[] = [];

  validate(parameters: JobParameters): void {
    for (const validator of this._validators) {
      validator.validate(parameters);
    }
  }

  set validators(validators: JobParametersValidator[]) {
    this._validators = validators;
  }

  afterPropertiesSet(): void {
    if (this._validators.length === 0) {
      throw new Error("The 'validators' may not be empty");
    }
  }
}
