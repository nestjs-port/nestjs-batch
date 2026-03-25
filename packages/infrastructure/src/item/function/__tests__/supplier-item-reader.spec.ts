import { describe, expect, it } from "vitest";

import { SupplierItemReader } from "../supplier-item-reader";

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
