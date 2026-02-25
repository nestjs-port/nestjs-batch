import { ItemReaderException } from "./item-reader-exception";

export class ParseException extends ItemReaderException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
