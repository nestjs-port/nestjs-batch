import type { ItemStreamReader } from "../item-stream-reader.interface.js";
import { ItemStreamSupport } from "../item-stream-support.js";

export abstract class AbstractItemStreamItemReader<T>
  extends ItemStreamSupport
  implements ItemStreamReader<T>
{
  abstract read(): Promise<T | null>;
}
