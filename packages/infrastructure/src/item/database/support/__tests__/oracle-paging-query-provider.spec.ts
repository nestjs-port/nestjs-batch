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

import { OraclePagingQueryProvider } from "../oracle-paging-query-provider.js";
import { runAbstractSqlPagingQueryProviderTests } from "../abstract-sql-paging-query-provider-tests.js";

describe("OraclePagingQueryProvider", () => {
  runAbstractSqlPagingQueryProviderTests(
    () => new OraclePagingQueryProvider(),
    {
      getFirstPageSqlWithMultipleSortKeys() {
        return "SELECT * FROM (SELECT id, name, age FROM foo WHERE bar = 1 ORDER BY name ASC, id DESC) WHERE ROWNUM <= 100";
      },
      getRemainingSqlWithMultipleSortKeys() {
        return "SELECT * FROM (SELECT id, name, age FROM foo WHERE bar = 1 ORDER BY name ASC, id DESC) WHERE ROWNUM <= 100 AND ((name > ?) OR (name = ? AND id < ?))";
      },
      configureGroupClause(provider) {
        provider.setGroupClause("dep");
      },
      expectedFirstPageQueryWithGroupBy:
        "SELECT * FROM (SELECT id, name, age FROM foo WHERE bar = 1 GROUP BY dep ORDER BY id ASC) WHERE ROWNUM <= 100",
      expectedRemainingPagesQueryWithGroupBy:
        "SELECT * FROM (SELECT id, name, age FROM foo WHERE bar = 1 GROUP BY dep ORDER BY id ASC) WHERE ROWNUM <= 100 AND ((id > ?))",
    },
  );
});
