import type { Connection } from "./connection.interface";

export interface DataSource {
  get connection(): Promise<Connection>;
}
