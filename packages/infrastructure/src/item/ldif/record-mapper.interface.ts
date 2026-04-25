import type { LdapAttributes } from "./ldap-attributes.interface.js";

export interface RecordMapper<T> {
  mapRecord(attributes: LdapAttributes): T | null;
}
