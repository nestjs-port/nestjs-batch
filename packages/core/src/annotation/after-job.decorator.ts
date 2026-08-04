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

import "reflect-metadata";

import type { JobExecution } from "../job/job-execution.js";

export const AFTER_JOB_METADATA = Symbol("nestjs-batch:after-job");

type ExactJobListenerMethod<
  T extends (...args: any[]) => any,
  Signature extends (...args: any[]) => any,
> = T extends Signature
  ? Parameters<T> extends Parameters<Signature>
    ? T
    : never
  : never;

type AfterJobMethodDecorator = <T extends (...args: any[]) => any>(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<
    ExactJobListenerMethod<T, (jobExecution: JobExecution) => void>
  >,
) => void;

/**
 * Marks a method to be called after a {@link Job} has completed.
 *
 * Expected signature: `void afterJob(JobExecution jobExecution)`.
 *
 * @see JobExecutionListener
 */
export function AfterJob(): AfterJobMethodDecorator;
export function AfterJob(): MethodDecorator {
  return (target, propertyKey, _descriptor): void => {
    Reflect.defineMetadata(
      AFTER_JOB_METADATA,
      { callback: "afterJob", methodName: propertyKey },
      target,
      propertyKey,
    );
  };
}
