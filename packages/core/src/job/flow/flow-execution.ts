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

import type { FlowExecutionStatus } from "./flow-execution-status.js";

export class FlowExecution {
  private readonly _name: string;
  private readonly _status: FlowExecutionStatus;

  /**
   * @param name the flow name to be associated with the FlowExecution.
   * @param status the {@link FlowExecutionStatus} to be associated with the
   * FlowExecution.
   */
  constructor(name: string, status: FlowExecutionStatus) {
    this._name = name;
    this._status = status;
  }

  /** @return the name of the end state reached */
  get name(): string {
    return this._name;
  }

  /** @return the FlowExecutionStatus */
  get status(): FlowExecutionStatus {
    return this._status;
  }

  /**
   * Create an ordering on {@link FlowExecution} instances by comparing their statuses.
   * @param other the {@link FlowExecution} instance to compare with this instance.
   * @return negative, zero or positive as per the contract
   */
  compareTo(other: FlowExecution): number {
    return this._status.compareTo(other.status);
  }

  toString(): string {
    return `FlowExecution: name=${this._name}, status=${this._status}`;
  }
}
