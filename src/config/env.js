const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3000),
  siteUrl: (process.env.SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  egovApiUrl:
    process.env.EGOV_API_URL ||
    'https://data.egov.kz/egov-opendata-ws/ODWebServiceImpl',
  egovApiKey: process.env.EGOV_API_KEY || '',
  requestTimeoutMs: Number(process.env.REQUEST_TIMEOUT_MS || 30000),
  companyPhone: process.env.COMPANY_PHONE || '+77000300024',
  companyEmail: process.env.COMPANY_EMAIL || 'stopnadpis@mail.ru',
  whatsappPhone: process.env.WHATSAPP_PHONE || '77000300024',
};

module.exports = { env };
