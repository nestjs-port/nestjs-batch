---
name: commit
description: Commit changes following nestjs-batch repository conventions. Use when the user wants to commit changes. Analyzes git diff, generates conventional commit format messages, and executes git commit automatically.
---

# Commit Changes for nestjs-batch

Commit changes following the nestjs-batch repository's conventional commit format. This skill analyzes changes, generates appropriate commit messages, and executes the commit.

## Commit Format

Follow this structure:

```
type(scope): concise description

- Detailed bullet point 1
- Detailed bullet point 2
- Detailed bullet point 3
```

## Commit Types

Use these types based on the change:

- **feat**: New feature or functionality
- **fix**: Bug fix
- **refactor**: Code restructuring without changing behavior
- **test**: Adding or updating tests
- **docs**: Documentation changes
- **chore**: Maintenance tasks, dependencies, tooling

## Scopes

Optional scopes based on affected packages:

- `commons`: Changes to `packages/commons/`
- `core`: Changes to `packages/core/`
- `infrastructure`: Changes to `packages/infrastructure/`
- `observation`: Changes to `packages/observation/`
- `platform`: Changes to `packages/platform/`

Use scope when changes are limited to a specific package. Omit scope for cross-package changes.

## Description Guidelines

**Subject line (first line)**:
- Use imperative mood: "add", "fix", "refactor", not "added", "fixed", "refactored"
- Keep under 72 characters
- Be specific but concise
- Mention key functionality or affected component

**Body (bullet points)**:
- Start each bullet with a capital letter
- Use present tense
- Be specific about what changed
- Include context when migrating/porting from Java
- List multiple related changes as separate bullets
- Mention test additions or updates when relevant

## Examples

### Feature Addition

```
feat(observation): add async local observation registry
- Add observation registry implementation backed by AsyncLocalStorage
- Export observation registry API from package entrypoints
- Wire shared observation interfaces for handler and scope access
```

### Migration/Porting

```
feat(infrastructure): port repeat context components from Java
- Add RepeatContext and RepeatListener contracts in TypeScript
- Port repeat operations flow from Spring Batch Java implementation
- Preserve parent-child context behavior and completion semantics
- Add tests for nested context and termination edge cases
```

### Refactoring

```
refactor(core): simplify job parameter validation flow
- Collapse duplicate validation branches in default validator
- Reorder imports and exports for consistent module boundaries
- Keep runtime behavior unchanged while reducing surface complexity
```

### Bug Fix

```
fix(core): validate job parameter type before builder insertion
- Add guard for undefined parameter type in addJobParameter overload
- Prevent runtime failures caused by non-null assertions
- Update tests to cover invalid type input handling
```

### Documentation

```
docs(core): add JSDoc comments for job execution APIs
```

### Test Addition

```
test(infrastructure): add repeat context behavior tests
```

## Commit Workflow

When committing changes, follow these steps:

1. **Check git status**: Run `git status` to see what files are staged or modified
2. **Analyze all changes first**: Review `git diff` (or `git diff --staged`) and understand the full change set before staging
3. **Split by logical units when meaningful**: Group changes by cohesive intent (feature/fix/refactor/test/docs) and create multiple commits when the change set can be separated cleanly
4. **Use a single commit when split is not meaningful**: If changes are tightly coupled or too small to separate, commit them together
5. **Run formatting before commit**: Execute `pnpm format` and review any resulting changes
6. **Run lint checks before commit**: Execute `pnpm lint` and resolve issues before staging/committing
7. **Stage changes for each unit**: Use `git add <files>` (or `git add -p`) per logical unit
8. **Determine type**: Classify as feat/fix/refactor/test/docs/chore based on each unit
9. **Identify scope**: Check if changes are package-specific (commons/core/infrastructure/observation/platform)
10. **Generate commit message**: Create message following the format above
11. **Execute commit**: Run `git commit -m "subject" -m "body"` with the generated message

### Important Notes

- **Always check git status first** before committing
- **Always assess whether changes should be split into multiple commits** before staging everything
- **Always run `pnpm format` before staging/committing**
- **Always run `pnpm lint` before committing**
- **Default behavior**: If the user says "commit" without a file scope, treat all current repository changes (staged, unstaged, and untracked) as commit candidates
- **Do not force a single commit for all candidates**: Split into multiple commits when logical units are separable; use one commit only when split is not meaningful
- **Only ask for scope confirmation** when the user explicitly indicates a partial commit, file-specific commit, or when the target repository is ambiguous
- **Use `git commit -m` for subject and `-m` for body** (multiple `-m` flags create multi-line commit)
- **If no changes are staged**, stage all changes by default (`git add -A`) and then split/stage per logical unit as needed, unless the user asked for a partial commit
- **Never force push** or perform destructive git operations without explicit user request

## Special Cases

- **Java to TypeScript migrations**: Mention "port from Java" or "migrate from Java"
- **Test updates**: Include in body when tests are added/modified
- **Multiple packages**: Omit scope for cross-package changes
- **Linting fixes**: Include in fix commits when fixing lint warnings
- **Co-authors**: Include `Co-authored-by:` line when applicable

## Execution Example

When user asks to commit:

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
git commit -m "feat(core): add job execution repository integration" -m "- Add repository-backed lookup for running executions
- Wire execution mapper for persisted metadata
- Add tests for missing execution and success paths"
```

## Pre-commit Hooks

Note: This repository uses husky with lint-staged. The pre-commit hook will automatically run linting on staged files. If linting fails, the commit will be rejected. Fix linting issues before committing.
