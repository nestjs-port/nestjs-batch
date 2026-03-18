---
name: java-to-ts-migration
description: Migrate Spring Batch Java files to NestJS Batch TypeScript. Use when converting Java classes, interfaces, enums, or tests from this repository's spring-batch modules into nestjs-batch packages while preserving module/package structure and local TypeScript conventions.
argument-hint: <path-to-java-file>
---

# Java to TypeScript Migration Guide

Migrate one Java file from `spring-batch-*` to the matching TypeScript file in `nestjs-batch/packages/*`.

## Usage

Single-file mode rules:
- Migrate only the requested Java file.
- Do not migrate or create additional files unless explicitly requested.
- If dependent TS symbols are missing, assume they exist and import from expected locations.
- Do not create placeholder/stub files for dependencies.

Example:
```bash
/java-to-ts-migration spring-batch-core/src/main/java/org/springframework/batch/core/ExitStatus.java
```

## Additional Resources

Load these only when needed:
- [Code Patterns](reference/code-patterns.md)
- [Documentation Migration](reference/documentation.md)
- [Test Migration](reference/test-migration.md)

## Repository Mapping

Module mapping (Java module -> TypeScript package):
- `spring-batch-core` -> `nestjs-batch/packages/core`
- `spring-batch-infrastructure` -> `nestjs-batch/packages/infrastructure`
- `spring-batch-integration` -> `nestjs-batch/packages/platform`
- `spring-batch-test` -> `nestjs-batch/packages/commons`
- `spring-batch-{x}` -> `nestjs-batch/packages/{x}` (fallback if package exists)

Java source base path:
- Preferred: `src/main/java/org/springframework/batch/...`
- Fallback: `src/main/java/...`

Path conversion rules:
- Strip Java base path.
- For `spring-batch-core`, strip leading `core/` from relative path.
- Preserve remaining directory structure under `packages/<target>/src/`.

## Naming Rules

- Java `FooBar.java` -> `foo-bar.ts`.
- Interface target may be `foo-bar.interface.ts`.
- Enum target may be `foo-bar.enum.ts`.
- Java test `FooBarTests.java` -> `__tests__/foo-bar.spec.ts`.

## Import Rules

- Cross-package imports: `@nestjs-batch/<package>`.
- Intra-package imports: relative paths (`./`, `../`).
- Use `import type` for type-only imports.

## Migration Workflow

### 1) Resolve expected target file

Use repository helper script:
```bash
./check-missing-ts.sh spring-batch-core
./check-missing-ts.sh core
```

Use its output path as the canonical TS destination.

### 2) Convert Java code to TypeScript

- Convert package/imports to TS imports.
- Convert class/interface/enum declarations to TS equivalents.
- Convert `getXxx()` to `get xxx()`.
- Prefer `readonly` and follow nearby folder style for private/protected fields.
- Convert Java collections to TS arrays/maps/records.
- Omit Java-only patterns: `equals`, `hashCode`, `toString`.
- Omit license headers/Javadoc. Keep only inline comments inside method/function bodies.

### 3) Align with local package style

- Follow neighboring TS files in the same directory for constructor/builder patterns.
- Update `index.ts` exports only when the file is meant to be publicly exported.
- Keep output Biome/TypeScript compatible with this monorepo.

### 4) Migrate tests (only when requested)

- Convert JUnit tests to Vitest `describe/it`.
- Preserve intent and case coverage of original tests.
- Target test location: `src/**/__tests__/*.spec.ts`.

### 5) Verify

Run from `nestjs-batch/`:
```bash
pnpm --filter @nestjs-batch/<package-name> typecheck
pnpm --filter @nestjs-batch/<package-name> test
```

## Checklist

```
Migration Checklist:
- [ ] Output file path matches spring-batch -> nestjs-batch mapping
- [ ] File naming follows kebab-case (.ts/.interface.ts/.enum.ts)
- [ ] Imports use @nestjs-batch/* or proper relative paths
- [ ] Type-only imports use import type
- [ ] Java-only methods (equals/hashCode/toString) are not ported
- [ ] Javadoc/license headers are removed
- [ ] Inline comments inside method bodies are preserved
- [ ] index.ts export updated only when needed
- [ ] Test file migrated to __tests__/*.spec.ts (if requested)
- [ ] Typecheck/test executed for touched package, or limitation stated
```
