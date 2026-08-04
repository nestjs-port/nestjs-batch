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

export const STEP_LISTENER_METADATA = Symbol("nestjs-batch:step-listener");

type AnyMethod = (...args: any[]) => any;

type ExactMethod<
  T extends AnyMethod,
  Signature extends AnyMethod,
> = T extends Signature
  ? Parameters<T> extends Parameters<Signature>
    ? T
    : never
  : never;

export type StepListenerMethodDecorator<Signature extends AnyMethod> = <
  T extends AnyMethod,
>(
  target: object,
  propertyKey: string | symbol,
  descriptor: TypedPropertyDescriptor<ExactMethod<T, Signature>>,
) => void;

export function createStepListenerDecorator<Signature extends AnyMethod>(
  callback: string,
): StepListenerMethodDecorator<Signature> {
  return (target, propertyKey): void => {
    Reflect.defineMetadata(
      STEP_LISTENER_METADATA,
      { callback, methodName: propertyKey },
      target,
      propertyKey,
    );
  };
}
