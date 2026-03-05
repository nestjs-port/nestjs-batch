import type { SqlParameterSource } from "@nestjs-batch/commons";

export interface ItemSqlParameterSourceProvider<T> {
  createSqlParameterSource(item: T): SqlParameterSource;
}
