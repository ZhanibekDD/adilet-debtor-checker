const { requestDebtorData } = require('./egovSoapService');
const { getRestrictions } = require('./restrictionService');
const { legalAssessment } = require('./legalAssessmentService');

function normalizeRows(rows) {
  if (!rows) return [];
  return Array.isArray(rows) ? rows : [rows];
}

async function checkDebtor(iin, lang = 'ru') {
  const debtorResponse = await requestDebtorData(iin);
  const debtors = normalizeRows(debtorResponse.rows);
  const restrictions = await getRestrictions(iin);

  return {
    ok: true,
    source: debtorResponse.source,
    statusMessage: debtorResponse.rawStatus,
    debtors,
    restrictions,
    legal: legalAssessment(lang, debtors),
  };
}

module.exports = { checkDebtor };
