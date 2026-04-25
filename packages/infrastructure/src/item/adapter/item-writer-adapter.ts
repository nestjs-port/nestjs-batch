import type { Chunk } from "../chunk.js";
import type { ItemWriter } from "../item-writer.interface.js";
import { AbstractMethodInvokingDelegator } from "./abstract-method-invoking-delegator.js";

export class ItemWriterAdapter<T>
  extends AbstractMethodInvokingDelegator<T>
  implements ItemWriter<T>
{
  async write(items: Chunk<T>): Promise<void> {
    for (const item of items) {
      await this.invokeDelegateMethodWithArgument(item);
    }
  }
}
