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

import { ExitStatus } from "../exit-status.js";
import type { StepExecution } from "./step-execution.js";

/**
 * Represents a contribution to a {@link StepExecution}, buffering changes until they can
 * be applied at a chunk boundary.
 */
export class StepContribution {
  private readonly _stepExecution: StepExecution;
  private readonly _parentSkipCount: number;

  private _readCount = 0;
  private _writeCount = 0;
  private _filterCount = 0;
  private _readSkipCount = 0;
  private _writeSkipCount = 0;
  private _processSkipCount = 0;
  private _exitStatus: ExitStatus = ExitStatus.EXECUTING;

  /**
   * Creates a new StepContribution.
   * @param execution - the StepExecution used to initialize skipCount
   */
  constructor(execution: StepExecution) {
    this._stepExecution = execution;
    this._parentSkipCount = execution.skipCount;
  }

  /**
   * Set the ExitStatus for this contribution.
   * @param status - ExitStatus instance to set
   */
  set exitStatus(status: ExitStatus) {
    this._exitStatus = status;
  }

  /**
   * Gets the ExitStatus for this contribution.
   * @returns the ExitStatus
   */
  get exitStatus(): ExitStatus {
    return this._exitStatus;
  }

  /**
   * Increment the counter for the number of filtered items.
   * @param count - the amount to increment by (default: 1)
   */
  incrementFilterCount(count = 1): void {
    this._filterCount += count;
  }

  /**
   * Increment the counter for the number of items read.
   */
  incrementReadCount(): void {
    this._readCount++;
  }

  /**
   * Increment the counter for the number of items written.
   * @param count - the amount to increment by
   */
  incrementWriteCount(count: number): void {
    this._writeCount += count;
  }

  /**
   * Gets the read item counter.
   * @returns the read count
   */
  get readCount(): number {
    return this._readCount;
  }

  /**
   * Gets the write item counter.
   * @returns the write count
   */
  get writeCount(): number {
    return this._writeCount;
  }

  /**
   * Gets the filter counter.
   * @returns the filter count
   */
  get filterCount(): number {
    return this._filterCount;
  }

  /**
   * Gets the sum of skips accumulated in the parent StepExecution and this StepContribution.
   * @returns the total step skip count
   */
  get stepSkipCount(): number {
    return (
      this._readSkipCount +
      this._writeSkipCount +
      this._processSkipCount +
      this._parentSkipCount
    );
  }

  /**
   * Gets the number of skips collected in this StepContribution.
   * @returns the skip count (not including parent)
   */
  get skipCount(): number {
    return this._readSkipCount + this._writeSkipCount + this._processSkipCount;
  }

  /**
   * Increment the read skip count.
   * @param count - the amount to increment by (default: 1)
   */
  incrementReadSkipCount(count = 1): void {
    this._readSkipCount += count;
  }

  /**
   * Increment the write skip count.
   * @param count - the amount to increment by (default: 1)
   */
  incrementWriteSkipCount(count = 1): void {
    this._writeSkipCount += count;
  }

  /**
   * Increment the process skip count.
   * @param count - the amount to increment by (default: 1)
   */
  incrementProcessSkipCount(count = 1): void {
    this._processSkipCount += count;
  }

  /**
   * Gets the read skip count.
   * @returns the read skip count
   */
  get readSkipCount(): number {
    return this._readSkipCount;
  }

  /**
   * Gets the write skip count.
   * @returns the write skip count
   */
  get writeSkipCount(): number {
    return this._writeSkipCount;
  }

  /**
   * Gets the process skip count.
   * @returns the process skip count
   */
  get processSkipCount(): number {
    return this._processSkipCount;
  }

  /**
   * Gets the parent step execution of this contribution.
   * @returns the parent step execution
   */
  get stepExecution(): StepExecution {
    return this._stepExecution;
  }
}
