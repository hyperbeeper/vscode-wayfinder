import type * as vscode from 'vscode';

import { commandAction, type FocusTarget } from './focusTarget';

export interface CustomFocusTargetConfiguration {
  readonly label?: unknown;
  readonly description?: unknown;
  readonly detail?: unknown;
  readonly icon?: unknown;
  readonly command?: unknown;
  readonly args?: unknown;
}

function isJsonValue(value: unknown): boolean {
  if (
    value === null ||
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return true;
  }

  if (Array.isArray(value)) {
    return value.every(isJsonValue);
  }

  if (typeof value === 'object') {
    return Object.values(value as Record<string, unknown>).every(isJsonValue);
  }

  return false;
}

function iconLabel(icon: string | undefined, label: string): string {
  if (!icon) {
    return label;
  }

  return icon.startsWith('$(') ? `${icon} ${label}` : `$(${icon}) ${label}`;
}

export function getCustomFocusTargets(
  configuration: readonly unknown[],
  availableCommands?: readonly string[],
): FocusTarget[] {
  const available = availableCommands ? new Set(availableCommands) : undefined;

  return configuration.flatMap((value, index) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      return [];
    }

    const target = value as CustomFocusTargetConfiguration;
    if (
      typeof target.label !== 'string' ||
      !target.label.trim() ||
      typeof target.command !== 'string' ||
      !target.command.trim() ||
      target.command.startsWith('_') ||
      (target.args !== undefined &&
        (!Array.isArray(target.args) || !isJsonValue(target.args)))
    ) {
      return [];
    }

    const command = target.command;
    const unavailableReason = available && !available.has(command)
      ? `Command "${command}" is not currently available.`
      : undefined;

    return [{
      id: `custom-${index + 1}`,
      label: iconLabel(
        typeof target.icon === 'string' ? target.icon : undefined,
        target.label,
      ),
      section: 'Custom Focus Targets' as const,
      description: typeof target.description === 'string'
        ? target.description
        : undefined,
      detail: typeof target.detail === 'string' ? target.detail : undefined,
      unavailableReason,
      action: commandAction(
        command,
        Array.isArray(target.args) ? target.args : [],
      ),
    }];
  });
}

export function readCustomFocusTargetConfiguration(
  configuration: vscode.WorkspaceConfiguration,
): readonly unknown[] {
  const value = configuration.get<unknown>('customFocusTargets', []);
  return Array.isArray(value) ? value : [];
}
