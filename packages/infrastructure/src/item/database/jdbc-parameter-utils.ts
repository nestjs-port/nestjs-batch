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
