const { env } = require('../config/env');

function absoluteUrl(pathname) {
  return `${env.siteUrl}${pathname === '/' ? '' : pathname}`;
}

function buildAlternates(pathByLang) {
  return Object.entries(pathByLang).map(([lang, path]) => ({
    lang: lang === 'kz' ? 'kk-KZ' : 'ru-KZ',
    href: absoluteUrl(path),
  }));
}

function buildMeta({ title, description, path, type = 'website', alternates = [] }) {
  const canonical = absoluteUrl(path);
  return {
    title,
    description,
    canonical,
    robots: 'index,follow',
    og: { title, description, url: canonical, type },
    twitter: { card: 'summary_large_image', title, description },
    alternates,
  };
}

module.exports = { absoluteUrl, buildAlternates, buildMeta };
