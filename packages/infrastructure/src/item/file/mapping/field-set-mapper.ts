import type { FieldSet } from "../transform/index.js";

export interface FieldSetMapper<T> {
  mapFieldSet(fieldSet: FieldSet): T;
}
