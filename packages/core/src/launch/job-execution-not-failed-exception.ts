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
 * Checked exception to indicate that user asked for a job execution to be
 * resumed when actually it didn't fail.
 *
 * @deprecated Use {@link JobRestartException} with a specific message instead.
 */
export class JobExecutionNotFailedException extends JobExecutionException {
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause);
  }
}
