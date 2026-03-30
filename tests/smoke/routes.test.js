const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../../server');

const routes = ['/', '/services', '/contact', '/kz', '/kz/services', '/kz/contact', '/faq', '/kz/faq'];

function createServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('core routes respond and contain visible content', async () => {
  const server = await createServer();
  const port = server.address().port;

  for (const route of routes) {
    const res = await fetch(`http://127.0.0.1:${port}${route}`);
    const text = await res.text();
    assert.equal(res.status, 200, route);
    assert.match(text, /<main>/);
    assert.doesNotMatch(text, /<main>\s*<\/main>/);
  }

  server.close();
});
