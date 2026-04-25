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

import { SupplierItemReader } from "../supplier-item-reader.js";

describe("SupplierItemReader", () => {
  it("test mandatory supplier", () => {
    expect(
      () => new SupplierItemReader(null as unknown as () => string),
    ).toThrow("A supplier is required");
  });

  it("test read", async () => {
    // given
    let count = 1;
    const supplier = () => (count <= 2 ? `foo${count++}` : null);
    const supplierItemReader = new SupplierItemReader(supplier);

    // when & then
    expect(await supplierItemReader.read()).toBe("foo1");
    expect(await supplierItemReader.read()).toBe("foo2");
    expect(await supplierItemReader.read()).toBeNull();
  });
});
