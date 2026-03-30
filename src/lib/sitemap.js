const { absoluteUrl } = require('./seo');

function buildSitemapXml(paths) {
  const urls = paths
    .map(
      (path) => `<url><loc>${absoluteUrl(path)}</loc><changefreq>weekly</changefreq><priority>${path === '/' ? '1.0' : '0.7'}</priority></url>`,
    )
    .join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`;
}

module.exports = { buildSitemapXml };
