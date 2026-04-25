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

import assert from "node:assert/strict";

import type { Converter } from "@nestjs-port/core";

import type { Chunk } from "./chunk.js";
import type { ItemWriter } from "./item-writer.interface.js";

/**
 * A base class to implement any {@link ItemWriter} that writes to a key value store
 * using a {@link Converter} to derive a key from an item. If a derived key is null,
 * the item will be skipped and a warning logged.
 */
export abstract class KeyValueItemWriter<K, V> implements ItemWriter<V> {
  protected _itemKeyMapper: Converter<V, K>;

  protected _delete = false;

  constructor(itemKeyMapper: Converter<V, K>) {
    assert(itemKeyMapper != null, "itemKeyMapper must not be null");
    this._itemKeyMapper = itemKeyMapper;
  }

  async write(chunk: Chunk<V>): Promise<void> {
    for (const item of chunk) {
      const key = this._itemKeyMapper.convert(item);
      await this.writeKeyValue(key, item);
    }

    await this.flush();
  }

  /**
   * Flush items to the key/value store.
   * @throws Exception if unable to flush items
   */
  protected flush(): void | Promise<void> {}

  /**
   * Subclasses implement this method to write each item to a key value store.
   * @param key the key
   * @param value the item
   */
  protected abstract writeKeyValue(key: K, value: V): void | Promise<void>;

  /**
   * afterPropertiesSet() hook.
   */
  protected abstract init(): void | Promise<void>;

  /**
   * Set the {@link Converter} to use to derive the key from the item.
   * @param itemKeyMapper the converter used to derive a key from an item.
   */
  public setItemKeyMapper(itemKeyMapper: Converter<V, K>): void {
    assert(itemKeyMapper != null, "itemKeyMapper must not be null");
    this._itemKeyMapper = itemKeyMapper;
  }

  /**
   * Sets the delete flag to have the item writer perform deletes.
   * @param deleteItems if true the item writer will perform deletes, if false not to perform deletes.
   */
  public setDelete(deleteItems: boolean): void {
    this._delete = deleteItems;
  }

  /**
   * onModuleInit() hook.
   */
  async onModuleInit(): Promise<void> {
    await this.init();
  }
}
