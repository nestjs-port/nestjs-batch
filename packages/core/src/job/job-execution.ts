/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { ExecutionContext } from "@nestjs-batch/infrastructure";
import { BatchStatus } from "../batch-status.js";
import { ExitStatus } from "../exit-status.js";
import type { JobInstance } from "./job-instance.js";
import { JobParameters } from "./parameters/index.js";

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
  private _startTime: Date | null = null;
  private _endTime: Date | null = null;
  private _lastUpdated: Date | null = null;

  /**
   * Creates a new JobExecution.
   * @param id - the execution ID
   * @param jobInstance - the job instance
   * @param jobParameters - the job parameters
   */
  constructor(
    id: number,
    jobInstance: JobInstance,
    jobParameters: JobParameters | null = null,
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
   * @returns the start time or null
   */
  get startTime(): Date | null {
    return this._startTime;
  }

  /**
   * Sets the start time.
   * @param startTime - the start time
   */
  set startTime(startTime: Date | null) {
    this._startTime = startTime;
  }

  /**
   * Gets the end time.
   * @returns the end time or null
   */
  get endTime(): Date | null {
    return this._endTime;
  }

  /**
   * Sets the end time.
   * @param endTime - the end time
   */
  set endTime(endTime: Date | null) {
    this._endTime = endTime;
  }

  /**
   * Gets the last updated time.
   * @returns the last updated time or null
   */
  get lastUpdated(): Date | null {
    return this._lastUpdated;
  }

  /**
   * Sets the last updated time.
   * @param lastUpdated - the last updated time
   */
  set lastUpdated(lastUpdated: Date | null) {
    this._lastUpdated = lastUpdated;
  }

  toString(): string {
    return `JobExecution: id=${this._id}, status=${this._status}, exitStatus=${this._exitStatus.exitCode}`;
  }
}
