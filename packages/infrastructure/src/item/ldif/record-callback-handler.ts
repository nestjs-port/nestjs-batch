import type { LdapAttributes } from "./ldap-attributes.interface";

export interface RecordCallbackHandler {
  handleRecord(attributes: LdapAttributes): void;
}
