import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import Redis from "ioredis";
import { createClient } from "redis";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ExecutionContext } from "../../execution-context";
import { RedisItemReader, type RedisScanOptions } from "../redis-item-reader";

type RedisSuite = {
  name: string;
  setup: () => Promise<{
    container: StartedRedisContainer;
    seedUsers: () => Promise<void>;
    readValues: (options: RedisScanOptions) => Promise<string[]>;
    close: () => Promise<void>;
  }>;
};

type RedisScanCase = {
  name: string;
  options: RedisScanOptions;
  expectedValues: string[];
};

const suites: readonly RedisSuite[] = [
  {
    name: "redis",
    setup: async () => {
      const container = await new RedisContainer("redis:latest").start();
      const client = createClient({
        url: container.getConnectionUrl(),
      });

      client.on("error", (error) => {
        throw error;
      });

      await client.connect();

      return {
        container,
        seedUsers: async () => {
          await client.flushAll();
          await client.set("user:1", "alice");
          await client.set("user:2", "bob");
          await client.set("user:3", "carol");
          await client.set("other:1", "ignored");
        },
        readValues: async (options: RedisScanOptions) =>
          readAllValues(new RedisItemReader(client, options)),
        close: async () => {
          await client.quit();
        },
      };
    },
  },
  {
    name: "ioredis",
    setup: async () => {
      const container = await new RedisContainer("redis:latest").start();
      const client = new Redis(container.getConnectionUrl());

      return {
        container,
        seedUsers: async () => {
          await client.flushall();
          await client.set("user:1", "alice");
          await client.set("user:2", "bob");
          await client.set("user:3", "carol");
          await client.set("other:1", "ignored");
        },
        readValues: async (options: RedisScanOptions) =>
          readAllValues(new RedisItemReader(client, options)),
        close: async () => {
          await client.quit();
        },
      };
    },
  },
] as const;

const scanCases: readonly RedisScanCase[] = [
  {
    name: "pattern",
    options: {
      pattern: "user:*",
      count: 10,
    },
    expectedValues: ["alice", "bob", "carol"],
  },
  {
    name: "count",
    options: {
      count: 1,
    },
    expectedValues: ["alice", "bob", "carol", "ignored"],
  },
  {
    name: "bytePattern",
    options: {
      bytePattern: Buffer.from("user:*"),
      count: 10,
    },
    expectedValues: ["alice", "bob", "carol"],
  },
] as const;

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

describe.each(suites)("$name", (suite) => {
  let container: StartedRedisContainer;
  let seedUsers: () => Promise<void>;
  let readValues: (options: RedisScanOptions) => Promise<string[]>;
  let close: () => Promise<void>;

  beforeAll(async () => {
    const state = await suite.setup();
    container = state.container;
    seedUsers = state.seedUsers;
    readValues = state.readValues;
    close = state.close;
  });

  afterAll(async () => {
    await close();
    await container?.stop();
  });

  it.each(scanCases)("$name", async ({ options, expectedValues }) => {
    await seedUsers();
    const items = await readValues(options);

    expect(items).toHaveLength(expectedValues.length);
    expect([...items].sort()).toEqual([...expectedValues].sort());
  });
});
