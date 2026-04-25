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

import { KeyValueItemWriter } from "../key-value-item-writer.js";

type NodeRedisClient = ReturnType<typeof createClient>;
type RedisKey = string | Buffer;
type RedisValue = string | number | Buffer;

/**
 * An {@link ItemWriter} implementation for Redis.
 */
export class RedisItemWriter<
  K extends RedisKey,
  T extends RedisValue,
> extends KeyValueItemWriter<K, T> {
  constructor(_redisClient: NodeRedisClient, itemKeyMapper: Converter<T, K>);
  constructor(_redisClient: Redis, itemKeyMapper: Converter<T, K>);
  constructor(
    private readonly _redisClient: NodeRedisClient | Redis,
    itemKeyMapper: Converter<T, K>,
  ) {
    super(itemKeyMapper);
    assert(this._redisClient != null, "redisClient must not be null");
  }

  protected async writeKeyValue(key: K, value: T): Promise<void> {
    if (this.isNodeRedisClient(this._redisClient)) {
      await this.writeNodeRedisValue(this._redisClient, key, value);
      return;
    }

    if (this.isIORedisClient(this._redisClient)) {
      await this.writeIORedisValue(this._redisClient, key, value);
      return;
    }

    throw new Error("Redis client must provide set and del");
  }

  private async writeNodeRedisValue(
    client: NodeRedisClient,
    key: K,
    value: T,
  ): Promise<void> {
    if (this._delete) {
      await client.del(key);
    } else {
      await client.set(key, value);
    }
  }

  private async writeIORedisValue(
    client: Redis,
    key: K,
    value: T,
  ): Promise<void> {
    if (this._delete) {
      await client.del(key);
    } else {
      await client.set(key, value);
    }
  }

  protected init(): void {
    assert(this._redisClient != null, "redisClient must not be null");
  }

  private isNodeRedisClient(
    client: NodeRedisClient | Redis,
  ): client is NodeRedisClient {
    return typeof (client as NodeRedisClient).scanIterator === "function";
  }

  private isIORedisClient(client: NodeRedisClient | Redis): client is Redis {
    return typeof (client as Redis).scanStream === "function";
  }
}
