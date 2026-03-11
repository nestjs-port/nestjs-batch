export type LdapAttributeValue = string | number | boolean | Uint8Array | null;

export interface LdapAttribute {
  id: string;
  values: LdapAttributeValue[];
}

export interface LdapAttributes {
  getName(): string;
  setName(name: string): void;
  get(attributeId: string): LdapAttribute | undefined;
  getAll(): Iterable<LdapAttribute>;
}
