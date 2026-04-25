import type { Redis } from "ioredis";
import type { createClient } from "redis";
import { describe, expect, it } from "vitest";

import { RedisItemWriter } from "../../redis-item-writer.js";
import { RedisItemWriterBuilder } from "../redis-item-writer-builder.js";

type RedisItemWriterInternals = {
  _redisClient: ReturnType<typeof createClient> | Redis;
  _itemKeyMapper: unknown;
  _delete: boolean;
};

describe("RedisItemWriterBuilder", () => {
  it("builds a writer with node-redis client", () => {
    const redisClient = { id: "node-redis" } as unknown as ReturnType<
      typeof createClient
    >;
    const itemKeyMapper = {
      convert: (source: string) => `user:${source}`,
    };

    const writer = new RedisItemWriterBuilder<string, string>()
      .redisClient(redisClient)
      .itemKeyMapper(itemKeyMapper)
      .delete(true)
      .build();

    expect(writer).toBeInstanceOf(RedisItemWriter);
    const internals = writer as unknown as RedisItemWriterInternals;
    expect(internals._redisClient).toBe(redisClient);
    expect(internals._itemKeyMapper).toBe(itemKeyMapper);
    expect(internals._delete).toBe(true);
  });

  it("builds a writer with ioredis client", () => {
    const redisClient = { id: "ioredis" } as unknown as Redis;
    const itemKeyMapper = {
      convert: (source: string) => `user:${source}`,
    };

    const writer = new RedisItemWriterBuilder<string, string>()
      .ioredisClient(redisClient)
      .itemKeyMapper(itemKeyMapper)
      .build();

    expect(writer).toBeInstanceOf(RedisItemWriter);
    const internals = writer as unknown as RedisItemWriterInternals;
    expect(internals._redisClient).toBe(redisClient);
    expect(internals._itemKeyMapper).toBe(itemKeyMapper);
    expect(internals._delete).toBe(false);
  });

  it("throws when both client types are set", () => {
    const builder = new RedisItemWriterBuilder<string, string>();

    expect(() =>
      builder
        .redisClient({} as ReturnType<typeof createClient>)
        .ioredisClient({} as Redis),
    ).toThrow("Redis client is already set");
  });
});
