import { ItemReaderException } from "./item-reader-exception";

export class UnexpectedInputException extends ItemReaderException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
