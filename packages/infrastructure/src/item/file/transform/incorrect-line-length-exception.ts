import { FlatFileFormatException } from "./flat-file-format-exception";

export class IncorrectLineLengthException extends FlatFileFormatException {
  private readonly _actualLength: number;

  private readonly _expectedLength: number;

  constructor(
    message: string,
    expectedLength: number,
    actualLength: number,
    input: string,
  );
  constructor(message: string, expectedLength: number, actualLength: number);
  constructor(expectedLength: number, actualLength: number, input: string);
  constructor(expectedLength: number, actualLength: number);
  constructor(
    messageOrExpectedLength: string | number,
    expectedLengthOrActualLength: number,
    actualLengthOrInput: number | string | null = null,
    input: string | null = null,
  ) {
    if (typeof messageOrExpectedLength === "string") {
      const message = messageOrExpectedLength;
      const expectedLength = expectedLengthOrActualLength;
      const actualLength = actualLengthOrInput as number;

      super(message, input);
      this._expectedLength = expectedLength;
      this._actualLength = actualLength;
      return;
    }

    const expectedLength = messageOrExpectedLength;
    const actualLength = expectedLengthOrActualLength;
    const message = `Incorrect line length in record: expected ${expectedLength} actual ${actualLength}`;

    super(message, actualLengthOrInput as string | null);
    this._expectedLength = expectedLength;
    this._actualLength = actualLength;
  }

  get actualLength(): number {
    return this._actualLength;
  }

  get expectedLength(): number {
    return this._expectedLength;
  }
}
