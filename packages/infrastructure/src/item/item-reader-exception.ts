export abstract class ItemReaderException extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause != null ? { cause } : undefined);
  }
}
