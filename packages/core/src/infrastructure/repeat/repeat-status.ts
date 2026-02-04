/**
 * Enum representing the status of a repeat operation.
 */
export enum RepeatStatus {
  /**
   * Indicates that processing can continue.
   */
  CONTINUABLE = 'CONTINUABLE',

  /**
   * Indicates that processing is finished (either successful or unsuccessful).
   */
  FINISHED = 'FINISHED',
}

/**
 * Utility functions for RepeatStatus.
 */
export const RepeatStatusUtils = {
  /**
   * Returns CONTINUABLE if the condition is true, FINISHED otherwise.
   * @param continuable - the condition to check
   * @returns RepeatStatus based on the condition
   */
  continueIf(continuable: boolean): RepeatStatus {
    return continuable ? RepeatStatus.CONTINUABLE : RepeatStatus.FINISHED;
  },

  /**
   * Checks if the status indicates processing can continue.
   * @param status - the status to check
   * @returns true if the status is CONTINUABLE
   */
  isContinuable(status: RepeatStatus): boolean {
    return status === RepeatStatus.CONTINUABLE;
  },

  /**
   * Combines a status with a boolean condition.
   * @param status - the current status
   * @param value - the boolean condition
   * @returns CONTINUABLE if both status is CONTINUABLE and value is true
   */
  and(status: RepeatStatus, value: boolean): RepeatStatus {
    return value && status === RepeatStatus.CONTINUABLE
      ? RepeatStatus.CONTINUABLE
      : RepeatStatus.FINISHED;
  },
};
