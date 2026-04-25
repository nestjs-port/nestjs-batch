import type { RepeatContext } from "../repeat-context.js";

export interface ExceptionHandler {
  handleException(context: RepeatContext, throwable: unknown): void;
}
