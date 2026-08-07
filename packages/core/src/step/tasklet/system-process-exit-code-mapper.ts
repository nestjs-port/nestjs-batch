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

import type { ExitStatus } from "../../exit-status.js";

/**
 * Maps the exit code of a system process to the {@link ExitStatus} returned by a
 * system command.
 */
export interface SystemProcessExitCodeMapper {
  /**
   * @param exitCode exit code returned by the system process
   * @returns the appropriate exit status for the system process exit code
   */
  getExitStatus(exitCode: number): ExitStatus;
}
