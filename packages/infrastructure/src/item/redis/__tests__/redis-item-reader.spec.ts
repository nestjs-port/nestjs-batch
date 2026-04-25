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

import {
  RedisContainer,
  type StartedRedisContainer,
} from "@testcontainers/redis";
import { Redis } from "ioredis";
import { createClient } from "redis";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { ExecutionContext } from "../../execution-context.js";
import { RedisItemReader } from "../redis-item-reader.js";

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

    it("pattern", async () => {
      await client.flushAll();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          pattern: "user:*",
          count: 10,
        }),
      );

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });

    it("count", async () => {
      await client.flushAll();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          count: 1,
        }),
      );

      expect(items).toHaveLength(4);
      expect([...items].sort()).toEqual(["alice", "bob", "carol", "ignored"]);
    });

    it("bytePattern", async () => {
      await client.flushAll();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          bytePattern: Buffer.from("user:*"),
          count: 10,
        }),
      );

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

    it("pattern", async () => {
      await client.flushall();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          pattern: "user:*",
          count: 10,
        }),
      );

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });

    it("count", async () => {
      await client.flushall();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          count: 1,
        }),
      );

      expect(items).toHaveLength(4);
      expect([...items].sort()).toEqual(["alice", "bob", "carol", "ignored"]);
    });

    it("bytePattern", async () => {
      await client.flushall();
      await client.set("user:1", "alice");
      await client.set("user:2", "bob");
      await client.set("user:3", "carol");
      await client.set("other:1", "ignored");

      const items = await readAllValues(
        new RedisItemReader(client, {
          bytePattern: Buffer.from("user:*"),
          count: 10,
        }),
      );

      expect(items).toHaveLength(3);
      expect([...items].sort()).toEqual(["alice", "bob", "carol"]);
    });
  });
});
