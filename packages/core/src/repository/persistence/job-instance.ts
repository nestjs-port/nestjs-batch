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

export class JobInstance {
  private _jobInstanceId = 0;
  private _jobName: string | null = null;
  private _jobKey: string | null = null;

  get jobInstanceId(): number {
    return this._jobInstanceId;
  }

  set jobInstanceId(value: number) {
    this._jobInstanceId = value;
  }

  get jobName(): string | null {
    return this._jobName;
  }

  set jobName(value: string | null) {
    this._jobName = value;
  }

  get jobKey(): string | null {
    return this._jobKey;
  }

  set jobKey(value: string | null) {
    this._jobKey = value;
  }

  toString(): string {
    return `JobInstance{jobInstanceId=${this._jobInstanceId}, jobName='${this._jobName}', jobKey='${this._jobKey}'}`;
  }
}
