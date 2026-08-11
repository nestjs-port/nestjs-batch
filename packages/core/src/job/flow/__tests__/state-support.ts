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

import { StepExecution } from "../../../step/step-execution.js";
import { FlowExecutionStatus } from "../flow-execution-status.js";
import type { FlowExecutor } from "../flow-executor.interface.js";
import { AbstractState } from "../support/state/abstract-state.js";

/**
 * Base class for state implementations in test cases.
 */
export class StateSupport extends AbstractState {
  private static _stepExecutionId = 0;

  private _status: FlowExecutionStatus;

  constructor(
    name: string,
    status: FlowExecutionStatus = FlowExecutionStatus.COMPLETED,
  ) {
    super(name);
    this._status = status;
  }

  handle(executor: FlowExecutor): FlowExecutionStatus {
    const jobExecution = executor.getJobExecution();
    const stepExecution = new StepExecution(
      ++StateSupport._stepExecutionId,
      this.getName(),
      jobExecution,
    );
    jobExecution.addStepExecution(stepExecution);
    return this._status;
  }

  isEndState(): boolean {
    return false;
  }
}
