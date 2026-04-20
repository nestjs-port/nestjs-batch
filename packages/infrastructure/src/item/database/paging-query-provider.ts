import type { DataSource } from "@nestjs-port/jsdbc";

import type { Order } from "./order";

/**
 * Interface defining the functionality to be provided for generating paging queries for use with paging item readers.
 */
export interface PagingQueryProvider {
  /**
   * Initialize the query provider using the provided data source if necessary.
   */
  init(dataSource: DataSource): void | Promise<void>;

  /**
   * Generate the query that will provide the first page, limited by the page size.
   */
  generateFirstPageQuery(pageSize: number): string;

  /**
   * Generate the query that will provide the remaining pages, limited by the page size.
   */
  generateRemainingPagesQuery(pageSize: number): string;

  /**
   * The number of parameters that are declared in the query.
   */
  get parameterCount(): number;

  /**
   * Indicate whether the generated queries use named parameter syntax.
   */
  isUsingNamedParameters(): boolean;

  /**
   * The sort keys used to order the query.
   */
  get sortKeys(): ReadonlyMap<string, Order>;

  /**
   * Returns either a named placeholder for a sort key value or a positional placeholder.
   */
  getSortKeyPlaceHolder(keyName: string): string;

  /**
   * The sort key map without aliases.
   */
  get sortKeysWithoutAliases(): ReadonlyMap<string, Order>;
}
