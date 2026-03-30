const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const script = fs.readFileSync(path.join(__dirname, '../../public/js/site.js'), 'utf8');

test('site.js does not throw if nav elements are absent', () => {
  const listeners = {};
  const document = {
    querySelector: () => null,
    querySelectorAll: () => [],
    addEventListener: (event, cb) => { listeners[event] = cb; },
    body: { classList: { toggle: () => false, remove: () => {} } },
  };
  const sandbox = { document, Date };
  vm.createContext(sandbox);
  assert.doesNotThrow(() => vm.runInContext(script, sandbox));
  assert.doesNotThrow(() => listeners.DOMContentLoaded && listeners.DOMContentLoaded());
});
