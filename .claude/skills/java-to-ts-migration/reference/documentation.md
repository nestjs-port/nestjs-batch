# Documentation Migration (Javadoc -> TypeScript Comments)

## Core Rule

Migrate only comments that are useful for implementation clarity in the target TS file.

Required behavior:
- Do not copy Java license headers.
- Do not copy class/method/field Javadoc blocks by default.
- Preserve inline comments inside method/function bodies when they explain logic.

## What to Drop

### 1) License Header

**Java (drop):**
```java
/*
 * Copyright 2006-2025 the original author or authors.
 * Licensed under the Apache License, Version 2.0 (the "License");
 */
package org.springframework.batch.core;
```

**TypeScript (correct):**
```typescript
export class ExitStatus {
```

### 2) Class-Level Javadoc

**Java (drop):**
```java
/**
 * Value object used to carry information about the status of a job or step execution.
 */
public class ExitStatus {
```

**TypeScript (correct):**
```typescript
export class ExitStatus {
```

### 3) Method-Level Javadoc

**Java (drop):**
```java
/**
 * Getter for the exit code.
 */
public String getExitCode() {
```

**TypeScript (correct):**
```typescript
get exitCode(): string {
```

## What to Keep

### Inline Comments in Method Body

**Java:**
```java
public @Nullable T read() {
    // Return null when all input data is exhausted
    if (list.isEmpty()) {
        return null;
    }
    return list.remove(0);
}
```

**TypeScript:**
```typescript
async read(): Promise<T | null> {
  // Return null when all input data is exhausted
  if (this._items.length === 0) {
    return null;
  }
  return this._items.shift() ?? null;
}
```

## Practical Guidance

- If nearby files in `nestjs-batch/packages/<pkg>/src` already keep extensive JSDoc, follow local style.
- If nearby files are mostly minimal, keep migrated file minimal too.
- Prefer consistency with sibling files over literal Javadoc translation.
