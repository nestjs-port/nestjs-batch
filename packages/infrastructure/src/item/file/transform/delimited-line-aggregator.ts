import { ExtractorLineAggregator } from "./extractor-line-aggregator.js";

export class DelimitedLineAggregator<T> extends ExtractorLineAggregator<T> {
  private _delimiter = ",";

  private _quoteCharacter = "";

  setDelimiter(delimiter: string): void {
    this._delimiter = delimiter;
  }

  setQuoteCharacter(quoteCharacter: string): void {
    this._quoteCharacter = quoteCharacter;
  }

  protected doAggregate(fields: unknown[]): string {
    return fields
      .map((field) => `${this._quoteCharacter}${field}${this._quoteCharacter}`)
      .join(this._delimiter);
  }
}
