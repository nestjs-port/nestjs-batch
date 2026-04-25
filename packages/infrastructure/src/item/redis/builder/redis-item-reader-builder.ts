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

import type { Redis } from "ioredis";
import type { createClient } from "redis";

import type { RedisScanOptions } from "../redis-item-reader.js";
import { RedisItemReader } from "../redis-item-reader.js";

type NodeRedisClient = ReturnType<typeof createClient>;

export class RedisItemReaderBuilder {
  private _nodeRedisClient: NodeRedisClient | null = null;

  private _ioredisClient: Redis | null = null;

  private _scanOptions: RedisScanOptions | null = null;

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

  scanOptions(scanOptions: RedisScanOptions): this {
    this._scanOptions = scanOptions;
    return this;
  }

  build(): RedisItemReader {
    assert(
      this._nodeRedisClient != null || this._ioredisClient != null,
      "Redis client must be set",
    );
    assert(this._scanOptions != null, "Scan options must be set");

    const nodeRedisClient = this._nodeRedisClient;
    if (nodeRedisClient != null) {
      return new RedisItemReader(nodeRedisClient, this._scanOptions);
    }

    const ioredisClient = this._ioredisClient;
    if (ioredisClient == null) {
      throw new Error("Redis client must be set");
    }

    return new RedisItemReader(ioredisClient, this._scanOptions);
  }
}
