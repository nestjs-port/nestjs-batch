import type { XMLEventWriter } from "./stax";

export interface StaxWriterCallback {
  write(writer: XMLEventWriter): void;
}
