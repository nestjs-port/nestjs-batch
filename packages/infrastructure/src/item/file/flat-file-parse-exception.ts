import { ParseException } from "../parse-exception.js";

export class FlatFileParseException extends ParseException {
  private readonly _input: string;

  private readonly _lineNumber: number;

  constructor(message: string, input: string);
  constructor(message: string, input: string, lineNumber: number);
  constructor(
    message: string,
    cause: unknown,
    input: string,
    lineNumber: number,
  );
  constructor(
    message: string,
    inputOrCause: string | unknown,
    inputOrLineNumber: string | number | null = null,
    lineNumber = 0,
  ) {
    if (typeof inputOrCause === "string") {
      const input = inputOrCause;
      const resolvedLineNumber = (inputOrLineNumber as number | null) ?? 0;

      super(message);
      this._input = input;
      this._lineNumber = resolvedLineNumber;
      return;
    }

    const cause = inputOrCause;
    const input = inputOrLineNumber as string;

    super(message, cause);
    this._input = input;
    this._lineNumber = lineNumber;
  }

  get input(): string {
    return this._input;
  }

  get lineNumber(): number {
    return this._lineNumber;
  }
}
