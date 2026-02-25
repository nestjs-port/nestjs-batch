export abstract class ItemWriterException extends Error {
  constructor(message: string, cause?: unknown) {
    super(message, cause != null ? { cause } : undefined);
  }
}
