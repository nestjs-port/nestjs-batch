import type { RepeatContext } from "../context/index.js";
import type { ExceptionHandler } from "./exception-handler";

export class DefaultExceptionHandler implements ExceptionHandler {
  handleException(_context: RepeatContext, throwable: unknown): never {
    throw throwable;
  }
}
