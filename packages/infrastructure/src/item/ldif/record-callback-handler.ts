import type { LdapAttributes } from "./ldap-attributes.interface.js";

export interface RecordCallbackHandler {
  handleRecord(attributes: LdapAttributes): void;
}
