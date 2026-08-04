/*
 * Copyright 2002-present the original author or authors.
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

import { AFTER_JOB_METADATA } from "../annotation/after-job.decorator.js";
import { BEFORE_JOB_METADATA } from "../annotation/before-job.decorator.js";
import { AbstractListenerFactoryBean } from "./abstract-listener-factory-bean.js";
import type { JobExecutionListener } from "./job-execution-listener.interface.js";

export class JobListenerFactoryBean extends AbstractListenerFactoryBean<JobExecutionListener> {
  protected readonly listenerMetadataKey = BEFORE_JOB_METADATA;

  protected getListenerCallbacks(): readonly string[] {
    return ["beforeJob", "afterJob"];
  }

  protected override resolveCallbacks(
    delegate: object,
  ): Map<string, string | symbol> {
    const callbacks = super.resolveCallbacks(delegate);
    const prototype = Object.getPrototypeOf(delegate);

    for (const methodName of Object.getOwnPropertyNames(prototype)) {
      const afterMetadata = Reflect.getMetadata(
        AFTER_JOB_METADATA,
        prototype,
        methodName,
      ) as { callback: string; methodName: string | symbol } | undefined;
      if (afterMetadata?.callback === "afterJob") {
        callbacks.set("afterJob", afterMetadata.methodName);
      }
    }

    return callbacks;
  }

  static getListener(delegate: object): JobExecutionListener {
    const factory = new JobListenerFactoryBean();
    factory.setDelegate(delegate);
    return factory.getObject();
  }

  static isListener(delegate: unknown): boolean {
    return AbstractListenerFactoryBean.isListener(
      delegate,
      ["beforeJob", "afterJob"],
      BEFORE_JOB_METADATA,
    );
  }
}
