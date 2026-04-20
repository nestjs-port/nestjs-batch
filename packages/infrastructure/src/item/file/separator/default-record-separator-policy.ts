import { StringUtils } from "@nestjs-port/core";
import { SimpleRecordSeparatorPolicy } from "./simple-record-separator-policy";

export class DefaultRecordSeparatorPolicy extends SimpleRecordSeparatorPolicy {
  private static readonly QUOTE = '"';
  private static readonly CONTINUATION = "\\";

  private _quoteCharacter: string;
  private _continuation: string;

  constructor(
    quoteCharacter = DefaultRecordSeparatorPolicy.QUOTE,
    continuation = DefaultRecordSeparatorPolicy.CONTINUATION,
  ) {
    super();
    this._quoteCharacter = quoteCharacter;
    this._continuation = continuation;
  }

  setQuoteCharacter(quoteCharacter: string): void {
    this._quoteCharacter = quoteCharacter;
  }

  setContinuation(continuation: string): void {
    this._continuation = continuation;
  }

  isEndOfRecord(line: string): boolean {
    return !this.isQuoteUnterminated(line) && !this.isContinued(line);
  }

  preProcess(line: string): string {
    if (this.isQuoteUnterminated(line)) {
      return `${line}\n`;
    }
    if (this.isContinued(line)) {
      return line.substring(0, line.lastIndexOf(this._continuation));
    }
    return line;
  }

  private isQuoteUnterminated(line: string | null = null): boolean {
    return (
      line != null &&
      StringUtils.countOccurrences(line, this._quoteCharacter) % 2 !== 0
    );
  }

  private isContinued(line: string | null | undefined): boolean {
    return line?.trim().endsWith(this._continuation) ?? false;
  }
}
