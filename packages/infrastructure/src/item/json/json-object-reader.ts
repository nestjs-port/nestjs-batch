import type { Readable } from "node:stream";

// Strategy base class for JSON readers that stream objects one at a time.
export abstract class JsonObjectReader<T> {
  async open(_resource: Readable): Promise<void> {}

  abstract read(): Promise<T | null>;

  async close(): Promise<void> {}

  async jumpToItem(itemIndex: number): Promise<void> {
    for (let i = 0; i < itemIndex; i += 1) {
      await this.read();
    }
  }
}
