function esc(text = '') {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLayout({ lang, title, description, canonical, alternates, content, schema = [], nav, currentPath, altPath }) {
  const navHtml = nav
    .map((item) => `<a class="${item.href === currentPath ? 'active' : ''}" href="${item.href}">${esc(item.label)}</a>`)
    .join('');
  const altHtml = alternates
    .map((alt) => `<link rel="alternate" hreflang="${alt.lang}" href="${alt.href}" />`)
    .join('');
  const schemaHtml = schema
    .map((item) => `<script type="application/ld+json">${JSON.stringify(item)}</script>`)
    .join('');

  return `<!doctype html>
<html lang="${lang === 'kz' ? 'kk' : 'ru'}">
<head>
<meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
<meta name="robots" content="index,follow" />
<link rel="canonical" href="${canonical}" />${altHtml}
<meta property="og:type" content="website" /><meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" /><meta property="og:url" content="${canonical}" />
<meta name="twitter:card" content="summary_large_image" /><meta name="twitter:title" content="${esc(title)}" />
<meta name="twitter:description" content="${esc(description)}" />
<link rel="stylesheet" href="/css/base.css" /><link rel="stylesheet" href="/css/components.css" />
<link rel="stylesheet" href="/css/pages.css" /><link rel="stylesheet" href="/css/utilities.css" />
</head>
<body>
<header class="site-header"><div class="container nav-row"><a href="${lang === 'kz' ? '/kz' : '/'}" class="logo">StopNadpis</a><button class="menu-btn" data-nav-toggle aria-expanded="false">☰</button><nav data-nav-links>${navHtml}</nav><a class="lang" href="${altPath}">${lang === 'kz' ? 'RU' : 'KZ'}</a></div></header>
<main>${content}</main>
<footer class="site-footer"><div class="container"><p>© <span class="current-year"></span> StopNadpis</p><p>${lang === 'kz' ? 'Құқықтық бағалау қажет.' : 'Требуется юридическая оценка.'}</p></div></footer>
${schemaHtml}
<script src="/js/site.js" defer></script><script src="/js/checker.js" defer></script>
</body></html>`;
}

module.exports = { renderLayout, esc };
