import { StringUtils } from "@nestjs-port/core";
import { SimpleRecordSeparatorPolicy } from "./simple-record-separator-policy";

export class JsonRecordSeparatorPolicy extends SimpleRecordSeparatorPolicy {
  isEndOfRecord(line: string | null): boolean {
    return (
      line != null &&
      StringUtils.countOccurrences(line, "{") ===
        StringUtils.countOccurrences(line, "}") &&
      line.trim().endsWith("}")
    );
  }
}
