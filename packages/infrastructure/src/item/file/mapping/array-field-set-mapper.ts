import type { FieldSet } from "../transform/index.js";
import type { FieldSetMapper } from "./field-set-mapper";

export class ArrayFieldSetMapper implements FieldSetMapper<string[]> {
  mapFieldSet(fieldSet: FieldSet): string[] {
    return fieldSet.values;
  }
}
