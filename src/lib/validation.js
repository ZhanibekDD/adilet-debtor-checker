function normalizeIin(iin) {
  return String(iin || '').replace(/\D/g, '');
}

function validateIin(iin) {
  const normalized = normalizeIin(iin);
  if (!/^\d{12}$/.test(normalized)) {
    return { valid: false, error: 'ИИН/ЖСН должен содержать 12 цифр.' };
  }
  return { valid: true, value: normalized };
}

module.exports = { validateIin, normalizeIin };
