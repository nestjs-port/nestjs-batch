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
import { ItemStreamSupport } from "../item-stream-support.js";

class SimpleItemStreamSupport extends ItemStreamSupport {
  constructor() {
    super();
  }

  testSetExecutionContextName(name: string): void {
    this.setExecutionContextName(name);
  }
}

describe("ItemStreamSupport", () => {
  it("test default name", () => {
    const itemStream = new SimpleItemStreamSupport();
    expect(itemStream.getExecutionContextKey("foo")).toBe(
      "SimpleItemStreamSupport.foo",
    );
  });

  it("test set name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setName("name");
    expect(itemStream.getExecutionContextKey("foo")).toBe("name.foo");
  });

  it("test set execution context name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.testSetExecutionContextName("name");
    expect(itemStream.getExecutionContextKey("foo")).toBe("name.foo");
  });

  it("test bean name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setBeanName("beanName");
    expect(itemStream.getExecutionContextKey("foo")).toBe("beanName.foo");
  });

  it("test explicit name takes precedence over bean name", () => {
    const itemStream = new SimpleItemStreamSupport();
    itemStream.setName("explicitName");
    itemStream.setBeanName("beanName");
    expect(itemStream.getExecutionContextKey("foo")).toBe("explicitName.foo");
  });
});
