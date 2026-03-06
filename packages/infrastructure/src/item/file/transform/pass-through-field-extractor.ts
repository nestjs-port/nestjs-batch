import type { FieldExtractor } from "./field-extractor.interface";
import type { FieldSet } from "./field-set.interface";

export class PassThroughFieldExtractor<T> implements FieldExtractor<T> {
  extract(item: T): unknown[] {
    if (Array.isArray(item)) {
      return item;
    }

    if (item instanceof Set) {
      return Array.from(item);
    }

    if (item instanceof Map) {
      return Array.from(item.values());
    }

    if (this.isFieldSet(item)) {
      return item.values;
    }

    return [item];
  }

  private isFieldSet(item: unknown): item is FieldSet {
    return (
      typeof item === "object" &&
      item !== null &&
      Array.isArray((item as { values?: unknown }).values)
    );
  }
}
