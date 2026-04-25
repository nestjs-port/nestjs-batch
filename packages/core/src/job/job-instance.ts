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

/**
 * Batch domain object representing a uniquely identifiable job run.
 * JobInstance can be restarted multiple times in case of execution failure,
 * and its lifecycle ends only when the execution completes successfully.
 */
export class JobInstance {
  private readonly _jobName: string;
  private readonly _instanceId: number | null;

  /**
   * Creates a new JobInstance.
   * @param instanceId - the instance ID
   * @param jobName - the job name
   */
  constructor(instanceId: number | null, jobName: string) {
    this._instanceId = instanceId;
    this._jobName = jobName;
  }

  /**
   * Gets the job name.
   * @returns the job name
   */
  get jobName(): string {
    return this._jobName;
  }

  /**
   * Gets the instance ID.
   * @returns the instance ID
   */
  get instanceId(): number | null {
    return this._instanceId;
  }

  toString(): string {
    return `JobInstance: id=${this._instanceId}, jobName=${this._jobName}`;
  }
}
