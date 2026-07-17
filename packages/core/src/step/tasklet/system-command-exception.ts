/* Copyright 2006-present the original author or authors. Licensed under the Apache License, Version 2.0. */

/** Exception indicating failed execution of a system command. */
export class SystemCommandException extends Error {
  constructor(message: string, cause: unknown | null = null) {
    super(message, cause != null ? { cause } : undefined);
  }
}
