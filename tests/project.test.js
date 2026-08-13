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
  assert.equal(manifest.contributes.commands[0].command, 'wayfinder.helloWorld');
});

test('the TypeScript extension entry point is compiled', () => {
  assert.equal(fs.existsSync(path.join(projectRoot, 'out', 'extension.js')), true);
});
