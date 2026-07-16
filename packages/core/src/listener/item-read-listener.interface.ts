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

/** Listener interface around the reading of an item. */
export interface ItemReadListener<T> extends StepListener {
  /** Called before the reader reads an item. */
  beforeRead?(): void;
  /** Called after the reader returns an actual item. */
  afterRead?(item: T): void;
  /** Called if an error occurs while trying to read. */
  onReadError?(exception: Error): void;
}
