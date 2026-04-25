---
name: java-to-ts-migration
description: Migrate Spring Batch Java files to NestJS Batch TypeScript. Use when converting Java classes, interfaces, enums, or tests from this repository's spring-batch modules into nestjs-batch packages while preserving module/package structure and local TypeScript conventions.
argument-hint: <path-to-java-file>
---

# Java to TypeScript Migration Guide

Migrate one Java file from `spring-batch-*` to the matching TypeScript file in `nestjs-batch/packages/*`.

## Workflow

1. Confirm migration scope.
Convert only the explicitly requested file.
If the file references missing TypeScript dependencies, assume they already exist and import by expected path.
Do not create stub files unless the user asks.

2. Map source path to target path.
Use the mapping table below to choose the target package and output location.
Use kebab-case file names in TypeScript.

3. Convert implementation semantics.
Preserve behavior and API intent, not Java syntax.
Apply the conversion rules in this file, then pull detailed examples from `reference/code-patterns.md` when needed.

4. Convert tests when the input is a test file.
Use `reference/test-migration.md` for JUnit-to-Vitest mapping and naming constraints.
Do not add new tests that did not exist in Java.
Copy Java test-method inline comments verbatim into the matching TypeScript `it()` block.
Preserve comment wording and relative placement.
For multi-line inline comments, preserve line splitting and order.

5. Export surface updates.
If the migrated file is part of public module surface, update the closest `index.ts` barrel export.
Use explicit file exports and avoid widening public API unintentionally.

## Directory Structure Mapping

| Spring Batch (Java) | NestJS Batch (TypeScript) |
|---|---|
| `spring-batch-core/src/main/java/org/springframework/batch/core/` | `nestjs-batch/packages/core/src/` |
| `spring-batch-infrastructure/src/main/java/org/springframework/batch/infrastructure/` | `nestjs-batch/packages/infrastructure/src/` |
| `spring-batch-integration/src/main/java/org/springframework/batch/integration/` | `nestjs-batch/packages/platform/src/` |
| `spring-batch-test/src/main/java/org/springframework/batch/test/` | `nestjs-batch/packages/commons/src/` |
| `spring-batch-{x}` | `nestjs-batch/packages/{x}` (fallback if package exists) |

### Test File Mapping

| Java Test Location | TypeScript Test Location |
|---|---|
| `src/test/java/.../FooTests.java` | `src/.../__tests__/foo.spec.ts` |

## File Naming Conventions

| Java Pattern | TypeScript Pattern |
|---|---|
| `FooBar.java` (class) | `foo-bar.ts` (kebab-case) |
| `FooBar.java` (interface) | `foo-bar.interface.ts` or `foo-bar.ts` |
| `FooBar.java` (enum) | `foo-bar.enum.ts` |
| `FooBarTests.java` | `__tests__/foo-bar.spec.ts` |

## Conversion Rules

### Type Mapping

| Java | TypeScript |
|---|---|
| `String` | `string` |
| `int`, `long`, `Integer` | `number` |
| `boolean`, `Boolean` | `boolean` |
| `void` | `void` |
| `Object` | `unknown` |
| `@Nullable T` | `T \| null` |

### Collection Types

| Java | TypeScript |
|---|---|
| `List<T>` | `T[]` |
| `Set<T>` | `Set<T>` |
| `Map<K, V>` | `Map<K, V>` or `Record<K, V>` |
| `Map<String, Object>` | `Record<string, unknown>` |

### Special Types

| Java | TypeScript |
|---|---|
| `Flux<T>` | `Observable<T>` (from `rxjs`) |
| `Mono<T>` | `Promise<T>` |
| `Resource` | Remove (Spring-specific) |

### Structure And API Rules

1. Convert `getXxx()` methods to TypeScript getters (`get xxx(): Type`).
2. Prefix protected/private fields with `_` and add `readonly` where immutability is intended.
3. Convert `public static final` constants to `static readonly`.
4. Prefer `{ClassName}Props` constructor interfaces with object options over overloaded Java constructors.
5. Replace `Assert.notNull(...)` with `assert(...)` from `node:assert/strict`.
6. Replace Java copy constructors (`new HashMap<>(x)`, `new ArrayList<>(x)`) with spread copies.
7. Convert Java interfaces with `static` or `default` methods into TypeScript `abstract class`; keep plain interfaces as `interface`.

## Import/Export Patterns

### Package Imports

```typescript
// Cross-package imports use @nestjs-batch scope
import type { Something } from "@nestjs-batch/core";

// Same-package imports use relative paths
import { AbstractMessage } from "./abstract-message.js";
import type { Message } from "./message.interface.js";
```

### Barrel Export Rules

1. Use `export * from "./<directory>/index.js";` only for child directories that have their own `index.ts`.
2. For `.ts` files in the same directory as `index.ts`, always use explicit named exports.
3. Do not use `export * from "./<file>.js";` for same-directory files.
4. If migrating a file changes barrel exports, update every affected `index.ts` to satisfy rules 1-3.

## Comments Handling

Do not migrate Javadoc.
Add the standard Apache license header used by `nestjs-batch` to every migrated TypeScript source and test file.
Preserve meaningful inline implementation comments inside method/function bodies.
For test files, comments inside Java test methods MUST be copied verbatim into the corresponding TypeScript test body.
Do not paraphrase, summarize, or omit Java method-body comments.

## Reference Files

- Use `reference/code-patterns.md` for concrete class/interface/builder conversions.
- Use `reference/test-migration.md` for JUnit-to-Vitest rules, especially naming and structure constraints.

## Checklist

```text
Migration Checklist:
- [ ] Convert only requested file(s)
- [ ] Map to correct `nestjs-batch` package path
- [ ] Apply kebab-case file naming
- [ ] Preserve behavior and public API intent
- [ ] Apply getter/field/constructor conversion rules
- [ ] Keep imports and barrel exports consistent
- [ ] Use `.js` extensions in relative imports/exports
- [ ] `index.ts` uses `export *` only for child directories; same-directory files use explicit exports
- [ ] Omit Javadoc
- [ ] Add the `nestjs-batch` Apache license header to every migrated TypeScript source and test file
- [ ] Preserve meaningful inline implementation comments
- [ ] For tests, keep case names/structure aligned with source JUnit tests
- [ ] Test-method inline comments copied verbatim and kept in matching locations
- [ ] No Java method-body comment was paraphrased or omitted
- [ ] Typecheck/test executed for touched package, or limitation stated
```
