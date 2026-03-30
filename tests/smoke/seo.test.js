const test = require('node:test');
const assert = require('node:assert/strict');
const { app } = require('../../server');

function createServer() {
  return new Promise((resolve) => {
    const server = app.listen(0, () => resolve(server));
  });
}

test('home page has canonical hreflang and schema', async () => {
  const server = await createServer();
  const port = server.address().port;
  const res = await fetch(`http://127.0.0.1:${port}/`);
  const text = await res.text();
  assert.equal(res.status, 200);
  assert.match(text, /rel="canonical"/);
  assert.match(text, /hreflang="ru-KZ"/);
  assert.match(text, /hreflang="kk-KZ"/);
  assert.match(text, /application\/ld\+json/);
  server.close();
});

test('robots and sitemap endpoints are available', async () => {
  const server = await createServer();
  const port = server.address().port;

  const robots = await fetch(`http://127.0.0.1:${port}/robots.txt`);
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap: \/sitemap.xml/);

  const sitemap = await fetch(`http://127.0.0.1:${port}/sitemap.xml`);
  assert.equal(sitemap.status, 200);
  assert.match(await sitemap.text(), /<urlset/);
  server.close();
});
