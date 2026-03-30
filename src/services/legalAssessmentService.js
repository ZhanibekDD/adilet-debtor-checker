const { legalStatuses } = require('../config/legal');

function legalAssessment(lang, debtorData) {
  if (!debtorData || !debtorData.length) {
    return {
      code: 'clarify',
      label: legalStatuses.clarify[lang],
      note:
        lang === 'kz'
          ? 'Атқарушылық іс жоқ болып көрінеді, бірақ реестр деректерін қосымша тексеру қажет.'
          : 'Исполнительные производства не обнаружены, но по делу может требоваться дополнительная проверка.',
    };
  }

  return {
    code: 'analysis',
    label: legalStatuses.analysis[lang],
    note:
      lang === 'kz'
        ? 'Борыш және шектеу бойынша құқықтық позицияны заңгер жеке бағалайды.'
        : 'Юридическая позиция по долгу и ограничениям определяется после индивидуального анализа документов.',
  };
}

module.exports = { legalAssessment };
