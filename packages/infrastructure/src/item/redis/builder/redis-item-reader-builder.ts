import assert from "node:assert/strict";

import type Redis from "ioredis";
import type { createClient } from "redis";

import { RedisItemReader } from "../redis-item-reader";
import type { RedisScanOptions } from "../redis-item-reader";

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
