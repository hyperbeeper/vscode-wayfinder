import * as vscode from 'vscode';

import type { FocusTarget } from './focusTarget';

export async function executeFocusTarget(target: FocusTarget): Promise<void> {
  if (target.unavailableReason) {
    throw new Error(target.unavailableReason);
  }

  switch (target.action.kind) {
    case 'command':
      await vscode.commands.executeCommand(
        target.action.command,
        ...target.action.args,
      );
      return;
    case 'terminal':
      target.action.terminal.show();
      return;
    case 'editor-tab': {
      const { input } = target.action.tab;

      if (input instanceof vscode.TabInputText) {
        await vscode.commands.executeCommand(
          'vscode.open',
          input.uri,
          { viewColumn: target.action.viewColumn },
        );
        return;
      }

      if (input instanceof vscode.TabInputTextDiff || input instanceof vscode.TabInputNotebookDiff) {
        await vscode.commands.executeCommand(
          'vscode.diff',
          input.original,
          input.modified,
          target.action.tab.label,
          { viewColumn: target.action.viewColumn },
        );
        return;
      }

      if (input instanceof vscode.TabInputCustom) {
        await vscode.commands.executeCommand(
          'vscode.openWith',
          input.uri,
          input.viewType,
          { viewColumn: target.action.viewColumn },
        );
        return;
      }

      if (input instanceof vscode.TabInputNotebook) {
        const notebook = await vscode.workspace.openNotebookDocument(input.uri);
        await vscode.window.showNotebookDocument(notebook, {
          viewColumn: target.action.viewColumn,
        });
        return;
      }

      throw new Error(
        'This tab type cannot be focused through the public VS Code API.',
      );
    }
    case 'editor-group': {
      if (target.action.focusCommand) {
        await vscode.commands.executeCommand(target.action.focusCommand);
        return;
      }

      const activeTab = target.action.activeTab;
      if (activeTab?.input instanceof vscode.TabInputText) {
        await vscode.commands.executeCommand(
          'vscode.open',
          activeTab.input.uri,
          { viewColumn: target.action.viewColumn },
        );
        return;
      }

      if (activeTab?.input instanceof vscode.TabInputTextDiff) {
        await vscode.commands.executeCommand(
          'vscode.open',
          activeTab.input.modified,
          { viewColumn: target.action.viewColumn },
        );
        return;
      }

      if (activeTab?.input instanceof vscode.TabInputNotebook) {
        const notebook = await vscode.workspace.openNotebookDocument(activeTab.input.uri);
        await vscode.window.showNotebookDocument(notebook, {
          viewColumn: target.action.viewColumn,
        });
        return;
      }

      throw new Error(
        'This editor group cannot be focused through the public VS Code API.',
      );
    }
  }
}
