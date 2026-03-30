const { env } = require('./env');

const siteConfig = {
  brand: 'StopNadpis',
  legalName: 'StopNadpis Legal Tech',
  phoneDisplay: '+7 (700) 030-00-24',
  phoneHref: `tel:${env.companyPhone}`,
  email: env.companyEmail,
  whatsappHref: `https://wa.me/${env.whatsappPhone}`,
  address: 'Казахстан, онлайн-консультации по РК',
};

module.exports = { siteConfig };
