import type { JobParameters } from "./job-parameters";

export interface JobParametersIncrementer {
	getNext(parameters: JobParameters): JobParameters;
}
