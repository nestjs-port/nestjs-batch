import type { FieldSet } from "../transform/index.js";
import type { FieldSetMapper } from "./field-set-mapper";

export class PassThroughFieldSetMapper implements FieldSetMapper<FieldSet> {
  mapFieldSet(fieldSet: FieldSet): FieldSet {
    return fieldSet;
  }
}
