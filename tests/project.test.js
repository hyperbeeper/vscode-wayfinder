const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');

const projectRoot = path.resolve(__dirname, '..');
const manifest = JSON.parse(
  fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'),
);

test('extension manifest points to the compiled entry point', () => {
  assert.equal(manifest.main, './out/extension.js');
  assert.equal(manifest.engines.vscode, '^1.85.0');
  assert.equal(manifest.contributes.commands[0].command, 'wayfinder.openSelector');
  assert.equal(manifest.contributes.commands[0].title, 'WayFinder: Focus...');
  assert.equal(manifest.contributes.keybindings[0].command, 'wayfinder.openSelector');
  assert.equal(manifest.contributes.keybindings[0].key, 'ctrl+alt+f');
  assert.equal(
    manifest.contributes.configuration.properties['wayfinder.customFocusTargets']
      .items.required.includes('label'),
    true,
  );
});

test('the TypeScript extension entry point is compiled', () => {
  assert.equal(fs.existsSync(path.join(projectRoot, 'out', 'extension.js')), true);
});

test('built-in targets use reviewed focus command mappings', () => {
  const { getBuiltInFocusTargets } = require(path.join(
    projectRoot,
    'out',
    'navigation',
    'builtInFocusTargets.js',
  ));
  const targets = getBuiltInFocusTargets();

  assert.deepEqual(
    targets.map(target => target.id),
    [
      'explorer',
      'search',
      'source-control',
      'run-and-debug',
      'extensions',
      'testing',
      'activity-bar',
      'side-bar',
      'auxiliary-bar',
      'panel',
      'problems',
      'output',
      'debug-console',
      'terminal',
      'ports',
    ],
  );
  assert.equal(targets[0].action.command, 'workbench.view.explorer');
  assert.equal(
    targets.find(target => target.id === 'problems').action.command,
    'workbench.actions.view.problems',
  );
  assert.equal(
    targets.find(target => target.id === 'output').action.command,
    'workbench.action.openView',
  );
  assert.deepEqual(
    targets.find(target => target.id === 'output').action.args,
    ['workbench.panel.output'],
  );
  assert.equal(targets.at(-1).action.command, 'workbench.view.remote');
});

test('built-in targets can be filtered against available commands', () => {
  const { getBuiltInFocusTargets } = require(path.join(
    projectRoot,
    'out',
    'navigation',
    'builtInFocusTargets.js',
  ));
  const targets = getBuiltInFocusTargets(['workbench.view.explorer']);

  assert.deepEqual(targets.map(target => target.id), ['explorer']);
});

test('editor-group command numbering is stable and bounded', () => {
  const {
    getEditorGroupFocusCommand,
    getEditorGroupFocusCommands,
  } = require(path.join(
    projectRoot,
    'out',
    'navigation',
    'editorGroupCommands.js',
  ));

  assert.equal(getEditorGroupFocusCommand(1), 'workbench.action.focusFirstEditorGroup');
  assert.equal(getEditorGroupFocusCommand(8), 'workbench.action.focusEighthEditorGroup');
  assert.equal(getEditorGroupFocusCommand(0), undefined);
  assert.equal(getEditorGroupFocusCommand(9), undefined);
  assert.equal(getEditorGroupFocusCommands().length, 8);
});

test('custom targets parse valid settings and reject unsafe entries', () => {
  const { getCustomFocusTargets } = require(path.join(
    projectRoot,
    'out',
    'navigation',
    'customFocusTargets.js',
  ));
  const targets = getCustomFocusTargets([
    {
      label: 'Custom Pane',
      description: 'A test pane',
      icon: 'symbol-misc',
      command: 'extension.focusPane',
      args: [{ mode: 'compact' }],
    },
    { label: 'Missing command', command: 'missing.command' },
    { label: 'Internal', command: '_internal.command' },
    { label: 'Invalid args', command: 'extension.invalid', args: [undefined] },
  ], ['extension.focusPane']);

  assert.equal(targets.length, 2);
  assert.equal(targets[0].label, '$(symbol-misc) Custom Pane');
  assert.deepEqual(targets[0].action.args, [{ mode: 'compact' }]);
  assert.equal(targets[0].unavailableReason, undefined);
  assert.match(targets[1].unavailableReason, /not currently available/);
});
