export class JobExecutionException extends Error {
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause != null ? { cause } : undefined);
  }
}
