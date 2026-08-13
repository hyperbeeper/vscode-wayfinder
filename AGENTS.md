# Repository Guidelines

## Product Overview

This repository is for a VS Code extension that gives users one unified interface for navigating focusable VS Code panes and items. The extension should open a popup pane or picker containing options such as open files, Explorer, Terminal, and other supported workbench views, then trigger the corresponding built-in VS Code focus command. It should orchestrate existing commands rather than reimplement pane behavior.

The extension is named **WayFinder**. The name emphasizes discovering and moving between workbench destinations through a unified focus-navigation interface.

## Project Structure & Module Organization

As the project is populated, keep the layout predictable:

- `src/` — extension activation, popup/picker UI, focusable-item definitions, and command dispatch.
- `tests/` — automated tests mirroring the relevant `src/` structure.
- `assets/` — icons, fixtures, and other non-code resources.
- Root configuration files — `package.json`, extension manifest, build, lint, format, and TypeScript settings.

Prefer small, single-purpose modules. Keep activation and VS Code API wiring separate from reusable item definitions and picker logic. Add new focus targets through data-driven command mappings where practical.

## Build, Test, and Development Commands

Document the canonical commands in `package.json` and keep this section synchronized. A typical Node/TypeScript workflow would be:

- `npm install` — install locked development dependencies.
- `npm run build` — compile the extension or application.
- `npm test` — run the full automated test suite.
- `npm run lint` — check code quality and style.
- `npm run format` — apply the repository formatter.
- `npm run package` — produce an installable VSIX, if packaging is configured.

Use the package manager and scripts declared by the repository rather than introducing one-off local commands.

## Coding Style & Naming Conventions

Follow the formatter and linter configuration committed at the repository root. Use two-space indentation for JSON/YAML and the language ecosystem’s standard formatter for source code. Use `camelCase` for variables and functions, `PascalCase` for classes, types, and components, and `UPPER_SNAKE_CASE` only for true constants. Name files after their primary module or feature; use lowercase kebab-case where the surrounding tooling permits it. Use clear, stable identifiers for focus targets and keep display labels separate from VS Code command IDs.

## Testing Guidelines

Add tests with each behavior change and mirror the source layout under `tests/`. Test that the popup lists supported focus targets, maps each target to the correct built-in command, handles unavailable commands gracefully, and preserves keyboard-friendly selection. Use descriptive names such as `focusTargetCommands.test.ts`. Keep tests deterministic and run the complete suite before submitting changes. Add coverage thresholds once a test framework is selected.

## Commit & Pull Request Guidelines

No existing commit convention can be inferred from this checkout. Use short, imperative subjects (for example, `Add workspace symbol provider`) and keep unrelated changes in separate commits. Pull requests should explain the motivation, summarize the implementation, list validation commands and results, link relevant issues, and include screenshots or recordings for user-facing VS Code changes.

## Security & Configuration Tips

Do not commit secrets, local settings, generated build output, VSIX files, or machine-specific paths. Use environment variables or documented local configuration for credentials, and update ignore rules when new generated files are introduced. Treat focus target labels and command IDs as user-facing compatibility surfaces: verify command availability across the supported VS Code versions before changing them.
