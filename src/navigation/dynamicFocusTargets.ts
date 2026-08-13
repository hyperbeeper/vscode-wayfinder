import * as vscode from 'vscode';

import type { FocusTarget } from './focusTarget';
import { getEditorGroupFocusCommand } from './editorGroupCommands';

function groupDescription(group: vscode.TabGroup): string {
  const tabCount = `${group.tabs.length} tab${group.tabs.length === 1 ? '' : 's'}`;
  return `${group.isActive ? 'Active · ' : ''}${tabCount}`;
}

function groupLabel(group: vscode.TabGroup, groupIndex: number): string {
  return `Editor Group ${groupIndex}${group.isActive ? ' (Active)' : ''} · Column ${Number(group.viewColumn)}`;
}

function tabDescription(tab: vscode.Tab): string {
  const state = [
    tab.isActive ? 'Active' : undefined,
    tab.isDirty ? 'Unsaved' : undefined,
    tab.isPinned ? 'Pinned' : undefined,
  ].filter(Boolean);

  return state.length ? state.join(' · ') : 'Opened file';
}

function canFocusTab(tab: vscode.Tab): boolean {
  return tab.input instanceof vscode.TabInputText ||
    tab.input instanceof vscode.TabInputTextDiff ||
    tab.input instanceof vscode.TabInputCustom ||
    tab.input instanceof vscode.TabInputNotebook ||
    tab.input instanceof vscode.TabInputNotebookDiff;
}

export function canFocusEditorGroupFallback(
  activeTab: vscode.Tab | undefined,
): boolean {
  return activeTab?.input instanceof vscode.TabInputText ||
    activeTab?.input instanceof vscode.TabInputTextDiff ||
    activeTab?.input instanceof vscode.TabInputNotebook;
}

export function getEditorGroupFocusTargets(
  groups: readonly vscode.TabGroup[],
): FocusTarget[] {
  return [...groups]
    .sort((left, right) => Number(left.viewColumn) - Number(right.viewColumn))
    .flatMap((group, index): FocusTarget[] => {
      const groupIndex = index + 1;
      const focusCommand = getEditorGroupFocusCommand(groupIndex);
      const currentGroupLabel = groupLabel(group, groupIndex);

      if (!group.tabs.length) {
        const unavailableReason = focusCommand || canFocusEditorGroupFallback(group.activeTab)
          ? undefined
          : 'This empty editor group cannot be focused through the public VS Code API.';

        return [{
          id: `editor-group-${groupIndex}`,
          label: 'Empty editor group',
          section: 'Editor Groups' as const,
          description: groupDescription(group),
          detail: `Column ${Number(group.viewColumn)}`,
          groupLabel: currentGroupLabel,
          unavailableReason,
          action: {
            kind: 'editor-group' as const,
            viewColumn: group.viewColumn,
            focusCommand,
            activeTab: group.activeTab,
          },
        }];
      }

      return group.tabs.map((tab, tabIndex) => ({
        id: `editor-group-${groupIndex}-tab-${tabIndex + 1}`,
        label: tab.label,
        section: 'Editor Groups' as const,
        description: tabDescription(tab),
        detail: currentGroupLabel,
        groupLabel: currentGroupLabel,
        unavailableReason: canFocusTab(tab)
          ? undefined
          : 'This tab type cannot be focused through the public VS Code API.',
        action: {
          kind: 'editor-tab' as const,
          viewColumn: group.viewColumn,
          tab,
        },
      }));
    });
}

export function getTerminalFocusTargets(
  terminals: readonly vscode.Terminal[],
): FocusTarget[] {
  return terminals.map((terminal, index) => ({
    id: `terminal-${index + 1}`,
    label: terminal.name || `Terminal ${index + 1}`,
    section: 'Terminals' as const,
    description: terminal.exitStatus ? 'Exited' : 'Open terminal',
    action: {
      kind: 'terminal' as const,
      terminal,
    },
  }));
}

export function getDynamicFocusTargets(): FocusTarget[] {
  return [
    ...getEditorGroupFocusTargets(vscode.window.tabGroups.all),
    ...getTerminalFocusTargets(vscode.window.terminals),
  ];
}

export function getFocusCommandForEditorGroup(
  groupIndex: number,
): string | undefined {
  return getEditorGroupFocusCommand(groupIndex);
}
