import type { FieldSet } from "./field-set.interface.js";

export interface FieldSetFactory {
  create(values: string[], names: string[]): FieldSet;

  create(values: string[]): FieldSet;
}
