export interface RecordSeparatorPolicy {
  isEndOfRecord(record: string): boolean;

  postProcess(record: string): string;

  preProcess(record: string): string;
}
