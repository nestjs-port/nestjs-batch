import { ExecutionContext } from "@nestjs-batch/infrastructure";
import { BatchStatus, BatchStatusUtils } from "../batch-status";
import { ExitStatus } from "../exit-status";
import type { JobExecution, JobParameters } from "../job";
import { StepContribution } from "./step-contribution";

/**
 * Batch domain object representation for the execution of a step.
 * Unlike JobExecution, additional properties are related to the processing
 * of items, such as commit count and others.
 */
export class StepExecution {
  private readonly _id: number;
  private readonly _stepName: string;
  private readonly _jobExecution: JobExecution;
  private _executionContext: ExecutionContext = new ExecutionContext();

  private _status: BatchStatus = BatchStatus.STARTING;
  private _exitStatus: ExitStatus = ExitStatus.EXECUTING;

  private _readCount = 0;
  private _writeCount = 0;
  private _commitCount = 0;
  private _rollbackCount = 0;
  private _readSkipCount = 0;
  private _processSkipCount = 0;
  private _writeSkipCount = 0;
  private _filterCount = 0;

  private _createTime: Date = new Date();
  private _startTime?: Date;
  private _endTime?: Date;
  private _lastUpdated?: Date;

  private _terminateOnly = false;
  private readonly _failureExceptions: Error[] = [];

  /**
   * Creates a new StepExecution.
   * @param id - the execution ID
   * @param stepName - the step name
   * @param jobExecution - the parent job execution
   */
  constructor(id: number, stepName: string, jobExecution: JobExecution) {
    this._id = id;
    this._stepName = stepName;
    this._jobExecution = jobExecution;
  }

  /**
   * Gets the execution ID.
   */
  get id(): number {
    return this._id;
  }

  /**
   * Gets the step name.
   */
  get stepName(): string {
    return this._stepName;
  }

  /**
   * Gets the parent job execution.
   */
  get jobExecution(): JobExecution {
    return this._jobExecution;
  }

  /**
   * Gets the execution context.
   */
  get executionContext(): ExecutionContext {
    return this._executionContext;
  }

  /**
   * Sets the execution context.
   */
  set executionContext(executionContext: ExecutionContext) {
    this._executionContext = executionContext;
  }

  /**
   * Gets the batch status.
   */
  get status(): BatchStatus {
    return this._status;
  }

  /**
   * Sets the batch status.
   */
  set status(status: BatchStatus) {
    this._status = status;
  }

  /**
   * Upgrade the status field if the provided value is greater.
   * @param status - the new status value
   */
  upgradeStatus(status: BatchStatus): void {
    this._status = BatchStatusUtils.upgradeTo(this._status, status);
  }

  /**
   * Gets the exit status.
   */
  get exitStatus(): ExitStatus {
    return this._exitStatus;
  }

  /**
   * Sets the exit status.
   */
  set exitStatus(exitStatus: ExitStatus) {
    this._exitStatus = exitStatus;
  }

  /**
   * Gets the read count.
   */
  get readCount(): number {
    return this._readCount;
  }

  /**
   * Sets the read count.
   */
  set readCount(readCount: number) {
    this._readCount = readCount;
  }

  /**
   * Gets the write count.
   */
  get writeCount(): number {
    return this._writeCount;
  }

  /**
   * Sets the write count.
   */
  set writeCount(writeCount: number) {
    this._writeCount = writeCount;
  }

  /**
   * Gets the commit count.
   */
  get commitCount(): number {
    return this._commitCount;
  }

  /**
   * Sets the commit count.
   */
  set commitCount(commitCount: number) {
    this._commitCount = commitCount;
  }

  /**
   * Increments the commit count.
   */
  incrementCommitCount(): void {
    this._commitCount++;
  }

  /**
   * Gets the rollback count.
   */
  get rollbackCount(): number {
    return this._rollbackCount;
  }

  /**
   * Sets the rollback count.
   */
  set rollbackCount(rollbackCount: number) {
    this._rollbackCount = rollbackCount;
  }

  /**
   * Increments the rollback count.
   */
  incrementRollbackCount(): void {
    this._rollbackCount++;
  }

  /**
   * Gets the filter count.
   */
  get filterCount(): number {
    return this._filterCount;
  }

  /**
   * Sets the filter count.
   */
  set filterCount(filterCount: number) {
    this._filterCount = filterCount;
  }

  /**
   * Gets the total skip count.
   */
  get skipCount(): number {
    return this._readSkipCount + this._processSkipCount + this._writeSkipCount;
  }

  /**
   * Gets the read skip count.
   */
  get readSkipCount(): number {
    return this._readSkipCount;
  }

  /**
   * Sets the read skip count.
   */
  set readSkipCount(readSkipCount: number) {
    this._readSkipCount = readSkipCount;
  }

  /**
   * Gets the write skip count.
   */
  get writeSkipCount(): number {
    return this._writeSkipCount;
  }

  /**
   * Sets the write skip count.
   */
  set writeSkipCount(writeSkipCount: number) {
    this._writeSkipCount = writeSkipCount;
  }

  /**
   * Gets the process skip count.
   */
  get processSkipCount(): number {
    return this._processSkipCount;
  }

  /**
   * Sets the process skip count.
   */
  set processSkipCount(processSkipCount: number) {
    this._processSkipCount = processSkipCount;
  }

  /**
   * Gets the create time.
   */
  get createTime(): Date {
    return this._createTime;
  }

  /**
   * Sets the create time.
   */
  set createTime(createTime: Date) {
    this._createTime = createTime;
  }

  /**
   * Gets the start time.
   */
  get startTime(): Date | undefined {
    return this._startTime;
  }

  /**
   * Sets the start time.
   */
  set startTime(startTime: Date | undefined) {
    this._startTime = startTime;
  }

  /**
   * Gets the end time.
   */
  get endTime(): Date | undefined {
    return this._endTime;
  }

  /**
   * Sets the end time.
   */
  set endTime(endTime: Date | undefined) {
    this._endTime = endTime;
  }

  /**
   * Gets the last updated time.
   */
  get lastUpdated(): Date | undefined {
    return this._lastUpdated;
  }

  /**
   * Sets the last updated time.
   */
  set lastUpdated(lastUpdated: Date | undefined) {
    this._lastUpdated = lastUpdated;
  }

  /**
   * Checks if terminate only flag is set.
   */
  get isTerminateOnly(): boolean {
    return this._terminateOnly;
  }

  /**
   * Sets the terminate only flag.
   */
  setTerminateOnly(): void {
    this._terminateOnly = true;
  }

  /**
   * Gets the failure exceptions.
   */
  get failureExceptions(): Error[] {
    return [...this._failureExceptions];
  }

  /**
   * Adds a failure exception.
   * @param error - the error to add
   */
  addFailureException(error: Error): void {
    this._failureExceptions.push(error);
  }

  /**
   * Gets the job parameters.
   */
  get jobParameters(): JobParameters {
    return this._jobExecution.jobParameters;
  }

  /**
   * Gets the job execution ID.
   */
  get jobExecutionId(): number {
    return this._jobExecution.id;
  }

  /**
   * Factory method for StepContribution.
   * @returns a new StepContribution
   */
  createStepContribution(): StepContribution {
    return new StepContribution(this);
  }

  /**
   * Apply the contribution to this step execution.
   * @param contribution - the contribution to apply
   */
  apply(contribution: StepContribution): void {
    this._readSkipCount += contribution.readSkipCount;
    this._writeSkipCount += contribution.writeSkipCount;
    this._processSkipCount += contribution.processSkipCount;
    this._filterCount += contribution.filterCount;
    this._readCount += contribution.readCount;
    this._writeCount += contribution.writeCount;
    this._exitStatus = this._exitStatus.and(contribution.exitStatus);
  }

  /**
   * Gets a summary string.
   */
  get summary(): string {
    return `StepExecution: id=${this._id}, name=${this._stepName}, status=${this._status}, exitStatus=${this._exitStatus.exitCode}, readCount=${this._readCount}, filterCount=${this._filterCount}, writeCount=${this._writeCount}, readSkipCount=${this._readSkipCount}, writeSkipCount=${this._writeSkipCount}, processSkipCount=${this._processSkipCount}, commitCount=${this._commitCount}, rollbackCount=${this._rollbackCount}`;
  }

  toString(): string {
    return `${this.summary}, exitDescription=${this._exitStatus.exitDescription}`;
  }
}
