export class FlatFileFormatException extends Error {
  private readonly _input: string | null;

  constructor(message: string);
  constructor(message: string, input: string);
  constructor(message: string, cause: unknown);
  constructor(message: string, inputOrCause?: string | unknown) {
    if (typeof inputOrCause === "string") {
      super(message);
      this._input = inputOrCause;
      return;
    }

    super(message, inputOrCause != null ? { cause: inputOrCause } : undefined);
    this._input = null;
  }

  get input(): string | null {
    return this._input;
  }
}
