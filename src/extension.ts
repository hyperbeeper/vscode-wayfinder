import * as vscode from 'vscode';

import { openSelector } from './selector';

/**
 * Called by VS Code when the extension is activated.
 *
 * Keep VS Code API wiring here and move reusable navigation definitions into
 * separate modules as the extension grows.
 */
export function activate(context: vscode.ExtensionContext): void {
  const openSelectorCommand = vscode.commands.registerCommand(
    'wayfinder.openSelector',
    () => openSelector(),
  );

  context.subscriptions.push(openSelectorCommand);
}

/** Called by VS Code before the extension is unloaded. */
export function deactivate(): void {
  // No cleanup is needed yet.
}
