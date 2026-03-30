const express = require('express');
const fs = require('fs');
const path = require('path');
const { buildAlternates, buildMeta } = require('../lib/seo');
const { orgSchema, faqSchema } = require('../lib/schema');
const { renderLayout, esc } = require('../lib/render');

const router = express.Router();

const slugs = ['proverka-dolgov-po-iin', 'proverka-aresta-scheta', 'vozrazhenie-na-ispolnitelnuyu-nadpis', 'snyatie-aresta-so-scheta', 'konsultaciya'];

function readJson(relativePath) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8'));
}

function base(lang, currentPath) {
  return {
    lang,
    currentPath,
    altPath: lang === 'kz' ? currentPath.replace(/^\/kz/, '') || '/' : `/kz${currentPath === '/' ? '' : currentPath}`,
    nav: [
      { label: lang === 'kz' ? 'Басты бет' : 'Главная', href: lang === 'kz' ? '/kz' : '/' },
      { label: lang === 'kz' ? 'Қызметтер' : 'Услуги', href: lang === 'kz' ? '/kz/services' : '/services' },
      { label: lang === 'kz' ? 'Байланыс' : 'Контакты', href: lang === 'kz' ? '/kz/contact' : '/contact' },
      { label: 'FAQ', href: lang === 'kz' ? '/kz/faq' : '/faq' },
    ],
  };
}

function send(res, lang, currentPath, title, description, content, schema = []) {
  const altPath = lang === 'kz' ? currentPath.replace(/^\/kz/, '') || '/' : `/kz${currentPath === '/' ? '' : currentPath}`;
  const meta = buildMeta({
    title,
    description,
    path: currentPath,
    alternates: buildAlternates({ [lang]: currentPath, [lang === 'kz' ? 'ru' : 'kz']: altPath }),
  });
  res.send(renderLayout({ ...base(lang, currentPath), title: meta.title, description: meta.description, canonical: meta.canonical, alternates: meta.alternates, content, schema }));
}

function langRoutes(lang, prefix) {
  const faq = readJson(`content/${lang}/faq.json`);
  const home = readJson(`content/${lang}/home.json`);
  const services = readJson(`content/${lang}/services.json`);

  router.get(prefix || '/', (_req, res) => {
    const servicesHtml = services.map((s) => `<article class="card"><h3><a href="${prefix}/services/${s.slug}">${esc(s.title)}</a></h3><p>${esc(s.excerpt)}</p></article>`).join('');
    const content = `<section class="hero container"><h1>${esc(home.heroTitle)}</h1><p>${esc(home.heroLead)}</p><div class="cta-row"><a class="btn" href="#checker">${esc(home.ctaPrimary)}</a><a class="btn btn-secondary" href="${prefix}/contact">${esc(home.ctaSecondary)}</a></div></section>
<section id="checker" class="container card"><h2>${lang === 'kz' ? 'ЖСН/ИИН тексеруі' : 'Проверка по ИИН/ЖСН'}</h2><form id="search-form" data-lang="${lang}"><label for="iin">${lang === 'kz' ? 'ЖСН немесе ИИН (12 сан)' : 'ИИН или ЖСН (12 цифр)'}</label><input id="iin" name="iin" maxlength="12" inputmode="numeric" required /><button id="search-button" type="submit" class="btn">${lang === 'kz' ? 'Тексеру' : 'Проверить'}</button><p id="iin-validation" class="hidden"></p></form><div id="loading-container" class="hidden">...</div><div id="error-message" class="hidden"><span id="error-text"></span></div><div id="results" class="hidden"><pre id="results-json"></pre></div></section>
<section class="container grid">${servicesHtml}</section>`;
    send(res, lang, prefix || '/', lang === 'kz' ? 'StopNadpis — ЖСН бойынша тексеру' : 'StopNadpis — Проверка по ИИН', home.heroLead, content, [orgSchema(), faqSchema(faq)]);
  });

  router.get(`${prefix}/services`, (_req, res) => {
    const content = `<section class="container"><h1>${lang === 'kz' ? 'Қызметтер' : 'Услуги'}</h1></section><section class="container grid">${services.map((s) => `<article class="card"><h2><a href="${prefix}/services/${s.slug}">${esc(s.title)}</a></h2><p>${esc(s.excerpt)}</p></article>`).join('')}</section>`;
    send(res, lang, `${prefix}/services`, lang === 'kz' ? 'Қызметтер — StopNadpis' : 'Услуги — StopNadpis', 'Services', content, [orgSchema()]);
  });

  slugs.forEach((slug) => {
    router.get(`${prefix}/services/${slug}`, (_req, res) => {
      const page = readJson(`content/${lang}/pages/${slug}.json`);
      const t = lang === 'kz' ? page.kzTitle : page.title;
      const d = lang === 'kz' ? page.kzDescription : page.description;
      const content = `<section class="container"><h1>${esc(t)}</h1><p>${esc(d)}</p><ul>${page.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul><p class="note">${lang === 'kz' ? 'Құқықтық бағалау қажет' : 'Требуется юридическая оценка'}</p></section>`;
      send(res, lang, `${prefix}/services/${slug}`, `${t} — StopNadpis`, d, content, [orgSchema()]);
    });
  });

  router.get(`${prefix}/faq`, (_req, res) => {
    const content = `<section class="container"><h1>FAQ</h1>${faq.map((f) => `<article class="card"><h2>${esc(f.q)}</h2><p>${esc(f.a)}</p></article>`).join('')}</section>`;
    send(res, lang, `${prefix}/faq`, 'FAQ — StopNadpis', 'FAQ', content, [orgSchema(), faqSchema(faq)]);
  });

  router.get(`${prefix}/contact`, (_req, res) => {
    const content = `<section class="container"><h1>${lang === 'kz' ? 'Байланыс' : 'Контакты'}</h1><div class="card"><a href="tel:+77000300024">+7 (700) 030-00-24</a><br /><a href="https://wa.me/77000300024">WhatsApp</a></div></section>`;
    send(res, lang, `${prefix}/contact`, lang === 'kz' ? 'Байланыс — StopNadpis' : 'Контакты — StopNadpis', 'Contacts', content, [orgSchema()]);
  });

  ['privacy-policy', 'disclaimer'].forEach((slug) => {
    router.get(`${prefix}/${slug}`, (_req, res) => {
      const page = readJson(`content/${lang}/pages/${slug}.json`);
      const t = lang === 'kz' ? page.kzTitle : page.title;
      const d = lang === 'kz' ? page.kzDescription : page.description;
      const content = `<section class="container"><h1>${esc(t)}</h1><p>${esc(d)}</p><ul>${page.bullets.map((b) => `<li>${esc(b)}</li>`).join('')}</ul></section>`;
      send(res, lang, `${prefix}/${slug}`, `${t} — StopNadpis`, d, content, [orgSchema()]);
    });
  });
}

langRoutes('ru', '');
langRoutes('kz', '/kz');

module.exports = { pagesRouter: router };
