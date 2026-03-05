export interface Connection {
  query<T = unknown>(sql: string): Promise<readonly T[]>;
  query<T = unknown>(
    sql: string,
    params: readonly unknown[] | null,
  ): Promise<readonly T[]>;
  close(): Promise<void>;
}
