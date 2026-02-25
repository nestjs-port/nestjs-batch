import { ItemWriterException } from "./item-writer-exception";

export class WriterNotOpenException extends ItemWriterException {
  constructor(message: string, cause?: unknown) {
    super(message, cause);
  }
}
