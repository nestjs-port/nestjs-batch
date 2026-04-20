import type { ItemStreamReader } from "../item-stream-reader.interface";
import { ItemStreamSupport } from "../item-stream-support";

export abstract class AbstractItemStreamItemReader<T>
  extends ItemStreamSupport
  implements ItemStreamReader<T>
{
  abstract read(): Promise<T | null>;
}
