import { JdbcUtils } from "../../support/index.js";

/**
 * Defines common functionality for objects that can provide parameter values for named SQL parameters.
 */
export abstract class SqlParameterSource {
  /**
   * Indicates an unknown (or unspecified) SQL type.
   */
  static readonly TYPE_UNKNOWN = JdbcUtils.TYPE_UNKNOWN;
}
