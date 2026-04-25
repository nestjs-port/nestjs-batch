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

/**
 * Helper methods for SQL statement parameter parsing.
 *
 * Only intended for internal use.
 */
export abstract class JdbcParameterUtils {
  /**
   * Count placeholders in an SQL string.
   *
   * Placeholders inside single or double quoted literals are ignored.
   * Supports both classic (`?`) and named placeholders (`:name`, `&name`).
   */
  static countParameterPlaceholders(
    sql: string | null,
    namedParameterHolder: string[] | null = null,
  ): number {
    if (sql == null) {
      return 0;
    }

    let withinQuotes = false;
    let currentQuote = "";
    let parameterCount = 0;
    let index = 0;
    const namedParameters = new Set<string>();

    while (index < sql.length) {
      const currentChar = sql.charAt(index);
      if (withinQuotes) {
        if (currentChar === currentQuote) {
          withinQuotes = false;
          currentQuote = "";
        }
      } else if (currentChar === '"' || currentChar === "'") {
        withinQuotes = true;
        currentQuote = currentChar;
      } else if (currentChar === ":" || currentChar === "&") {
        let nextIndex = index + 1;
        let parameterName = "";

        while (
          nextIndex < sql.length &&
          JdbcParameterUtils.parameterNameContinues(sql, nextIndex)
        ) {
          parameterName += sql.charAt(nextIndex);
          nextIndex += 1;
        }

        if (nextIndex - index > 1 && !namedParameters.has(parameterName)) {
          parameterCount += 1;
          namedParameters.add(parameterName);
          index = nextIndex - 1;
        }
      } else if (currentChar === "?") {
        parameterCount += 1;
      }

      index += 1;
    }

    namedParameterHolder?.push(...namedParameters.values());
    return parameterCount;
  }

  private static parameterNameContinues(
    statement: string,
    position: number,
  ): boolean {
    const character = statement.charAt(position);
    return ![" ", ",", ")", '"', "'", "|", ";", "\n", "\r"].includes(character);
  }
}
