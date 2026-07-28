/*
 * Copyright 2024-present the original author or authors.
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

import { JobInstance } from "../../../job/job-instance.js";
import { JobInstance as PersistenceJobInstance } from "../job-instance.js";

export class JobInstanceConverter {
  toJobInstance(source: PersistenceJobInstance): JobInstance {
    return new JobInstance(source.jobInstanceId, source.jobName ?? "");
  }

  fromJobInstance(source: JobInstance): PersistenceJobInstance {
    const jobInstance = new PersistenceJobInstance();
    jobInstance.jobName = source.jobName;
    jobInstance.jobInstanceId = source.instanceId ?? 0;
    return jobInstance;
  }
}
