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

import { describe, expect, it } from "vitest";

import { ItemProcessorAdapter } from "../item-processor-adapter.js";

interface Foo {
  id: number;
  name: string;
  value: number;
}

class FooService {
  extractName(foo: Foo): string {
    return foo.name;
  }
}

describe("ItemProcessorAdapter", () => {
  it("test process", async () => {
    const processor = new ItemProcessorAdapter<Foo, string>();
    processor.setTargetObject(new FooService());
    processor.setTargetMethod("extractName");
    processor.afterPropertiesSet();

    const item: Foo = { id: 0, name: "foo", value: 1 };
    await expect(processor.process(item)).resolves.toBe("foo");
  });
});
