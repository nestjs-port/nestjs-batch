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

import type { ItemProcessListener } from "./item-process-listener.interface.js";
import type { ItemReadListener } from "./item-read-listener.interface.js";
import type { ItemWriteListener } from "./item-write-listener.interface.js";

/**
 * Basic no-op implementation of the {@link ItemReadListener},
 * {@link ItemProcessListener}, and {@link ItemWriteListener} interfaces. All are
 * implemented, since it is very common that all may need to be implemented at once.
 */
export class ItemListenerSupport<I, O>
  implements
    ItemReadListener<I>,
    ItemProcessListener<I, O>,
    ItemWriteListener<O> {}
