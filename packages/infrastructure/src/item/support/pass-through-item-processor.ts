import type { ItemProcessor } from "../item-processor.interface";

export class PassThroughItemProcessor<T> implements ItemProcessor<T, T> {
  async process(item: T): Promise<T | null> {
    return item;
  }
}
