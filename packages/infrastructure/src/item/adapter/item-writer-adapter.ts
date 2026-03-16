import type { Chunk } from "../chunk";
import type { ItemWriter } from "../item-writer.interface";
import { AbstractMethodInvokingDelegator } from "./abstract-method-invoking-delegator";

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
