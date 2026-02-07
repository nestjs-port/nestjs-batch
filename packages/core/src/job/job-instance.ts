/**
 * Batch domain object representing a uniquely identifiable job run.
 * JobInstance can be restarted multiple times in case of execution failure,
 * and its lifecycle ends only when the execution completes successfully.
 */
export class JobInstance {
	private readonly _jobName: string;
	private readonly _instanceId?: number;

	/**
	 * Creates a new JobInstance.
	 * @param instanceId - the instance ID
	 * @param jobName - the job name
	 */
	constructor(instanceId: number | undefined, jobName: string) {
		this._instanceId = instanceId;
		this._jobName = jobName;
	}

	/**
	 * Gets the job name.
	 * @returns the job name
	 */
	get jobName(): string {
		return this._jobName;
	}

	/**
	 * Gets the instance ID.
	 * @returns the instance ID
	 */
	get instanceId(): number | undefined {
		return this._instanceId;
	}

	toString(): string {
		return `JobInstance: id=${this._instanceId}, jobName=${this._jobName}`;
	}
}
