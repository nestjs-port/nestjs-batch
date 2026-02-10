import { JobExecutionException } from "../job-execution-exception";

export class InvalidJobParametersException extends JobExecutionException {
	constructor(message: string) {
		super(message);
	}
}
