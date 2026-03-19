import type { LdapAttributes } from "./ldap-attributes.interface";

export interface RecordMapper<T> {
  mapRecord(attributes: LdapAttributes): T | null;
}
