import type { MailMessage } from "@nestjs-batch/commons";

import type { MailErrorHandler } from "./mail-error-handler.interface";

export class DefaultMailErrorHandler implements MailErrorHandler {
  static readonly DEFAULT_MAX_MESSAGE_LENGTH = 1024;

  private _maxMessageLength =
    DefaultMailErrorHandler.DEFAULT_MAX_MESSAGE_LENGTH;

  setMaxMessageLength(maxMessageLength: number): void {
    this._maxMessageLength = maxMessageLength;
  }

  handle(message: MailMessage, exception: Error): void {
    const msg = message.toString();
    throw new Error(
      `Mail server send failed: ${msg.slice(0, this._maxMessageLength)}`,
      { cause: exception },
    );
  }
}
