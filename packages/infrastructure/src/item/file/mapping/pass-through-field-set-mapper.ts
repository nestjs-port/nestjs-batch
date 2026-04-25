import type { FieldSet } from "../transform/index.js";
import type { FieldSetMapper } from "./field-set-mapper.js";

export class PassThroughFieldSetMapper implements FieldSetMapper<FieldSet> {
  mapFieldSet(fieldSet: FieldSet): FieldSet {
    return fieldSet;
  }
}
