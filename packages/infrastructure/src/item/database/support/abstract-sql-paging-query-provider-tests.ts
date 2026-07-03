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

import { beforeEach, describe, expect, it } from "vitest";

import { Order } from "../order.js";
import type { AbstractSqlPagingQueryProvider } from "./abstract-sql-paging-query-provider.js";

export function runAbstractSqlPagingQueryProviderTests(
  providerFactory: () => AbstractSqlPagingQueryProvider,
): void {
  describe("AbstractSqlPagingQueryProvider", () => {
    let pagingQueryProvider: AbstractSqlPagingQueryProvider;
    let pageSize: number;

    beforeEach(() => {
      pagingQueryProvider = providerFactory();
      pagingQueryProvider.setSelectClause("id, name, age");
      pagingQueryProvider.setFromClause("foo");
      pagingQueryProvider.setWhereClause("bar = 1");

      const sortKeys = new Map<string, Order>();
      sortKeys.set("id", Order.ASCENDING);
      pagingQueryProvider.setSortKeys(sortKeys);
      pageSize = 100;
    });

    it("test query contains sort key", () => {
      const s = pagingQueryProvider
        .generateFirstPageQuery(pageSize)
        .toQuery()
        .sql.toLowerCase();
      expect(s).toContain("id asc");
    });

    it("test query contains sort key desc", () => {
      pagingQueryProvider.setSortKeys(new Map([["id", Order.DESCENDING]]));
      const s = pagingQueryProvider
        .generateFirstPageQuery(pageSize)
        .toQuery()
        .sql.toLowerCase();
      expect(s).toContain("id desc");
    });

    it("test generate first page query with multiple sort keys", () => {
      const sortKeys = new Map<string, Order>();
      sortKeys.set("name", Order.ASCENDING);
      sortKeys.set("id", Order.DESCENDING);
      pagingQueryProvider.setSortKeys(sortKeys);
      const s = pagingQueryProvider
        .generateFirstPageQuery(pageSize)
        .toQuery().sql;
      expect(s).toContain("name asc");
      expect(s).toContain("id desc");
    });

    it("test generate remaining pages query with multiple sort keys", () => {
      const sortKeys = new Map<string, Order>();
      sortKeys.set("name", Order.ASCENDING);
      sortKeys.set("id", Order.DESCENDING);
      pagingQueryProvider.setSortKeys(sortKeys);
      const s = pagingQueryProvider
        .generateRemainingPagesQuery(pageSize)
        .toQuery().sql;
      expect(s).toBe("select 2");
    });

    it("test remove key words followed by space char", () => {
      const selectClause = "SELECT id, 'yes', false";
      const fromClause = "FROM test.verification_table";
      const whereClause = "WHERE TRUE";
      pagingQueryProvider.setSelectClause(selectClause);
      pagingQueryProvider.setFromClause(fromClause);
      pagingQueryProvider.setWhereClause(whereClause);

      expect(pagingQueryProvider.selectClause).toBe("id, 'yes', false");
      expect(pagingQueryProvider.fromClause).toBe("test.verification_table");
      expect(pagingQueryProvider.whereClause).toBe("TRUE");
    });

    it("test remove key words followed by tab char", () => {
      const selectClause = "SELECT\tid, 'yes', false";
      const fromClause = "FROM\ttest.verification_table";
      const whereClause = "WHERE\tTRUE";
      pagingQueryProvider.setSelectClause(selectClause);
      pagingQueryProvider.setFromClause(fromClause);
      pagingQueryProvider.setWhereClause(whereClause);

      expect(pagingQueryProvider.selectClause).toBe("id, 'yes', false");
      expect(pagingQueryProvider.fromClause).toBe("test.verification_table");
      expect(pagingQueryProvider.whereClause).toBe("TRUE");
    });

    it("test remove key words followed by new line char", () => {
      const selectClause = "SELECT\nid, 'yes', false";
      const fromClause = "FROM\ntest.verification_table";
      const whereClause = "WHERE\nTRUE";
      pagingQueryProvider.setSelectClause(selectClause);
      pagingQueryProvider.setFromClause(fromClause);
      pagingQueryProvider.setWhereClause(whereClause);

      expect(pagingQueryProvider.selectClause).toBe("id, 'yes', false");
      expect(pagingQueryProvider.fromClause).toBe("test.verification_table");
      expect(pagingQueryProvider.whereClause).toBe("TRUE");
    });
  });
}
