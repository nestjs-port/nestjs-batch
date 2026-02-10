import type { JobParameters } from "./job-parameters";

export interface JobParametersValidator {
	validate(parameters: JobParameters): void;
}
