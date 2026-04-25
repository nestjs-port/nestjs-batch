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

import type { Chunk } from "../chunk.js";
import type { ItemWriter } from "../item-writer.interface.js";
import { AbstractMethodInvokingDelegator } from "./abstract-method-invoking-delegator.js";

export class ItemWriterAdapter<T>
  extends AbstractMethodInvokingDelegator<T>
  implements ItemWriter<T>
{
  async write(items: Chunk<T>): Promise<void> {
    for (const item of items) {
      await this.invokeDelegateMethodWithArgument(item);
    }
  }
}
