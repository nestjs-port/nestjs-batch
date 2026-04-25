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

import type { FieldExtractor } from "./field-extractor.interface.js";
import type { FieldSet } from "./field-set.interface.js";

export class PassThroughFieldExtractor<T> implements FieldExtractor<T> {
  extract(item: T): unknown[] {
    if (Array.isArray(item)) {
      return item;
    }

    if (item instanceof Set) {
      return Array.from(item);
    }

    if (item instanceof Map) {
      return Array.from(item.values());
    }

    if (this.isFieldSet(item)) {
      return item.values;
    }

    return [item];
  }

  private isFieldSet(item: unknown): item is FieldSet {
    return (
      typeof item === "object" &&
      item !== null &&
      Array.isArray((item as { values?: unknown }).values)
    );
  }
}
