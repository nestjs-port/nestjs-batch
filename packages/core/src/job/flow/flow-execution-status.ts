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

/** Represents the status of {@link FlowExecution}. */
export class FlowExecutionStatus {
  /** Special well-known status value. */
  static readonly COMPLETED = new FlowExecutionStatus("COMPLETED");
  /** Special well-known status value. */
  static readonly STOPPED = new FlowExecutionStatus("STOPPED");
  /** Special well-known status value. */
  static readonly FAILED = new FlowExecutionStatus("FAILED");
  /** Special well-known status value. */
  static readonly UNKNOWN = new FlowExecutionStatus("UNKNOWN");

  private readonly _name: string;

  constructor(status: string) {
    this._name = status;
  }

  /** @return true if the status starts with "STOPPED" */
  isStop(): boolean {
    return this._name.startsWith(FlowExecutionStatus.STOPPED.name);
  }

  /** @return true if the status starts with "FAILED" */
  isFail(): boolean {
    return this._name.startsWith(FlowExecutionStatus.FAILED.name);
  }

  /** @return true if this status represents the end of a flow */
  isEnd(): boolean {
    return this.isStop() || this.isFail() || this.isComplete();
  }

  /** @return true if the status starts with "COMPLETED" */
  private isComplete(): boolean {
    return this._name.startsWith(FlowExecutionStatus.COMPLETED.name);
  }

  /**
   * Create an ordering on {@link FlowExecutionStatus} instances by comparing their
   * statuses.
   * @param other instance of {@link FlowExecutionStatus} to compare this instance with.
   * @return negative, zero or positive as per the contract
   */
  compareTo(other: FlowExecutionStatus): number {
    const one = FlowExecutionStatus.match(this._name);
    const two = FlowExecutionStatus.match(other._name);
    const comparison = one - two;
    if (comparison === 0) {
      return this._name < other._name ? -1 : this._name > other._name ? 1 : 0;
    }
    return comparison;
  }

  toString(): string {
    return this._name;
  }

  /** @return the name of this status */
  get name(): string {
    return this._name;
  }

  private static match(value: string): number {
    if (value.startsWith("COMPLETED")) return 0;
    if (value.startsWith("STOPPED")) return 1;
    if (value.startsWith("FAILED")) return 2;
    if (value.startsWith("UNKNOWN")) return 3;
    return 0;
  }
}
