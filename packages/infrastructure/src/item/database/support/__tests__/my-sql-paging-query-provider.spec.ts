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

import { describe } from "vitest";

import { MySqlPagingQueryProvider } from "../mysql-paging-query-provider.js";
import { runAbstractSqlPagingQueryProviderTests } from "../abstract-sql-paging-query-provider-tests.js";

describe("MySqlPagingQueryProvider", () => {
  runAbstractSqlPagingQueryProviderTests(() => new MySqlPagingQueryProvider(), {
    getFirstPageSqlWithMultipleSortKeys() {
      return "SELECT id, name, age FROM foo WHERE bar = 1 ORDER BY name ASC, id DESC LIMIT 100";
    },
    getRemainingSqlWithMultipleSortKeys() {
      return "SELECT id, name, age FROM foo WHERE (bar = 1) AND ((name > ?) OR (name = ? AND id < ?)) ORDER BY name ASC, id DESC LIMIT 100";
    },
    configureGroupClause(provider) {
      provider.setGroupClause("dep");
    },
    expectedFirstPageQueryWithGroupBy:
      "SELECT id, name, age FROM foo WHERE bar = 1 GROUP BY dep ORDER BY id ASC LIMIT 100",
    expectedRemainingPagesQueryWithGroupBy:
      "SELECT * FROM (SELECT id, name, age FROM foo WHERE bar = 1 GROUP BY dep) AS MAIN_QRY WHERE ((id > ?)) ORDER BY id ASC LIMIT 100",
  });
});
