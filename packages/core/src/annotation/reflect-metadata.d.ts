declare module "reflect-metadata";

declare namespace Reflect {
  function defineMetadata(
    metadataKey: unknown,
    metadataValue: unknown,
    target: object,
    propertyKey?: string | symbol,
  ): void;

  function getMetadata(
    metadataKey: unknown,
    target: object,
    propertyKey?: string | symbol,
  ): unknown;
}
