import { ItemReaderException } from "./item-reader-exception";

export class NonTransientResourceException extends ItemReaderException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
