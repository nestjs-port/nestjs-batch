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
import type { Redis } from "ioredis";
import type { createClient } from "redis";

import { RedisItemWriter } from "../redis-item-writer.js";

type NodeRedisClient = ReturnType<typeof createClient>;
type RedisKey = string | Buffer;
type RedisValue = string | number | Buffer;

export class RedisItemWriterBuilder<K extends RedisKey, V extends RedisValue> {
  private _nodeRedisClient: NodeRedisClient | null = null;

  private _ioredisClient: Redis | null = null;

  private _itemKeyMapper: Converter<V, K> | null = null;

  private _delete = false;

  redisClient(redisClient: NodeRedisClient): this {
    assert(
      this._nodeRedisClient == null && this._ioredisClient == null,
      "Redis client is already set",
    );

    this._nodeRedisClient = redisClient;
    return this;
  }

  ioredisClient(redisClient: Redis): this {
    assert(
      this._nodeRedisClient == null && this._ioredisClient == null,
      "Redis client is already set",
    );

    this._ioredisClient = redisClient;
    return this;
  }

  itemKeyMapper(itemKeyMapper: Converter<V, K>): this {
    this._itemKeyMapper = itemKeyMapper;
    return this;
  }

  delete(deleteItems: boolean): this {
    this._delete = deleteItems;
    return this;
  }

  build(): RedisItemWriter<K, V> {
    assert(
      this._nodeRedisClient != null || this._ioredisClient != null,
      "Redis client must be set",
    );
    assert(this._itemKeyMapper != null, "itemKeyMapper must be set");

    const nodeRedisClient = this._nodeRedisClient;
    if (nodeRedisClient != null) {
      const writer = new RedisItemWriter(nodeRedisClient, this._itemKeyMapper);
      writer.setDelete(this._delete);
      return writer;
    }

    const ioredisClient = this._ioredisClient;
    if (ioredisClient == null) {
      throw new Error("Redis client must be set");
    }

    const writer = new RedisItemWriter(ioredisClient, this._itemKeyMapper);
    writer.setDelete(this._delete);
    return writer;
  }
}
