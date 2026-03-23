import { AbstractLineTokenizer } from "./abstract-line-tokenizer";

export class DelimitedLineTokenizer extends AbstractLineTokenizer {
  static readonly DELIMITER_TAB = "\t";

  static readonly DELIMITER_COMMA = ",";

  static readonly DEFAULT_QUOTE_CHARACTER = '"';

  private _delimiter: string;

  private _quoteCharacter = DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER;

  private _quoteString = DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER;

  private _escapedQuoteString =
    DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER +
    DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER;

  private readonly _includedFields = new Set<number>();

  constructor(delimiter = DelimitedLineTokenizer.DELIMITER_COMMA) {
    super();
    if (!delimiter) {
      throw new Error("A delimiter is required");
    }
    if (delimiter === DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER) {
      throw new Error(
        `[${DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER}] is not allowed as delimiter for tokenizers.`,
      );
    }
    this._delimiter = delimiter;
    this.setQuoteCharacter(DelimitedLineTokenizer.DEFAULT_QUOTE_CHARACTER);
  }

  setDelimiter(delimiter: string): void {
    this._delimiter = delimiter;
  }

  setIncludedFields(...includedFields: number[]): void {
    this._includedFields.clear();
    for (const i of includedFields) {
      this._includedFields.add(i);
    }
  }

  setQuoteCharacter(quoteCharacter: string): void {
    this._quoteCharacter = quoteCharacter;
    this._quoteString = quoteCharacter;
    this._escapedQuoteString = quoteCharacter + quoteCharacter;
  }

  protected doTokenize(line: string): string[] {
    const tokens: string[] = [];

    // line is never null in current implementation
    // line is checked in parent: AbstractLineTokenizer.tokenize()
    let inQuoted = false;
    let lastCut = 0;
    const length = line.length;
    let fieldCount = 0;
    let endIndexLastDelimiter = -1;

    for (let i = 0; i < length; i++) {
      const currentChar = line[i];
      const isEnd = i === length - 1;

      const isDelimiter = this.endsWithDelimiter(line, i, endIndexLastDelimiter);

      if ((isDelimiter && !inQuoted) || isEnd) {
        endIndexLastDelimiter = i;
        let endPosition = isEnd ? length - lastCut : i - lastCut;

        if (isEnd && isDelimiter) {
          endPosition = endPosition - this._delimiter.length;
        } else if (!isEnd) {
          endPosition = endPosition - this._delimiter.length + 1;
        }

        if (this._includedFields.size === 0 || this._includedFields.has(fieldCount)) {
          const value = this.substringWithTrimmedWhitespaceAndQuotesIfQuotesPresent(
            line,
            lastCut,
            endPosition,
          );
          tokens.push(value);
        }

        fieldCount++;

        if (isEnd && isDelimiter) {
          if (this._includedFields.size === 0 || this._includedFields.has(fieldCount)) {
            tokens.push("");
          }
          fieldCount++;
        }

        lastCut = i + 1;
      } else if (this.isQuoteCharacter(currentChar)) {
        inQuoted = !inQuoted;
      }
    }

    return tokens;
  }

  private substringWithTrimmedWhitespaceAndQuotesIfQuotesPresent(
    line: string,
    offset: number,
    count: number,
  ): string {
    let start = offset;
    let len = count;

    while (start < start + len - 1 && line.charCodeAt(start) <= 32) {
      start++;
      len--;
    }

    while (
      start < start + len &&
      start + len - 1 < line.length &&
      line.charCodeAt(start + len - 1) <= 32
    ) {
      len--;
    }

    let value: string;

    if (
      line.length >= 2 &&
      this.isQuoteCharacter(line[start]) &&
      this.isQuoteCharacter(line[start + len - 1])
    ) {
      const beginIndex = start + 1;
      const endIndex = len - 2;
      value = line.substring(beginIndex, beginIndex + endIndex);
      if (value.includes(this._escapedQuoteString)) {
        value = value.split(this._escapedQuoteString).join(this._quoteString);
      }
    } else {
      value = line.substring(offset, offset + count);
    }

    return value;
  }

  private endsWithDelimiter(line: string, end: number, previous: number): boolean {
    let result = false;

    if (end - previous >= this._delimiter.length) {
      if (end >= this._delimiter.length - 1) {
        result = true;
        for (
          let j = 0;
          j < this._delimiter.length &&
          end - this._delimiter.length + 1 + j < line.length;
          j++
        ) {
          if (this._delimiter[j] !== line[end - this._delimiter.length + 1 + j]) {
            result = false;
          }
        }
      }
    }

    return result;
  }

  protected isQuoteCharacter(c: string): boolean {
    return c === this._quoteCharacter;
  }
}
