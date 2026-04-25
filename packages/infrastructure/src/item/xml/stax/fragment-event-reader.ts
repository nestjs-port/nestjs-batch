import type { XMLEventReader } from "./xml-event-reader.interface.js";

export interface FragmentEventReader extends XMLEventReader {
  markStartFragment(): void;

  markFragmentProcessed(): void;

  reset(): void;
}
