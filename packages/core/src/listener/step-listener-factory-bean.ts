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

import { STEP_LISTENER_METADATA } from "../annotation/step-listener-decorator.js";
import { AbstractListenerFactoryBean } from "./abstract-listener-factory-bean.js";
import type { StepListener } from "./step-listener.js";

const STEP_CALLBACKS = [
  "beforeStep",
  "afterStep",
  "beforeChunk",
  "afterChunk",
  "afterChunkError",
  "beforeRead",
  "afterRead",
  "onReadError",
  "beforeProcess",
  "afterProcess",
  "onProcessError",
  "beforeWrite",
  "afterWrite",
  "onWriteError",
  "onSkipInRead",
  "onSkipInProcess",
  "onSkipInWrite",
] as const;

export class StepListenerFactoryBean extends AbstractListenerFactoryBean<StepListener> {
  protected readonly listenerMetadataKey = STEP_LISTENER_METADATA;

  protected getListenerCallbacks(): readonly string[] {
    return STEP_CALLBACKS;
  }

  static getListener(delegate: object): StepListener {
    const factory = new StepListenerFactoryBean();
    factory.setDelegate(delegate);
    return factory.getObject();
  }

  static isListener(delegate: unknown): boolean {
    return AbstractListenerFactoryBean.isListener(
      delegate,
      STEP_CALLBACKS,
      STEP_LISTENER_METADATA,
    );
  }
}
