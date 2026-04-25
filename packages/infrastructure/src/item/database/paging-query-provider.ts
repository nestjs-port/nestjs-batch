/*
 * Copyright 2006-present the original author or authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import type { DataSource } from "@nestjs-port/jsdbc";

import type { Order } from "./order.js";

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
