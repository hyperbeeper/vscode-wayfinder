const EDITOR_GROUP_FOCUS_COMMANDS: readonly string[] = [
  'workbench.action.focusFirstEditorGroup',
  'workbench.action.focusSecondEditorGroup',
  'workbench.action.focusThirdEditorGroup',
  'workbench.action.focusFourthEditorGroup',
  'workbench.action.focusFifthEditorGroup',
  'workbench.action.focusSixthEditorGroup',
  'workbench.action.focusSeventhEditorGroup',
  'workbench.action.focusEighthEditorGroup',
];

export function getEditorGroupFocusCommand(
  groupIndex: number,
): string | undefined {
  return groupIndex >= 1 && groupIndex <= EDITOR_GROUP_FOCUS_COMMANDS.length
    ? EDITOR_GROUP_FOCUS_COMMANDS[groupIndex - 1]
    : undefined;
}

export function getEditorGroupFocusCommands(): readonly string[] {
  return EDITOR_GROUP_FOCUS_COMMANDS;
}
