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

import { JobExecutionException } from "../job/job-execution-exception.js";

/**
 * Checked exception that indicates a name clash when registering jobs.
 */
export class DuplicateJobException extends JobExecutionException {
  /**
   * Creates an exception with the given message.
   */
  constructor(message: string);
  /**
   * Creates an exception with the given message and cause.
   */
  constructor(message: string, cause: unknown);
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause);
  }
}
