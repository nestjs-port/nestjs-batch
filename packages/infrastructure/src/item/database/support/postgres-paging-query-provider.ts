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

import { StringUtils } from "@nestjs-port/core";
import type { SQL } from "@nestjs-port/jsdbc";

import { Order } from "../order.js";
import { AbstractSqlPagingQueryProvider } from "./abstract-sql-paging-query-provider.js";

export class PostgresPagingQueryProvider extends AbstractSqlPagingQueryProvider {
  override generateFirstPageQuery(pageSize: number): SQL {
    return this.buildSql(
      this.generateLimitSqlQuery(false, this.buildLimitClause(pageSize)),
    );
  }

  override generateRemainingPagesQuery(pageSize: number): SQL {
    const limitClause = this.buildLimitClause(pageSize);
    if (StringUtils.hasText(this.groupClause)) {
      return this.buildSql(this.generateLimitGroupedSqlQuery(limitClause));
    }

    return this.buildSql(this.generateLimitSqlQuery(true, limitClause));
  }

  private buildLimitClause(pageSize: number): string {
    return `LIMIT ${pageSize}`;
  }

  private generateLimitSqlQuery(
    remainingPageQuery: boolean,
    limitClause: string,
  ): string {
    let query = `SELECT ${this.selectClause} FROM ${this.fromClause}`;
    if (remainingPageQuery) {
      query += ` WHERE (${this.whereClause}) AND ${this.buildSortConditions()}`;
    } else if (this.whereClause != null) {
      query += ` WHERE ${this.whereClause}`;
    }
    if (this.groupClause != null) {
      query += ` GROUP BY ${this.groupClause}`;
    }
    query += ` ORDER BY ${this.buildSortClause()} ${limitClause}`;
    return query;
  }

  private generateLimitGroupedSqlQuery(limitClause: string): string {
    return `SELECT * FROM (SELECT ${this.selectClause} FROM ${this.fromClause}${this.whereClause == null ? "" : ` WHERE ${this.whereClause}`}${this.groupClause == null ? "" : ` GROUP BY ${this.groupClause}`}) AS MAIN_QRY WHERE ${this.buildSortConditions()} ORDER BY ${this.buildSortClause()} ${limitClause}`;
  }

  private buildSortClause(): string {
    return Array.from(this.sortKeys.entries())
      .map(
        ([key, value]) =>
          `${key}${value === Order.DESCENDING ? " DESC" : " ASC"}`,
      )
      .join(", ");
  }

  private buildSortConditions(): string {
    const keys = Array.from(this.sortKeys.entries());
    const clauses: string[] = [];

    for (let i = 0; i < keys.length; i++) {
      const parts: string[] = [];
      for (let j = 0; j < i; j++) {
        const [key] = keys[j]!;
        parts.push(`${key} = ${this.getSortKeyPlaceHolder(key)}`);
      }
      const [key, order] = keys[i]!;
      parts.push(
        `${key} ${order === Order.DESCENDING ? "<" : ">"} ${this.getSortKeyPlaceHolder(key)}`,
      );
      clauses.push(parts.join(" AND "));
    }

    return `(${clauses.map((clause) => `(${clause})`).join(" OR ")})`;
  }
}
