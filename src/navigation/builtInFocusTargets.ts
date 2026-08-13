import { commandAction, type FocusTarget } from './focusTarget';

interface BuiltInFocusTargetDefinition {
  readonly id: string;
  readonly label: string;
  readonly command: string;
  readonly args?: readonly unknown[];
  readonly description?: string;
}

const BUILT_IN_FOCUS_TARGET_DEFINITIONS: readonly BuiltInFocusTargetDefinition[] = [
  {
    id: 'explorer',
    label: 'Explorer',
    command: 'workbench.view.explorer',
    description: 'Files and folders',
  },
  {
    id: 'search',
    label: 'Search',
    command: 'workbench.view.search',
    description: 'Search across the workspace',
  },
  {
    id: 'source-control',
    label: 'Source Control',
    command: 'workbench.view.scm',
    description: 'Source control changes',
  },
  {
    id: 'run-and-debug',
    label: 'Run and Debug',
    command: 'workbench.view.debug',
    description: 'Run and debug configurations',
  },
  {
    id: 'extensions',
    label: 'Extensions',
    command: 'workbench.view.extensions',
    description: 'Installed and available extensions',
  },
  {
    id: 'testing',
    label: 'Testing',
    command: 'workbench.view.testing',
    description: 'Tests and test results',
  },
  {
    id: 'activity-bar',
    label: 'Activity Bar',
    command: 'workbench.action.focusActivityBar',
  },
  {
    id: 'side-bar',
    label: 'Primary Side Bar',
    command: 'workbench.action.focusSideBar',
  },
  {
    id: 'auxiliary-bar',
    label: 'Auxiliary Bar',
    command: 'workbench.action.focusAuxiliaryBar',
  },
  {
    id: 'panel',
    label: 'Panel',
    command: 'workbench.action.focusPanel',
  },
  {
    id: 'problems',
    label: 'Problems',
    command: 'workbench.actions.view.problems',
    description: 'Errors and warnings',
  },
  {
    id: 'output',
    label: 'Output',
    command: 'workbench.action.openView',
    args: ['workbench.panel.output'],
    description: 'Output channels',
  },
  {
    id: 'debug-console',
    label: 'Debug Console',
    command: 'workbench.debug.action.focusRepl',
  },
  {
    id: 'terminal',
    label: 'Terminal Panel',
    command: 'workbench.action.terminal.focus',
  },
  {
    id: 'ports',
    label: 'Remote Explorer / Ports',
    command: 'workbench.view.remote',
    description: 'Remote resources and forwarded ports',
  },
];

export function getBuiltInFocusTargets(
  availableCommands?: readonly string[],
): FocusTarget[] {
  const available = availableCommands
    ? new Set(availableCommands)
    : undefined;

  return BUILT_IN_FOCUS_TARGET_DEFINITIONS
    .filter(target => !available || available.has(target.command))
    .map(target => ({
      id: target.id,
      label: target.label,
      section: 'Built-in Panes' as const,
      description: target.description,
      action: commandAction(target.command, target.args),
    }));
}

export function getBuiltInFocusTargetDefinitions(): readonly BuiltInFocusTargetDefinition[] {
  return BUILT_IN_FOCUS_TARGET_DEFINITIONS;
}
