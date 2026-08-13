import type * as vscode from 'vscode';

export type FocusTargetSection =
  | 'Built-in Panes'
  | 'Editor Groups'
  | 'Terminals'
  | 'Custom Focus Targets';

export interface CommandFocusAction {
  readonly kind: 'command';
  readonly command: string;
  readonly args: readonly unknown[];
}

export interface TerminalFocusAction {
  readonly kind: 'terminal';
  readonly terminal: vscode.Terminal;
}

export interface EditorGroupFocusAction {
  readonly kind: 'editor-group';
  readonly viewColumn: vscode.ViewColumn;
  readonly focusCommand?: string;
  readonly activeTab?: vscode.Tab;
}

export interface EditorTabFocusAction {
  readonly kind: 'editor-tab';
  readonly viewColumn: vscode.ViewColumn;
  readonly tab: vscode.Tab;
}

export type FocusTargetAction =
  | CommandFocusAction
  | TerminalFocusAction
  | EditorGroupFocusAction
  | EditorTabFocusAction;

export interface FocusTarget {
  readonly id: string;
  readonly label: string;
  readonly section: FocusTargetSection;
  readonly description?: string;
  readonly detail?: string;
  readonly icon?: string;
  readonly groupLabel?: string;
  readonly unavailableReason?: string;
  readonly action: FocusTargetAction;
}

export function commandAction(
  command: string,
  args: readonly unknown[] = [],
): CommandFocusAction {
  return { kind: 'command', command, args };
}
