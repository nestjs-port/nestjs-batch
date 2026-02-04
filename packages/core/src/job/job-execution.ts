import { BatchStatus } from '../batch-status';
import { ExecutionContext } from '../execution-context';
import { ExitStatus } from '../exit-status';
import type { JobInstance } from './job-instance';
import { JobParameters } from './parameters/job-parameters';

/**
 * Batch domain object representing the execution of a job.
 */
export class JobExecution {
  private readonly _id: number;
  private readonly _jobInstance: JobInstance;
  private readonly _jobParameters: JobParameters;
  private readonly _executionContext: ExecutionContext;
  private _status: BatchStatus = BatchStatus.STARTING;
  private _exitStatus: ExitStatus = ExitStatus.UNKNOWN;
  private _createTime: Date = new Date();
  private _startTime?: Date;
  private _endTime?: Date;
  private _lastUpdated?: Date;

  /**
   * Creates a new JobExecution.
   * @param id - the execution ID
   * @param jobInstance - the job instance
   * @param jobParameters - the job parameters
   */
  constructor(
    id: number,
    jobInstance: JobInstance,
    jobParameters?: JobParameters,
  ) {
    this._id = id;
    this._jobInstance = jobInstance;
    this._jobParameters = jobParameters ?? new JobParameters();
    this._executionContext = new ExecutionContext();
  }

  /**
   * Gets the execution ID.
   * @returns the ID
   */
  get id(): number {
    return this._id;
  }

  /**
   * Gets the job instance.
   * @returns the job instance
   */
  get jobInstance(): JobInstance {
    return this._jobInstance;
  }

  /**
   * Gets the job parameters.
   * @returns the job parameters
   */
  get jobParameters(): JobParameters {
    return this._jobParameters;
  }

  /**
   * Gets the execution context.
   * @returns the execution context
   */
  get executionContext(): ExecutionContext {
    return this._executionContext;
  }

  /**
   * Gets the batch status.
   * @returns the status
   */
  get status(): BatchStatus {
    return this._status;
  }

  /**
   * Sets the batch status.
   * @param status - the new status
   */
  set status(status: BatchStatus) {
    this._status = status;
  }

  /**
   * Gets the exit status.
   * @returns the exit status
   */
  get exitStatus(): ExitStatus {
    return this._exitStatus;
  }

  /**
   * Sets the exit status.
   * @param exitStatus - the new exit status
   */
  set exitStatus(exitStatus: ExitStatus) {
    this._exitStatus = exitStatus;
  }

  /**
   * Gets the create time.
   * @returns the create time
   */
  get createTime(): Date {
    return this._createTime;
  }

  /**
   * Sets the create time.
   * @param createTime - the create time
   */
  set createTime(createTime: Date) {
    this._createTime = createTime;
  }

  /**
   * Gets the start time.
   * @returns the start time or undefined
   */
  get startTime(): Date | undefined {
    return this._startTime;
  }

  /**
   * Sets the start time.
   * @param startTime - the start time
   */
  set startTime(startTime: Date | undefined) {
    this._startTime = startTime;
  }

  /**
   * Gets the end time.
   * @returns the end time or undefined
   */
  get endTime(): Date | undefined {
    return this._endTime;
  }

  /**
   * Sets the end time.
   * @param endTime - the end time
   */
  set endTime(endTime: Date | undefined) {
    this._endTime = endTime;
  }

  /**
   * Gets the last updated time.
   * @returns the last updated time or undefined
   */
  get lastUpdated(): Date | undefined {
    return this._lastUpdated;
  }

  /**
   * Sets the last updated time.
   * @param lastUpdated - the last updated time
   */
  set lastUpdated(lastUpdated: Date | undefined) {
    this._lastUpdated = lastUpdated;
  }

  toString(): string {
    return `JobExecution: id=${this._id}, status=${this._status}, exitStatus=${this._exitStatus.exitCode}`;
  }
}
