import type { ItemReader } from "../item-reader.interface";
import { AbstractMethodInvokingDelegator } from "./abstract-method-invoking-delegator";

export class ItemReaderAdapter<T>
  extends AbstractMethodInvokingDelegator<T>
  implements ItemReader<T>
{
  async read(): Promise<T | null> {
    return (await this.invokeDelegateMethod()) as T | null;
  }
}
