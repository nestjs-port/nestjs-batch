import { DefaultRecordSeparatorPolicy } from "./default-record-separator-policy";

export class SuffixRecordSeparatorPolicy extends DefaultRecordSeparatorPolicy {
  static readonly DEFAULT_SUFFIX = ";";

  private _suffix = SuffixRecordSeparatorPolicy.DEFAULT_SUFFIX;
  private _ignoreWhitespace = true;

  setSuffix(suffix: string): void {
    this._suffix = suffix;
  }

  setIgnoreWhitespace(ignoreWhitespace: boolean): void {
    this._ignoreWhitespace = ignoreWhitespace;
  }

  isEndOfRecord(line: string): boolean {
    const trimmed = this._ignoreWhitespace ? line.trim() : line;
    return trimmed.endsWith(this._suffix);
  }

  postProcess(record: string): string {
    return record.substring(0, record.lastIndexOf(this._suffix));
  }
}
