# WayFinder

WayFinder is a VS Code extension project for navigating focusable workbench destinations through one unified interface. The repository currently contains the smallest useful extension foundation: a TypeScript activation entry point and a `WayFinder: Hello World` command that confirms activation.

## Requirements

- VS Code 1.85 or newer
- Node.js 20 or newer
- npm

## Getting started

Install dependencies and compile the extension:

```sh
npm install
npm run compile
```

Press `F5` in VS Code to launch an Extension Development Host. Then open the Command Palette and run **WayFinder: Hello World**.

## Commands

| Command | Purpose |
| --- | --- |
| `WayFinder: Hello World` | Smoke-test extension activation and command registration. |

## Development scripts

- `npm run compile` — compile TypeScript into `out/`.
- `npm run watch` — recompile TypeScript as files change.
- `npm run check` — type-check without writing output.
- `npm test` — compile and run the project smoke tests.

## Project layout

- `src/extension.ts` — VS Code activation and command registration.
- `tests/` — deterministic project smoke tests.
- `.vscode/launch.json` — Extension Development Host launch configuration.
- `.vscode/tasks.json` — compile and watch tasks used by VS Code.

As navigation features are added, keep focus-target definitions and command mappings in small, reusable modules under `src/`, with matching tests under `tests/`.

## Packaging

Packaging is intentionally not configured yet. When the extension is ready for distribution, add `@vscode/vsce`, define an `npm run package` script, and review `.vscodeignore` before producing a VSIX.
