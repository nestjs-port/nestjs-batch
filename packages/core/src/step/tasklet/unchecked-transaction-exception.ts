/* Copyright 2006-present the original author or authors. Licensed under the Apache License, Version 2.0. */

/** Convenience wrapper for a checked exception so that it can cause a rollback. */
export class UncheckedTransactionException extends Error {
  constructor(cause: unknown) {
    super(cause instanceof Error ? cause.message : String(cause), { cause });
  }
}
