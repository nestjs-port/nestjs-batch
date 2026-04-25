---
name: commit
description: Commit changes following nestjs-batch repository conventions. Use when the user wants to commit changes. Analyzes git diff, generates conventional commit format messages, and executes git commit automatically.
---

# Commit Changes for nestjs-batch

Commit changes following the nestjs-batch repository's conventional commit format. This skill analyzes changes, generates appropriate commit messages, and executes the commit.

## Commit Format

Follow this structure:

```text
type(scope): concise description

- Detailed bullet point 1
- Detailed bullet point 2
- Detailed bullet point 3
```

## Commit Types

Use these types based on the change:

- `feat`: New feature or functionality
- `fix`: Bug fix
- `refactor`: Code restructuring without changing behavior
- `test`: Adding or updating tests
- `docs`: Documentation changes
- `chore`: Maintenance tasks, dependencies, tooling

## Scopes

Optional scopes based on affected packages:

- `commons`: Changes to `packages/commons/`
- `core`: Changes to `packages/core/`
- `infrastructure`: Changes to `packages/infrastructure/`
- `platform`: Changes to `packages/platform/`

Use scope when changes are limited to a specific package. Omit scope for cross-package changes.

## Description Guidelines

Subject line:

- Use imperative mood: "add", "fix", "refactor", not "added", "fixed", "refactored"
- Keep under 72 characters
- Be specific but concise
- Mention key functionality or affected component

Body bullets:

- Start each bullet with a capital letter
- Use present tense
- Be specific about what changed
- Include context when migrating or porting from Java
- List multiple related changes as separate bullets
- Mention test additions or updates when relevant

## Examples

### Feature Addition

```text
feat(core): add job execution status helpers
- Add helper methods for status transitions
- Export status helpers from package entrypoints
- Add tests for new status edge cases
```

### Migration/Porting

```text
feat(infrastructure): port repeat context components from Java
- Add RepeatContext and RepeatListener contracts in TypeScript
- Port repeat operations flow from Spring Batch Java implementation
- Preserve parent-child context behavior and completion semantics
- Add tests for nested context and termination edge cases
```

### Refactoring

```text
refactor(core): simplify job parameter validation flow
- Collapse duplicate validation branches in default validator
- Reorder imports and exports for consistent module boundaries
- Keep runtime behavior unchanged while reducing surface complexity
```

### Bug Fix

```text
fix(core): validate job parameter type before builder insertion
- Add guard for undefined parameter type in addJobParameter overload
- Prevent runtime failures caused by non-null assertions
- Update tests to cover invalid type input handling
```

### Documentation

```text
docs(core): add JSDoc comments for job execution APIs
```

### Test Addition

```text
test(infrastructure): add repeat context behavior tests
```

## Commit Workflow

When committing changes, follow these steps:

1. Check `git status` to see what files are staged or modified.
2. Review `git diff` or `git diff --staged` and understand the full change set before staging.
3. Split by logical units when meaningful and create multiple commits when the change set can be separated cleanly.
4. Use a single commit when the changes are tightly coupled or too small to separate.
5. Run `pnpm format` before staging or committing.
6. Run `pnpm lint` before committing and resolve issues before staging or committing.
7. Stage changes for each unit with `git add <files>` or `git add -p`.
8. Determine the type and scope.
9. Generate a commit message that follows the format above.
10. Execute `git commit --signoff -m "<subject>" -m "<body>"`.

## Important Notes

- Always check `git status` first before committing.
- Always assess whether changes should be split into multiple commits before staging everything.
- Always run `pnpm format` before staging or committing.
- Always run `pnpm lint` before committing.
- Default behavior: If the user says "commit" without a file scope, treat all current repository changes as commit candidates.
- Do not force a single commit for all candidates. Split into multiple commits when logical units are separable; use one commit only when split is not meaningful.
- Only ask for scope confirmation when the user explicitly indicates a partial commit, file-specific commit, or when the target repository is ambiguous.
- Always use `--signoff` so every commit includes a Signed-off-by trailer.
- Use `git commit --signoff -m` for the subject and `-m` for the body.
- If no changes are staged, stage all changes by default with `git add -A` and then split or stage per logical unit as needed, unless the user asked for a partial commit.
- Never force push or perform destructive git operations without an explicit user request.

## Special Cases

- Java-to-TypeScript migrations: Mention "port from Java" or "migrate from Java".
- Test updates: Include in the body when tests are added or modified.
- Multiple packages: Omit scope for cross-package changes.
- Linting fixes: Include in fix commits when fixing lint warnings.
- Co-authors: Include `Co-authored-by:` lines when applicable.

## Execution Example

When the user asks to commit:

```bash
# 1. Check status
git status

# 2. Review changes
git diff

# 3. Run formatting and lint checks
pnpm format
pnpm lint

# 4. Stage changes
git add .

# 5. Analyze staged changes
git diff --staged

# 6. Generate commit message based on changes
# Example output:
# feat(core): add job execution repository integration
# - Add repository-backed lookup for running executions
# - Wire execution mapper for persisted metadata
# - Add tests for missing execution and success paths

# 7. Execute commit
git commit --signoff -m "feat(core): add job execution repository integration" -m "- Add repository-backed lookup for running executions
- Wire execution mapper for persisted metadata
- Add tests for missing execution and success paths"
```

## Pre-commit Hooks

This repository uses husky with lint-staged. The pre-commit hook will automatically run linting on staged files. If linting fails, the commit will be rejected. Fix linting issues before committing.
