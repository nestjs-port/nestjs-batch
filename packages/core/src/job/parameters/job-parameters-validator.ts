import type { JobParameters } from "./job-parameters.js";

export interface JobParametersValidator {
  validate(parameters: JobParameters): void;
}
