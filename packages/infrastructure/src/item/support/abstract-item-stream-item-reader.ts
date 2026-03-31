import { ItemStreamSupport } from "../item-stream-support";
import type { ItemStreamReader } from "../item-stream-reader.interface";

export abstract class AbstractItemStreamItemReader<T>
  extends ItemStreamSupport
  implements ItemStreamReader<T>
{
  abstract read(): Promise<T | null>;
}
