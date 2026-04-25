import assert from "node:assert/strict";
import type { ItemReader } from "../item-reader.interface.js";

export class SupplierItemReader<T> implements ItemReader<T> {
  private readonly _supplier: () => T | null;

  constructor(supplier: () => T | null) {
    assert(supplier != null, "A supplier is required");

    this._supplier = supplier;
  }

  async read(): Promise<T | null> {
    return this._supplier();
  }
}
