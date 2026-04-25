import type { JobParameters } from "./job-parameters.js";

export interface JobParametersIncrementer {
  getNext(parameters: JobParameters): JobParameters;
}
