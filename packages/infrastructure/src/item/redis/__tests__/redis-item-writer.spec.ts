import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import Redis from "ioredis";
import { createClient } from "redis";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { Chunk } from "../../chunk";
import { RedisItemWriter } from "../redis-item-writer";

class RedisItemKeyMapper {
  convert(source: string): string {
    return `user:${source}`;
  }
}

async function writeAllValues(
  writer: RedisItemWriter<string, string>,
  items: string[],
): Promise<void> {
  await writer.onModuleInit();
  await writer.write(new Chunk(items));
}

describe("RedisItemWriter", () => {
  let container: StartedRedisContainer;
  let containerUrl: string;

  beforeAll(async () => {
    container = await new RedisContainer("redis:latest").start();
    containerUrl = container.getConnectionUrl();
  });

  afterAll(async () => {
    await container.stop();
  });

  describe("redis", () => {
    let client: ReturnType<typeof createClient>;

    beforeAll(async () => {
      client = createClient({
        url: containerUrl,
      });

      client.on("error", (error) => {
        throw error;
      });

      await client.connect();
    });

    afterAll(async () => {
      await client.quit();
    });

    it("writes values", async () => {
      await client.flushAll();

      await writeAllValues(
        new RedisItemWriter(client, new RedisItemKeyMapper()),
        ["alice", "bob", "carol"],
      );

      expect(await client.get("user:alice")).toBe("alice");
      expect(await client.get("user:bob")).toBe("bob");
      expect(await client.get("user:carol")).toBe("carol");
    });

    it("deletes values when delete is enabled", async () => {
      await client.flushAll();
      await client.set("user:alice", "alice");
      await client.set("user:bob", "bob");

      const writer = new RedisItemWriter(client, new RedisItemKeyMapper());
      writer.setDelete(true);

      await writeAllValues(writer, ["alice", "bob"]);

      expect(await client.get("user:alice")).toBeNull();
      expect(await client.get("user:bob")).toBeNull();
    });
  });

  describe("ioredis", () => {
    let client: Redis;

    beforeAll(() => {
      client = new Redis(containerUrl);
    });

    afterAll(async () => {
      await client.quit();
    });

    it("writes values", async () => {
      await client.flushall();

      await writeAllValues(
        new RedisItemWriter(client, new RedisItemKeyMapper()),
        ["alice", "bob", "carol"],
      );

      expect(await client.get("user:alice")).toBe("alice");
      expect(await client.get("user:bob")).toBe("bob");
      expect(await client.get("user:carol")).toBe("carol");
    });

    it("deletes values when delete is enabled", async () => {
      await client.flushall();
      await client.set("user:alice", "alice");
      await client.set("user:bob", "bob");

      const writer = new RedisItemWriter(client, new RedisItemKeyMapper());
      writer.setDelete(true);

      await writeAllValues(writer, ["alice", "bob"]);

      expect(await client.get("user:alice")).toBeNull();
      expect(await client.get("user:bob")).toBeNull();
    });
  });
});
