import type { RepeatContext } from "../repeat-context.js";
import type { ExceptionHandler } from "./exception-handler";

export class DefaultExceptionHandler implements ExceptionHandler {
  handleException(_context: RepeatContext, throwable: unknown): never {
    throw throwable;
  }
}
