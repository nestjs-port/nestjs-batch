import type { ItemProcessor } from "../item-processor.interface";
import { AbstractMethodInvokingDelegator } from "./abstract-method-invoking-delegator";

export class ItemProcessorAdapter<I, O>
  extends AbstractMethodInvokingDelegator<O>
  implements ItemProcessor<I, O>
{
  async process(item: I): Promise<O | null> {
    return (await this.invokeDelegateMethodWithArgument(item)) as O | null;
  }
}
