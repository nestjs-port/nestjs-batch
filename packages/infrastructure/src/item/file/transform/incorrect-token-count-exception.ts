import { FlatFileFormatException } from "./flat-file-format-exception";

export class IncorrectTokenCountException extends FlatFileFormatException {
  private readonly _actualCount: number;

  private readonly _expectedCount: number;

  constructor(
    message: string,
    expectedCount: number,
    actualCount: number,
    input: string,
  );
  constructor(message: string, expectedCount: number, actualCount: number);
  constructor(expectedCount: number, actualCount: number, input: string);
  constructor(expectedCount: number, actualCount: number);
  constructor(
    messageOrExpectedCount: string | number,
    expectedCountOrActualCount: number,
    actualCountOrInput?: number | string,
    input?: string,
  ) {
    if (typeof messageOrExpectedCount === "string") {
      const message = messageOrExpectedCount;
      const expectedCount = expectedCountOrActualCount;
      const actualCount = actualCountOrInput as number;

      super(message, input);
      this._expectedCount = expectedCount;
      this._actualCount = actualCount;
      return;
    }

    const expectedCount = messageOrExpectedCount;
    const actualCount = expectedCountOrActualCount;
    const message = `Incorrect number of tokens found in record: expected ${expectedCount} actual ${actualCount}`;

    super(message, actualCountOrInput as string | undefined);
    this._expectedCount = expectedCount;
    this._actualCount = actualCount;
  }

  get actualCount(): number {
    return this._actualCount;
  }

  get expectedCount(): number {
    return this._expectedCount;
  }
}
