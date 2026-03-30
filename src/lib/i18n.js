const map = {
  ru: 'ru-KZ',
  kz: 'kk-KZ',
};

function localeByLang(lang) {
  return map[lang] || map.ru;
}

function alternateLang(lang) {
  return lang === 'kz' ? 'ru' : 'kz';
}

module.exports = { localeByLang, alternateLang };
