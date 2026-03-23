import type { ItemReader } from "../item-reader.interface";

export class SupplierItemReader<T> implements ItemReader<T> {
  private readonly _supplier: () => T | null;

  constructor(supplier: () => T | null) {
    if (supplier == null) {
      throw new Error("A supplier is required");
    }
    this._supplier = supplier;
  }

  async read(): Promise<T | null> {
    return this._supplier();
  }
}
