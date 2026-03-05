export class DynamicMethodInvocationException extends Error {
  constructor(cause: unknown);
  constructor(message: string, cause: unknown);
  constructor(messageOrCause: string | unknown, cause: unknown | null = null) {
    if (typeof messageOrCause === "string") {
      super(messageOrCause, cause != null ? { cause } : undefined);
      return;
    }

    const message =
      messageOrCause instanceof Error
        ? messageOrCause.message
        : String(messageOrCause);
    super(message, { cause: messageOrCause });
  }
}
