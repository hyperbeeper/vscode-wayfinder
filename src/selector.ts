import * as vscode from 'vscode';

import { getBuiltInFocusTargets } from './navigation/builtInFocusTargets';
import { getCustomFocusTargets } from './navigation/customFocusTargets';
import { getDynamicFocusTargets } from './navigation/dynamicFocusTargets';
import type { FocusTarget, FocusTargetSection } from './navigation/focusTarget';
import { executeFocusTarget } from './navigation/focusTargetExecutor';

type SelectorItem = vscode.QuickPickItem & {
  readonly target?: FocusTarget;
};

const SECTION_ORDER: readonly FocusTargetSection[] = [
  'Built-in Panes',
  'Editor Groups',
  'Terminals',
  'Custom Focus Targets',
];

function toSelectorItem(target: FocusTarget): SelectorItem {
  const suffix = target.unavailableReason ? ' (Unavailable)' : '';
  return {
    label: `${target.label}${suffix}`,
    description: target.description,
    detail: target.unavailableReason || target.detail,
    target,
  };
}

export function createSelectorItems(
  targets: readonly FocusTarget[],
): SelectorItem[] {
  const items: SelectorItem[] = [];

  for (const section of SECTION_ORDER) {
    const sectionTargets = targets.filter(target => target.section === section);
    if (!sectionTargets.length) {
      continue;
    }

    if (section !== 'Editor Groups') {
      items.push({
        label: section,
        kind: vscode.QuickPickItemKind.Separator,
      });
      items.push(...sectionTargets.map(toSelectorItem));
      continue;
    }

    items.push({
      label: section,
      kind: vscode.QuickPickItemKind.Separator,
    });

    let previousGroupLabel: string | undefined;
    for (const target of sectionTargets) {
      if (target.groupLabel !== previousGroupLabel) {
        items.push({
          label: target.groupLabel || 'Editor Group',
          kind: vscode.QuickPickItemKind.Separator,
        });
        previousGroupLabel = target.groupLabel;
      }
      items.push(toSelectorItem(target));
    }
  }

  return items;
}

export async function buildFocusTargets(): Promise<FocusTarget[]> {
  const availableCommands = await vscode.commands.getCommands(true);
  const customConfiguration = vscode.workspace.getConfiguration('wayfinder');

  return [
    ...getBuiltInFocusTargets(availableCommands),
    ...getDynamicFocusTargets(),
    ...getCustomFocusTargets(
      customConfiguration.get<unknown[]>('customFocusTargets', []),
      availableCommands,
    ),
  ];
}

export async function openSelector(): Promise<void> {
  const targets = await buildFocusTargets();
  const selected = await vscode.window.showQuickPick(
    createSelectorItems(targets),
    {
      title: 'WayFinder: What do you want to focus on?',
      placeHolder: 'Type to filter panes and editor groups',
      matchOnDescription: true,
      matchOnDetail: true,
    },
  );

  if (!selected?.target) {
    return;
  }

  try {
    await executeFocusTarget(selected.target);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await vscode.window.showErrorMessage(`WayFinder could not focus that target: ${message}`);
  }
}
