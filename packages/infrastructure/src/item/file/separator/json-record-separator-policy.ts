import { SimpleRecordSeparatorPolicy } from "./simple-record-separator-policy";

const countOccurrences = (value: string, needle: string): number => {
  if (needle.length === 0) {
    return 0;
  }

  return value.split(needle).length - 1;
};

export class JsonRecordSeparatorPolicy extends SimpleRecordSeparatorPolicy {
  isEndOfRecord(line: string | null): boolean {
    return (
      line != null &&
      countOccurrences(line, "{") === countOccurrences(line, "}") &&
      line.trim().endsWith("}")
    );
  }
}
