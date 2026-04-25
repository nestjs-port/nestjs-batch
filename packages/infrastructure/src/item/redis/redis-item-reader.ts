import assert from "node:assert/strict";
import type { Readable } from "node:stream";

import type { Redis } from "ioredis";
import type { createClient } from "redis";

import type { ExecutionContext } from "../execution-context.js";
import type { ItemStreamReader } from "../item-stream-reader.interface.js";

export interface RedisScanOptions {
  count?: number;
  pattern?: string;
  bytePattern?: Buffer;
}

type ScanStreamOptions = {
  count?: number;
  match?: string;
  noValues?: boolean;
  type?: string;
};

type NodeRedisClient = ReturnType<typeof createClient>;

export class RedisItemReader implements ItemStreamReader<string> {
  private _keyIterator: AsyncIterator<string | Buffer> | null = null;

  private _scanStream: Readable | null = null;

  constructor(_redisClient: NodeRedisClient, _scanOptions: RedisScanOptions);
  constructor(_redisClient: Redis, _scanOptions: RedisScanOptions);
  constructor(
    private readonly _redisClient: NodeRedisClient | Redis,
    private readonly _scanOptions: RedisScanOptions,
  ) {
    assert(this._redisClient != null, "redisClient must not be null");
    assert(this._scanOptions != null, "scanOptions must not be null");
  }

  open(_executionContext: ExecutionContext): void {
    this._keyIterator = this.createKeyIterator();
  }

  async read(): Promise<string | null> {
    assert(
      this._keyIterator != null,
      "RedisItemReader must be opened before reading",
    );

    const { done, value } = await this._keyIterator.next();
    if (done) {
      return null;
    }

    return this.readValue(value);
  }

  close(): void {
    void this._keyIterator?.return?.();
    this._keyIterator = null;

    this._scanStream?.destroy();
    this._scanStream = null;
  }

  private createKeyIterator(): AsyncIterator<string | Buffer> {
    if (this.isNodeRedisClient(this._redisClient)) {
      return this.createNodeRedisKeyIterator(this._redisClient);
    }

    if (this.isIORedisClient(this._redisClient)) {
      return this.createIORedisKeyIterator(this._redisClient);
    }

    throw new Error("Redis client must provide scanIterator or scanStream");
  }

  private async readValue(key: string | Buffer): Promise<string | null> {
    if (this._redisClient.get == null) {
      throw new Error("Redis client must provide get");
    }

    const value = await this._redisClient.get(
      Buffer.isBuffer(key) ? key.toString() : key,
    );
    return Buffer.isBuffer(value) ? value.toString() : value;
  }

  private isNodeRedisClient(
    client: NodeRedisClient | Redis,
  ): client is NodeRedisClient {
    return typeof (client as NodeRedisClient).scanIterator === "function";
  }

  private isIORedisClient(client: NodeRedisClient | Redis): client is Redis {
    return typeof (client as Redis).scanStream === "function";
  }

  private toPattern(): string | undefined {
    if (this._scanOptions.bytePattern != null) {
      return this._scanOptions.bytePattern.toString();
    }

    return this._scanOptions.pattern;
  }

  private async *createNodeRedisKeyIterator(
    client: NodeRedisClient,
  ): AsyncGenerator<string | Buffer> {
    const scanOptions: NonNullable<
      Parameters<NodeRedisClient["scanIterator"]>[0]
    > = {};

    if (this._scanOptions.count != null) {
      scanOptions.COUNT = this._scanOptions.count;
    }

    const pattern = this.toPattern();
    if (pattern != null) {
      scanOptions.MATCH = pattern;
    }

    for await (const key of client.scanIterator(scanOptions)) {
      yield* key;
    }
  }

  private async *createIORedisKeyIterator(
    client: Redis,
  ): AsyncGenerator<string | Buffer> {
    const scanOptions: ScanStreamOptions = {};

    if (this._scanOptions.count != null) {
      scanOptions.count = this._scanOptions.count;
    }

    const pattern = this.toPattern();
    if (pattern != null) {
      scanOptions.match = pattern;
    }

    this._scanStream = client.scanStream(scanOptions);
    for await (const chunk of this._scanStream) {
      if (!Array.isArray(chunk)) {
        throw new Error("Redis scan stream must yield arrays of keys");
      }

      yield* chunk;
    }
  }
}
