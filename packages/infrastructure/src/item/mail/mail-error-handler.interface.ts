import type { MailMessage } from "@nestjs-batch/commons";

export interface MailErrorHandler {
  handle(message: MailMessage, exception: Error): void;
}
