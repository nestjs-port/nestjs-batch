export abstract class DataAccessException extends Error {
  protected constructor(message: string | null);
  protected constructor(message: string | null, cause: unknown | null);
  protected constructor(message: string | null, cause?: unknown | null) {
    super(message ?? "", cause != null ? { cause } : undefined);
  }
}
