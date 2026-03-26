import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import Redis from "ioredis";
import { createClient } from "redis";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ExecutionContext } from "../../execution-context";
import { RedisItemReader, type RedisScanOptions } from "../redis-item-reader";

async function readAllValues(reader: RedisItemReader): Promise<string[]> {
  reader.open(new ExecutionContext());

  const items: string[] = [];
  for (;;) {
    const item = await reader.read();
    if (item == null) {
      break;
    }

    items.push(item);
  }

  reader.close();
  return items;
}

describe("RedisItemReader", () => {
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

    async function seedUsers(): Promise<void> {
      await client.flushAll();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");
    }

    async function readValues(options: RedisScanOptions): Promise<string[]> {
      return readAllValues(new RedisItemReader(client, options));
    }

    it("pattern", async () => {
      await seedUsers();
      const items = await readValues({
        pattern: "user:*",
        count: 10,
      });

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });

    it("count", async () => {
      await seedUsers();
      const items = await readValues({
        count: 1,
      });

      expect(items).toHaveLength(4);
      expect([...items].sort()).toEqual(["alice", "bob", "carol", "ignored"]);
    });

    it("bytePattern", async () => {
      await seedUsers();
      const items = await readValues({
        bytePattern: Buffer.from("user:*"),
        count: 10,
      });

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
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

    async function seedUsers(): Promise<void> {
      await client.flushall();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");
    }

    async function readValues(options: RedisScanOptions): Promise<string[]> {
      return readAllValues(new RedisItemReader(client, options));
    }

    it("pattern", async () => {
      await seedUsers();
      const items = await readValues({
        pattern: "user:*",
        count: 10,
      });

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });

    it("count", async () => {
      await seedUsers();
      const items = await readValues({
        count: 1,
      });

      expect(items).toHaveLength(4);
      expect([...items].sort()).toEqual(["alice", "bob", "carol", "ignored"]);
    });

    it("bytePattern", async () => {
      await seedUsers();
      const items = await readValues({
        bytePattern: Buffer.from("user:*"),
        count: 10,
      });

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });
  });
});
