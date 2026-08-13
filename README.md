# WayFinder

WayFinder is a VS Code extension for navigating focusable workbench destinations through one unified, searchable interface. It combines built-in workbench panes with open editor groups, terminals, and user-configured commands.

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

Press `F5` in VS Code to launch an Extension Development Host. Then open the Command Palette and run **WayFinder: Focus...**, or use the default shortcut `Ctrl+Alt+F` (`Cmd+Alt+F` on macOS).

## Commands

| Command | Purpose |
| --- | --- |
| `WayFinder: Focus...` | Open the searchable focus-target selector. |

The default keybinding can be changed from **File > Preferences > Keyboard Shortcuts** or in `keybindings.json`:

```json
{
  "key": "ctrl+shift+f",
  "command": "wayfinder.openSelector"
}
```

The selector includes built-in panes such as Explorer, Search, Source Control, Run and Debug, Extensions, Testing, the Side Bar, Auxiliary Bar, Panel, Problems, Output, Debug Console, Terminal, and Remote Explorer / Ports when that view is available. It lists every open editor tab, grouped under its editor group, as well as open terminals in the current VS Code window.

## Custom focus targets

Add commands supplied by another extension, or your own command, through the `wayfinder.customFocusTargets` setting:

```json
{
  "wayfinder.customFocusTargets": [
    {
      "label": "My Custom Pane",
      "description": "Provided by another extension",
      "command": "myExtension.focusPane",
      "args": []
    }
  ]
}
```

Each target requires `label` and `command`. You can also provide `description`, `detail`, `icon` (a codicon name such as `symbol-misc`), and JSON-compatible `args`. Targets whose command is not available are shown as unavailable and are not executed.

WayFinder cannot generically enumerate every view contributed by every installed extension: the public VS Code API exposes command IDs, but not a reliable pane title/location catalog. Custom targets provide an explicit escape hatch for those views.

## Development scripts

- `npm run compile` — compile TypeScript into `out/`.
- `npm run watch` — recompile TypeScript as files change.
- `npm run check` — type-check without writing output.
- `npm test` — compile and run the project smoke tests.

## Project layout

- `src/extension.ts` — VS Code activation and command registration.
- `src/selector.ts` — Quick Pick selector orchestration.
- `src/navigation/` — Built-in, dynamic, custom, and execution logic for focus targets.
- `tests/` — deterministic project smoke tests.
- `.vscode/launch.json` — Extension Development Host launch configuration.
- `.vscode/tasks.json` — compile and watch tasks used by VS Code.

As navigation features are added, keep focus-target definitions and command mappings in small, reusable modules under `src/`, with matching tests under `tests/`.

## Packaging

Packaging is intentionally not configured yet. When the extension is ready for distribution, add `@vscode/vsce`, define an `npm run package` script, and review `.vscodeignore` before producing a VSIX.
