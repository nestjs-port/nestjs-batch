import type { XMLEvent } from "./xml-event.interface";
import type { XMLEventReader } from "./xml-event-reader.interface";

export interface XMLEventWriter {
  add(event: XMLEvent): void;
  add(reader: XMLEventReader): void;

  flush(): void;

  close(): void;

  getPrefix(uri: string): string;

  setPrefix(prefix: string, uri: string): void;

  setDefaultNamespace(uri: string): void;
}
