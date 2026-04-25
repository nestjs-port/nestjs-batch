import type { XMLEventWriter } from "./stax/index.js";

export interface StaxWriterCallback {
  write(writer: XMLEventWriter): void;
}
