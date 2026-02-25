export interface AttributeAccessor {
  setAttribute(name: string, value: unknown): void;

  getAttribute(name: string): unknown;

  removeAttribute(name: string): unknown;

  hasAttribute(name: string): boolean;

  attributeNames(): string[];
}
