import assert from "node:assert/strict";

import { type DataSource, StringUtils } from "@nestjs-batch/commons";

import { JdbcParameterUtils } from "../jdbc-parameter-utils";
import type { Order } from "../order";
import type { PagingQueryProvider } from "../paging-query-provider";

export abstract class AbstractSqlPagingQueryProvider
  implements PagingQueryProvider
{
  private _selectClause: string | null = null;

  private _fromClause: string | null = null;

  private _whereClause: string | null = null;

  private _groupClause: string | null = null;

  private _sortKeys = new Map<string, Order>();

  private _parameterCount = 0;

  private _usingNamedParameters = false;

  setGroupClause(groupClause: string | null = null): void {
    this._groupClause =
      groupClause && groupClause.trim().length > 0
        ? this.removeKeyword("group by", groupClause)
        : null;
  }

  get groupClause(): string | null {
    return this._groupClause;
  }

  get selectClause(): string | null {
    return this._selectClause;
  }

  get fromClause(): string | null {
    return this._fromClause;
  }

  get whereClause(): string | null {
    return this._whereClause;
  }

  get sortKeys(): ReadonlyMap<string, Order> {
    return this._sortKeys;
  }

  setSelectClause(selectClause: string): void {
    this._selectClause = this.removeKeyword("select", selectClause);
  }

  setFromClause(fromClause: string): void {
    this._fromClause = this.removeKeyword("from", fromClause);
  }

  setWhereClause(whereClause: string | null = null): void {
    this._whereClause =
      whereClause && whereClause.trim().length > 0
        ? this.removeKeyword("where", whereClause)
        : null;
  }

  setSortKeys(
    sortKeys: ReadonlyMap<string, Order> | Record<string, Order>,
  ): void {
    this._sortKeys =
      sortKeys instanceof Map
        ? new Map(sortKeys)
        : new Map(Object.entries(sortKeys) as Array<[string, Order]>);
  }

  get parameterCount(): number {
    return this._parameterCount;
  }

  isUsingNamedParameters(): boolean {
    return this._usingNamedParameters;
  }

  getSortKeyPlaceHolder(keyName: string): string {
    return this._usingNamedParameters ? `:_${keyName}` : "?";
  }

  init(dataSource: DataSource): void {
    assert.notEqual(dataSource, null, "A DataSource is required");
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

  abstract generateFirstPageQuery(pageSize: number): string;

  abstract generateRemainingPagesQuery(pageSize: number): string;

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
}
