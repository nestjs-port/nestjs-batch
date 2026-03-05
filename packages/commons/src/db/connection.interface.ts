export interface Connection {
  query<T = unknown>(
    sql: string,
    params?: readonly unknown[],
  ): Promise<readonly T[]>;
  close(): Promise<void>;
}
