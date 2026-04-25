import type { XMLEvent } from "./xml-event.interface.js";

export interface XMLEventReader<
  E extends XMLEvent = XMLEvent,
> extends Iterator<E> {
  nextEvent(): E;

  hasNext(): boolean;

  peek(): E | null;

  getElementText(): string;

  nextTag(): E;

  getProperty(name: string): unknown;

  close(): void;

  remove(): void;
}
