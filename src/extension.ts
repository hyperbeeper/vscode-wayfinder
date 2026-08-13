import * as vscode from 'vscode';

/**
 * Called by VS Code when the extension is activated.
 *
 * Keep VS Code API wiring here and move reusable navigation definitions into
 * separate modules as the extension grows.
 */
export function activate(context: vscode.ExtensionContext): void {
  const helloWorldCommand = vscode.commands.registerCommand(
    'wayfinder.helloWorld',
    () => {
      void vscode.window.showInformationMessage('WayFinder is ready.');
    },
  );

  context.subscriptions.push(helloWorldCommand);
}

/** Called by VS Code before the extension is unloaded. */
export function deactivate(): void {
  // No cleanup is needed yet.
}
