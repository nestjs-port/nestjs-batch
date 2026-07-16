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

import { ItemListenerSupport } from "./item-listener-support.js";
import type { ChunkListener } from "./chunk-listener.interface.js";
import type { SkipListener } from "./skip-listener.interface.js";
import type { StepExecutionListener } from "./step-execution-listener.interface.js";

/** Basic no-op implementations of all {@link StepListener} interfaces. */
export class StepListenerSupport<T, S>
  extends ItemListenerSupport<T, S>
  implements StepExecutionListener, ChunkListener<T, S>, SkipListener<T, S> {}
