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

import type { RepeatContext } from "./repeat-context.js";
import type { RepeatStatus } from "./repeat-status.js";

export interface RepeatListener {
  before?(context: RepeatContext): void;

  after?(context: RepeatContext, result: RepeatStatus): void;

  open?(context: RepeatContext): void;

  onError?(context: RepeatContext, error: unknown): void;

  close?(context: RepeatContext): void;
}
