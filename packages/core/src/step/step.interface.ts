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
 * Batch domain interface representing the configuration of a step. As with a
 * {@link Job}, a {@link Step} is meant to explicitly represent the configuration of a
 * developer but also the ability to execute the step.
 */
export interface Step {
  /**
   * The name of the step. This is used to distinguish between different steps and must
   * be unique within a job.
   */
  getName(): string;

  /** Whether a step that is already marked as complete can be started again. */
  isAllowStartIfComplete(): boolean;

  /** The number of times a step can be restarted for the same job instance. */
  getStartLimit(): number;

  /**
   * Process the step and assign progress and status meta information to the
   * {@link StepExecution} provided. The {@link Step} is responsible for setting the
   * meta information and also saving it, if required by the implementation.
   */
  execute(stepExecution: StepExecution): void;
}

/** The key to use when retrieving the batch step type. */
export const STEP_TYPE_KEY = "batch.stepType";
