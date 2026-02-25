import { ItemReaderException } from "./item-reader-exception";

export class ReaderNotOpenException extends ItemReaderException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
