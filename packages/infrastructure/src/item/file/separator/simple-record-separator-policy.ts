import type { RecordSeparatorPolicy } from "./record-separator-policy.interface";

export class SimpleRecordSeparatorPolicy implements RecordSeparatorPolicy {
  isEndOfRecord(_line: string): boolean {
    return true;
  }

  postProcess(record: string): string {
    return record;
  }

  preProcess(line: string): string {
    return line;
  }
}
