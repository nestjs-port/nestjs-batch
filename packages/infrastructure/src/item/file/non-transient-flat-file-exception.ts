import { NonTransientResourceException } from "../non-transient-resource-exception.js";

export class NonTransientFlatFileException extends NonTransientResourceException {
  private readonly _input: string | null;

  private readonly _lineNumber: number;

  constructor(message: string, cause: unknown);
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
      const resolvedLineNumber =
        typeof inputOrLineNumber === "number" ? inputOrLineNumber : 0;

      super(message);
      this._input = input;
      this._lineNumber = resolvedLineNumber;
      return;
    }

    const cause = inputOrCause;
    const input =
      typeof inputOrLineNumber === "string" ? inputOrLineNumber : null;
    const resolvedLineNumber = input != null ? lineNumber : 0;

    super(message, cause);
    this._input = input;
    this._lineNumber = resolvedLineNumber;
  }

  get input(): string | null {
    return this._input;
  }

  get lineNumber(): number {
    return this._lineNumber;
  }
}
