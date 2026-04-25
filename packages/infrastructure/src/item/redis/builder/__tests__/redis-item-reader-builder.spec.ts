import type { Redis } from "ioredis";
import type { createClient } from "redis";
import { describe, expect, it } from "vitest";

import { RedisItemReader } from "../../redis-item-reader.js";
import { RedisItemReaderBuilder } from "../redis-item-reader-builder.js";

type RedisItemReaderInternals = {
  _redisClient: ReturnType<typeof createClient> | Redis;
  _scanOptions: unknown;
};

describe("RedisItemReaderBuilder", () => {
  it("builds a reader with node-redis client", () => {
    const redisClient = { id: "node-redis" } as unknown as ReturnType<
      typeof createClient
    >;
    const scanOptions = {
      pattern: "user:*",
      count: 10,
    };

    const reader = new RedisItemReaderBuilder()
      .redisClient(redisClient)
      .scanOptions(scanOptions)
      .build();

    expect(reader).toBeInstanceOf(RedisItemReader);
    const internals = reader as unknown as RedisItemReaderInternals;
    expect(internals._redisClient).toBe(redisClient);
    expect(internals._scanOptions).toBe(scanOptions);
  });

  it("builds a reader with ioredis client", () => {
    const redisClient = { id: "ioredis" } as unknown as Redis;
    const scanOptions = {
      bytePattern: Buffer.from("user:*"),
      count: 10,
    };

    const reader = new RedisItemReaderBuilder()
      .ioredisClient(redisClient)
      .scanOptions(scanOptions)
      .build();

    expect(reader).toBeInstanceOf(RedisItemReader);
    const internals = reader as unknown as RedisItemReaderInternals;
    expect(internals._redisClient).toBe(redisClient);
    expect(internals._scanOptions).toBe(scanOptions);
  });

  it("throws when both client types are set", () => {
    const builder = new RedisItemReaderBuilder();

    expect(() =>
      builder
        .redisClient({} as ReturnType<typeof createClient>)
        .ioredisClient({} as Redis),
    ).toThrow("Redis client is already set");
  });
});
