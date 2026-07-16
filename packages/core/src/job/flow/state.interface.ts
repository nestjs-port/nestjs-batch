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
import type { FlowExecutor } from "./flow-executor.js";

export interface State {
  /** The name of the state. Should be unique within a flow. */
  getName(): string;
  /** Handle processing logic and return a status that drives the flow. */
  handle(executor: FlowExecutor): FlowExecutionStatus;
  /** Inquire as to whether this state is an end state. */
  isEndState(): boolean;
}
