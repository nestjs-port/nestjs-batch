export class ItemStreamException extends Error {
  constructor(message: string);
  constructor(message: string | null, cause: unknown);
  constructor(cause: unknown);
  constructor(
    messageOrCause: string | null | unknown,
    cause: unknown | null = null,
  ) {
    if (typeof messageOrCause === "string" || messageOrCause === null) {
      const message = messageOrCause ?? "";
      super(message, cause != null ? { cause } : undefined);
      return;
    }

    const message =
      messageOrCause instanceof Error
        ? messageOrCause.message
        : String(messageOrCause);
    super(message, { cause: messageOrCause });
  }
}
