/**
 * Enumeration representing the status of an execution.
 */
export enum BatchStatus {
	/*
	 * The order of the status values is significant because it can be used to aggregate a
	 * set of status values. The result should be the maximum value. Since {@code
	 * COMPLETED} is first in the order, only if all elements of an execution are {@code
	 * COMPLETED} can the aggregate status be COMPLETED. A running execution is expected
	 * to move from {@code STARTING} to {@code STARTED} to {@code COMPLETED} (through the
	 * order defined by {@link #upgradeTo(BatchStatus)}). Higher values than {@code
	 * STARTED} signify more serious failures. {@code ABANDONED} is used for steps that
	 * have finished processing but were not successful and where they should be skipped
	 * on a restart (so {@code FAILED} is the wrong status).
	 */

	/**
	 * The batch job has successfully completed its execution.
	 */
	COMPLETED = "COMPLETED",

	/**
	 * Status of a batch job prior to its execution.
	 */
	STARTING = "STARTING",

	/**
	 * Status of a batch job that is running.
	 */
	STARTED = "STARTED",

	/**
	 * Status of batch job waiting for a step to complete before stopping.
	 */
	STOPPING = "STOPPING",

	/**
	 * Status of a batch job that has been stopped by request.
	 */
	STOPPED = "STOPPED",

	/**
	 * Status of a batch job that has failed during its execution.
	 */
	FAILED = "FAILED",

	/**
	 * Status of a batch job that did not stop properly and can not be restarted.
	 */
	ABANDONED = "ABANDONED",

	/**
	 * Status of a batch job that is in an uncertain state.
	 */
	UNKNOWN = "UNKNOWN",
}

const STATUS_ORDER: BatchStatus[] = [
	BatchStatus.COMPLETED,
	BatchStatus.STARTING,
	BatchStatus.STARTED,
	BatchStatus.STOPPING,
	BatchStatus.STOPPED,
	BatchStatus.FAILED,
	BatchStatus.ABANDONED,
	BatchStatus.UNKNOWN,
];

/**
 * Utility functions for BatchStatus.
 */
export const BatchStatusUtils = {
	/**
	 * Returns the higher value status of the two statuses.
	 * @param status1 - first status to compare
	 * @param status2 - second status to compare
	 * @returns the higher value status
	 */
	max(status1: BatchStatus, status2: BatchStatus): BatchStatus {
		return this.isGreaterThan(status1, status2) ? status1 : status2;
	},

	/**
	 * Checks if the status indicates work is in progress.
	 * @param status - status to check
	 * @returns true if STARTING, STARTED, or STOPPING
	 */
	isRunning(status: BatchStatus): boolean {
		return (
			status === BatchStatus.STARTING ||
			status === BatchStatus.STARTED ||
			status === BatchStatus.STOPPING
		);
	},

	/**
	 * Checks if the status indicates execution was unsuccessful.
	 * @param status - status to check
	 * @returns true if FAILED or greater
	 */
	isUnsuccessful(status: BatchStatus): boolean {
		return (
			status === BatchStatus.FAILED ||
			this.isGreaterThan(status, BatchStatus.FAILED)
		);
	},

	/**
	 * Move status values through their logical progression.
	 * @param current - the current status
	 * @param other - the other status to compare
	 * @returns the appropriate status based on priority
	 */
	upgradeTo(current: BatchStatus, other: BatchStatus): BatchStatus {
		if (
			this.isGreaterThan(current, BatchStatus.STARTED) ||
			this.isGreaterThan(other, BatchStatus.STARTED)
		) {
			return this.max(current, other);
		}
		if (current === BatchStatus.COMPLETED || other === BatchStatus.COMPLETED) {
			return BatchStatus.COMPLETED;
		}
		return this.max(current, other);
	},

	/**
	 * Compares two statuses.
	 * @param status1 - first status
	 * @param status2 - second status
	 * @returns true if status1 is greater than status2
	 */
	isGreaterThan(status1: BatchStatus, status2: BatchStatus): boolean {
		return STATUS_ORDER.indexOf(status1) > STATUS_ORDER.indexOf(status2);
	},

	/**
	 * Compares two statuses.
	 * @param status1 - first status
	 * @param status2 - second status
	 * @returns true if status1 is less than status2
	 */
	isLessThan(status1: BatchStatus, status2: BatchStatus): boolean {
		return STATUS_ORDER.indexOf(status1) < STATUS_ORDER.indexOf(status2);
	},

	/**
	 * Find a BatchStatus that matches the beginning of the given value.
	 * @param value - a string representing a status
	 * @returns the matching BatchStatus or COMPLETED as default
	 */
	match(value: string): BatchStatus {
		for (const status of STATUS_ORDER) {
			if (value.startsWith(status)) {
				return status;
			}
		}
		return BatchStatus.COMPLETED;
	},
};
