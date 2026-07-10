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

import type { SQL } from "@nestjs-port/jsdbc";

import { Order } from "../order.js";
import { AbstractSqlPagingQueryProvider } from "./abstract-sql-paging-query-provider.js";

export class OraclePagingQueryProvider extends AbstractSqlPagingQueryProvider {
  override generateFirstPageQuery(pageSize: number): SQL {
    return this.buildSql(
      this.generateRowNumSqlQuery(false, this.buildRowNumClause(pageSize)),
    );
  }

  override generateRemainingPagesQuery(pageSize: number): SQL {
    return this.buildSql(
      this.generateRowNumSqlQuery(true, this.buildRowNumClause(pageSize)),
    );
  }

  private buildRowNumClause(pageSize: number): string {
    return `ROWNUM <= ${pageSize}`;
  }

  private generateRowNumSqlQuery(
    remainingPageQuery: boolean,
    rowNumClause: string,
  ): string {
    return `SELECT * FROM (SELECT ${this.selectClause} FROM ${this.fromClause}${this.whereClause == null ? "" : ` WHERE ${this.whereClause}`}${this.groupClause == null ? "" : ` GROUP BY ${this.groupClause}`} ORDER BY ${this.buildSortClause()}) WHERE ${rowNumClause}${remainingPageQuery ? ` AND ${this.buildSortConditions()}` : ""}`;
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
