import type { XMLEvent } from "./xml-event.interface.js";
import type { XMLEventReader } from "./xml-event-reader.interface.js";

export interface XMLEventWriter {
  add(event: XMLEvent): void;
  add(reader: XMLEventReader): void;

  flush(): void;

  close(): void;

  getPrefix(uri: string): string;

  setPrefix(prefix: string, uri: string): void;

  setDefaultNamespace(uri: string): void;
}
