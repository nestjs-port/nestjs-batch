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

import type { StepListener } from "./step-listener.js";

/**
 * Listener interface for the processing of an item. Implementations are notified before
 * and after an item is passed to the processor and when the processor throws an exception.
 */
export interface ItemProcessListener<T, S> extends StepListener {
  /** Called before an item is processed. */
  beforeProcess?(item: T): void;
  /** Called after processing, including when the result is null. */
  afterProcess?(item: T, result: S | null): void;
  /** Called if an exception was thrown during processing. */
  onProcessError?(item: T, exception: Error): void;
}
