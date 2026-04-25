import type { RepeatContext } from "../repeat-context.js";
import type { ExceptionHandler } from "./exception-handler.js";

export class CompositeExceptionHandler implements ExceptionHandler {
  private _handlers: ExceptionHandler[] = [];

  setHandlers(handlers: ExceptionHandler[]): void {
    this._handlers = [...handlers];
  }

  handleException(context: RepeatContext, throwable: unknown): void {
    for (const handler of this._handlers) {
      handler.handleException(context, throwable);
    }
  }
}
