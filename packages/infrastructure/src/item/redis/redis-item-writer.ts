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
