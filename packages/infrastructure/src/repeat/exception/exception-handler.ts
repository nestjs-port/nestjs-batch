import type { RepeatContext } from "../context/index.js";

export interface ExceptionHandler {
  handleException(context: RepeatContext, throwable: unknown): void;
}
