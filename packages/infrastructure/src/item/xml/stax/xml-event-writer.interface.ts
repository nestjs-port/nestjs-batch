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

import type { XMLEvent } from "./xml-event.interface.js";
import type { XMLEventReader } from "./xml-event-reader.interface.js";

export interface XMLEventWriter {
  add(event: XMLEvent): void;
  add(reader: XMLEventReader): void;

  flush(): void;

  close(): void;

  getPrefix(uri: string): string;

  setPrefix(prefix: string, uri: string): void;

  setDefaultNamespace(uri: string): void;
}
