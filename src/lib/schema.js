const { absoluteUrl } = require('./seo');
const { siteConfig } = require('../config/site');

function orgSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: siteConfig.brand,
    url: absoluteUrl('/'),
    telephone: siteConfig.phoneDisplay,
    email: siteConfig.email,
    areaServed: 'KZ',
  };
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: absoluteUrl(item.href),
    })),
  };
}

function faqSchema(faqItems) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}

module.exports = { orgSchema, breadcrumbSchema, faqSchema };
