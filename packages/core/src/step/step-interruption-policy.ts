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

import type { StepExecution } from "./step-execution.js";

/**
 * Strategy interface for an interruption policy. This policy allows step
 * implementations to check if a job has been interrupted.
 */
export interface StepInterruptionPolicy {
  /**
   * Has the job been interrupted? If so, throw a JobInterruptedException.
   * @param stepExecution the current context of the running step
   * @throws {JobInterruptedException} when the job has been interrupted
   */
  checkInterrupted(stepExecution: StepExecution): void;
}
