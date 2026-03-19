import type { RepeatContext } from "../repeat-context";

export interface ExceptionHandler {
  handleException(context: RepeatContext, throwable: unknown): void;
}
