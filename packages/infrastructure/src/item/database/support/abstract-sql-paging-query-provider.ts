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

import assert from "node:assert/strict";

import { StringUtils } from "@nestjs-port/core";
import { sql, type DataSource, type SQL } from "@nestjs-port/jsdbc";

import { JdbcParameterUtils } from "../jdbc-parameter-utils.js";
import type { Order } from "../order.js";
import type { PagingQueryProvider } from "../paging-query-provider.js";

/**
 * Abstract SQL paging query provider serving as the base for all SQL paging query providers.
 *
 * Implementations must provide select and from clauses, optionally a where clause, and
 * a single-column sort key used to drive paging. The sort key should be backed by an
 * index for better performance and should be a true unique key to avoid losing data
 * between executions.
 */
export abstract class AbstractSqlPagingQueryProvider implements PagingQueryProvider {
  private _selectClause: string | null = null;

  private _fromClause: string | null = null;

  private _whereClause: string | null = null;

  private _groupClause: string | null = null;

  private _sortKeys = new Map<string, Order>();

  private _parameterCount = 0;

  private _usingNamedParameters = false;

  /**
   * Set the SQL `GROUP BY` clause.
   */
  setGroupClause(groupClause: string | null = null): void {
    this._groupClause =
      groupClause && groupClause.trim().length > 0
        ? this.removeKeyword("group by", groupClause)
        : null;
  }

  /**
   * Get the SQL `GROUP BY` clause.
   */
  get groupClause(): string | null {
    return this._groupClause;
  }

  /**
   * Get the SQL `SELECT` clause.
   */
  get selectClause(): string | null {
    return this._selectClause;
  }

  /**
   * Get the SQL `FROM` clause.
   */
  get fromClause(): string | null {
    return this._fromClause;
  }

  /**
   * Get the SQL `WHERE` clause.
   */
  get whereClause(): string | null {
    return this._whereClause;
  }

  /**
   * Get the sort keys used to page through results.
   */
  get sortKeys(): ReadonlyMap<string, Order> {
    return this._sortKeys;
  }

  /**
   * Set the SQL `SELECT` clause.
   */
  setSelectClause(selectClause: string): void {
    this._selectClause = this.removeKeyword("select", selectClause);
  }

  /**
   * Set the SQL `FROM` clause.
   */
  setFromClause(fromClause: string): void {
    this._fromClause = this.removeKeyword("from", fromClause);
  }

  /**
   * Set the SQL `WHERE` clause.
   */
  setWhereClause(whereClause: string | null = null): void {
    this._whereClause =
      whereClause && whereClause.trim().length > 0
        ? this.removeKeyword("where", whereClause)
        : null;
  }

  /**
   * Set the sort keys used to page through results.
   */
  setSortKeys(
    sortKeys: ReadonlyMap<string, Order> | Record<string, Order>,
  ): void {
    this._sortKeys =
      sortKeys instanceof Map
        ? new Map(sortKeys)
        : new Map(Object.entries(sortKeys) as Array<[string, Order]>);
  }

  /**
   * Get the number of parameters declared in the query.
   */
  get parameterCount(): number {
    return this._parameterCount;
  }

  /**
   * Indicate whether the generated queries use named parameter syntax.
   */
  isUsingNamedParameters(): boolean {
    return this._usingNamedParameters;
  }

  /**
   * Return the placeholder for a sort key, depending on the parameter style.
   */
  getSortKeyPlaceHolder(keyName: string): string {
    return this._usingNamedParameters ? `:_${keyName}` : "?";
  }

  /**
   * Validate mandatory properties and initialize query metadata.
   */
  init(dataSource: DataSource): void {
    assert.ok(dataSource, "A DataSource is required");
    assert.ok(
      StringUtils.hasText(this._selectClause),
      "selectClause must be specified",
    );
    assert.ok(
      StringUtils.hasText(this._fromClause),
      "fromClause must be specified",
    );
    assert.ok(this._sortKeys.size > 0, "sortKey must be specified");

    let sql = `SELECT ${this._selectClause} FROM ${this._fromClause}`;
    if (this._whereClause != null) {
      sql += ` WHERE ${this._whereClause}`;
    }
    if (this._groupClause != null) {
      sql += ` GROUP BY ${this._groupClause}`;
    }
    const namedParameters: string[] = [];
    this._parameterCount = JdbcParameterUtils.countParameterPlaceholders(
      sql,
      namedParameters,
    );
    if (namedParameters.length > 0) {
      if (this._parameterCount !== namedParameters.length) {
        throw new Error(
          `You can't use both named parameters and classic "?" placeholders: ${sql}`,
        );
      }
      this._usingNamedParameters = true;
    }
  }

  abstract generateFirstPageQuery(pageSize: number): SQL;

  abstract generateRemainingPagesQuery(pageSize: number): SQL;

  /**
   * Get the sort keys without aliases.
   */
  get sortKeysWithoutAliases(): ReadonlyMap<string, Order> {
    const sortKeysWithoutAliases = new Map<string, Order>();

    for (const [key, value] of this._sortKeys.entries()) {
      const separator = key.indexOf(".");
      if (separator > 0) {
        const columnIndex = separator + 1;
        if (columnIndex < key.length) {
          sortKeysWithoutAliases.set(key.substring(columnIndex), value);
        }
      } else {
        sortKeysWithoutAliases.set(key, value);
      }
    }

    return sortKeysWithoutAliases;
  }

  private removeKeyword(keyword: string, clause: string): string {
    const trimmedClause = clause.trim();
    const keywordLength = keyword.length;
    if (
      trimmedClause.toLowerCase().startsWith(keyword) &&
      /\s/.test(trimmedClause.charAt(keywordLength)) &&
      trimmedClause.length > keywordLength + 1
    ) {
      return trimmedClause.substring(keywordLength + 1);
    }

    return trimmedClause;
  }

  protected buildSql(query: string): SQL {
    return sql.raw(query);
  }
}
