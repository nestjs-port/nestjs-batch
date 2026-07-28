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

import type { FlowExecution } from "./flow-execution.js";
import type { FlowExecutor } from "./flow-executor.interface.js";
import type { State } from "./state.interface.js";

export interface Flow {
  /** @return the name of the flow */
  getName(): string;

  /**
   * Retrieve the state with the given name. If there is no state with the given
   * name, then return null.
   * @param stateName the name of the state to retrieve
   * @return the state
   */
  getState(stateName: string): State | null;

  /**
   * @param executor the {@link FlowExecutor} instance to use for the flow
   * execution
   * @return a {@link FlowExecution} containing the exit status of the flow
   * @throws {@link FlowExecutionException} thrown if an error occurs during
   * flow execution
   */
  start(executor: FlowExecutor): FlowExecution;

  /**
   * @param stateName the name of the state to resume on
   * @param executor the context to be passed into each state executed
   * @return a {@link FlowExecution} containing the exit status of the flow
   * @throws {@link FlowExecutionException} thrown if an error occurs during
   * flow execution
   */
  resume(stateName: string, executor: FlowExecutor): FlowExecution;

  /**
   * Convenient accessor for clients needing to explore the states of this flow.
   * @return the states
   */
  getStates(): State[];
}
