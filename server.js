const express = require('express');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const cors = require('cors');

const { env } = require('./src/config/env');
const { pagesRouter } = require('./src/routes/pages');
const { apiRouter } = require('./src/routes/api');
const { requestContext } = require('./src/middleware/requestContext');
const { errorHandler, notFound } = require('./src/middleware/errorHandler');
const { buildSitemapXml } = require('./src/lib/sitemap');

const app = express();
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(requestContext);
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use('/js', express.static(path.join(__dirname, 'public/js')));

app.get('/robots.txt', (_req, res) => {
  res.type('text/plain').send('User-agent: *\nAllow: /\nSitemap: /sitemap.xml');
});

app.get('/sitemap.xml', (_req, res) => {
  const routes = ['/', '/services', '/contact', '/faq', '/privacy-policy', '/disclaimer', '/services/proverka-dolgov-po-iin', '/services/proverka-aresta-scheta', '/services/vozrazhenie-na-ispolnitelnuyu-nadpis', '/services/snyatie-aresta-so-scheta', '/services/konsultaciya', '/kz', '/kz/services', '/kz/contact', '/kz/faq', '/kz/privacy-policy', '/kz/disclaimer', '/kz/services/proverka-dolgov-po-iin', '/kz/services/proverka-aresta-scheta', '/kz/services/vozrazhenie-na-ispolnitelnuyu-nadpis', '/kz/services/snyatie-aresta-so-scheta', '/kz/services/konsultaciya'];
  res.type('application/xml').send(buildSitemapXml(routes));
});

app.use(apiRouter);
app.use(pagesRouter);
app.use(notFound);
app.use(errorHandler);

if (require.main === module) {
  app.listen(env.port, () => console.log(`Server running on http://localhost:${env.port}`));
}

module.exports = { app };
