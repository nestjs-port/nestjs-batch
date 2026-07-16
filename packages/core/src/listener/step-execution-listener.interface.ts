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

import type { ExitStatus } from "../exit-status.js";
import type { StepExecution } from "../step/step-execution.js";
import type { StepListener } from "./step-listener.js";

/** Listener interface for the lifecycle of a step. */
export interface StepExecutionListener extends StepListener {
  /** Initialize the state of the listener with the current step execution. */
  beforeStep?(stepExecution: StepExecution): void;
  /** Give a listener a chance to modify the exit status from a step. */
  afterStep?(stepExecution: StepExecution): ExitStatus | null;
}
