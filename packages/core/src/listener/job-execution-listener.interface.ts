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

import type { JobExecution } from "../job/job-execution.js";

/**
 * Provide callbacks at specific points in the lifecycle of a {@link Job}.
 * Implementations can be stateful if they are careful to either ensure thread
 * safety or to use one instance of a listener per job.
 */
export interface JobExecutionListener {
  /**
   * Callback before a job executes.
   * @param jobExecution the current {@link JobExecution}
   */
  beforeJob?(jobExecution: JobExecution): void;

  /**
   * Callback after completion of a job. Called after both successful and failed
   * executions. To perform logic on a particular status, inspect
   * {@link JobExecution.status}.
   * @param jobExecution the current {@link JobExecution}
   */
  afterJob?(jobExecution: JobExecution): void;
}
