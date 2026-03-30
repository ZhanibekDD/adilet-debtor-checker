const express = require('express');
const { validateIin } = require('../lib/validation');
const { checkDebtor } = require('../services/debtorService');

const router = express.Router();

router.post('/check', async (req, res, next) => {
  try {
    const lang = req.body?.lang === 'kz' ? 'kz' : 'ru';
    const validation = validateIin(req.body?.iin);
    if (!validation.valid) {
      return res.status(400).json({ ok: false, error: validation.error });
    }

    const result = await checkDebtor(validation.value, lang);
    return res.json(result);
  } catch (error) {
    return next(error);
  }
});

module.exports = { apiRouter: router };
