# Repository Guidelines

## Product Overview

This repository is for the WayFinder VS Code extension, which gives users one unified Quick Pick interface for navigating focusable VS Code panes and items. The selector includes built-in workbench views, every open editor tab grouped by editor group, open terminals, and user-configured custom command targets. It should orchestrate existing commands and public VS Code APIs rather than reimplement pane behavior.

The extension is named **WayFinder**. The name emphasizes discovering and moving between workbench destinations through a unified focus-navigation interface.

## Project Structure & Module Organization

Keep the layout predictable:

- `src/extension.ts` — activation and public command registration.
- `src/selector.ts` — Quick Pick construction and selector orchestration.
- `src/navigation/` — focus-target types, built-in mappings, dynamic editor/terminal discovery, custom settings parsing, and command dispatch.
- `tests/` — automated tests mirroring the relevant `src/` structure.
- `plans/` — implementation plans and other planning documents.
- `assets/` — icons, fixtures, and other non-code resources.
- Root configuration files — `package.json`, extension manifest, TypeScript settings, and repository metadata.

Prefer small, single-purpose modules. Keep activation and VS Code API wiring separate from reusable item definitions and picker logic. Add new focus targets through data-driven command mappings where practical.

## Build, Test, and Development Commands

Document the canonical commands in `package.json` and keep this section synchronized. The Node/TypeScript workflow for this repository is:

- `npm install` — install locked development dependencies.
- `npm run compile` — compile TypeScript into `out/`.
- `npm run check` — type-check without writing output.
- `npm test` — run the full automated test suite.
- `npm run watch` — compile continuously while developing.

There are currently no lint, format, build, or package scripts. Do not invoke `tsc` directly; use the npm scripts so the local TypeScript dependency from `node_modules/.bin` is resolved.

Use the package manager and scripts declared by the repository rather than introducing one-off local commands.

## Coding Style & Naming Conventions

Follow the formatter and linter configuration committed at the repository root. Use two-space indentation for JSON/YAML and the language ecosystem’s standard formatter for source code. Use `camelCase` for variables and functions, `PascalCase` for classes, types, and components, and `UPPER_SNAKE_CASE` only for true constants. Name files after their primary module or feature; use lowercase kebab-case where the surrounding tooling permits it. Use clear, stable identifiers for focus targets and keep display labels separate from VS Code command IDs.

## Testing Guidelines

Add tests with each behavior change and mirror the source layout under `tests/`. Test that the Quick Pick lists supported focus targets, groups every open editor tab under the correct editor group, maps targets to the correct built-in command, handles unavailable commands gracefully, passes custom command arguments, and preserves keyboard-friendly selection. Keep tests deterministic and run `npm test` before submitting changes. Add coverage thresholds if a test framework is introduced later.

When testing dynamic targets, use small mocked VS Code objects where possible. Manual Extension Development Host testing is still appropriate for validating actual workbench focus behavior, relocated views, multiple editor groups, and terminal/editor-tab focus.

## Commit & Pull Request Guidelines

No existing commit convention can be inferred from this checkout. Use short, imperative subjects (for example, `Add workspace symbol provider`) and keep unrelated changes in separate commits. Pull requests should explain the motivation, summarize the implementation, list validation commands and results, link relevant issues, and include screenshots or recordings for user-facing VS Code changes.

## Security & Configuration Tips

Do not commit secrets, local settings, generated build output (`out/`), VSIX files, or machine-specific paths. Use environment variables or documented local configuration for credentials, and update ignore rules when new generated files are introduced. Treat focus target labels and command IDs as user-facing compatibility surfaces: verify command availability across the supported VS Code versions before changing them.

The `wayfinder.customFocusTargets` setting accepts user-defined labels, command IDs, optional descriptions/details/icons, and JSON-compatible arguments. Validate these entries, reject internal commands beginning with `_`, and keep unavailable commands visible but safe to select. The public VS Code API does not provide a reliable generic catalog of all third-party views, so do not add heuristic runtime discovery based only on command IDs or descriptions; use reviewed built-in mappings and explicit custom targets instead.
