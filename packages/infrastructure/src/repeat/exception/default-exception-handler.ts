import type { RepeatContext } from "../repeat-context";
import type { ExceptionHandler } from "./exception-handler";

export class DefaultExceptionHandler implements ExceptionHandler {
  handleException(_context: RepeatContext, throwable: unknown): never {
    throw throwable;
  }
}
