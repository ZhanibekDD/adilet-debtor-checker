# StopNadpis — Kazakhstan-first debtor/legal check service (RU/KZ)

## Что делает проект
StopNadpis — двуязычный (RU/KZ) юридический сервис для:
- проверки сведений о долгах и исполнительных производствах по ИИН/ЖСН,
- первичной оценки риска ареста/ограничений,
- перевода пользователя в консультацию юриста через WhatsApp/телефон,
- прозрачной и нейтральной правовой коммуникации без ложных гарантий.

## Архитектура
- `server.js`: Express-приложение, рендер страниц, robots/sitemap.
- `src/config`: env, конфиг сайта, правовые нейтральные статусы.
- `src/services`: интеграция с eGov SOAP + слой бизнес-логики.
- `src/routes`: страницы и API.
- `src/lib`: SEO utilities, schema, sitemap, validation, logging.
- `src/content`: RU/KZ контент + страницы услуг/правовые страницы.
- `src/views`: Nunjucks шаблоны.
- `public`: CSS/JS (progressive enhancement, fail-open).
- `tests/smoke`: route/frontend/seo smoke tests.

## Запуск
```bash
npm install
cp .env.example .env
npm run dev
```

Production:
```bash
npm start
```

## ENV-переменные
См. `.env.example`.
Критично:
- `EGOV_API_KEY` — ключ SOAP API (не хранить в репозитории).
- `SITE_URL` — нужен для canonical/hreflang/sitemap.

## SEO engine
Реализовано:
- уникальные title/description на ключевых страницах,
- canonical,
- hreflang (ru-KZ / kk-KZ),
- OpenGraph/Twitter meta,
- JSON-LD (LegalService, FAQ/Breadcrumb где нужно),
- `robots.txt`, `sitemap.xml`.

## Локализация
- Параллельные маршруты `/...` и `/kz/...`.
- Переключатель языка сохраняет семантический маршрут.
- Локализованные метаданные и контент из `src/content/{ru,kz}`.

## Тестирование
```bash
npm test
```
Покрывает:
- smoke по core routes,
- проверки SEO тегов, sitemap/robots,
- fail-open поведение фронтенд-скрипта.

## Безопасность
- Секреты вынесены в env.
- Валидация ИИН централизована.
- Ошибки API унифицированы.
- Юридические статусы отображаются нейтрально: требуется анализ/уточнение.

## Деплой
1. Задать `SITE_URL`, `EGOV_API_KEY`.
2. Запустить `npm ci && npm start`.
3. Проверить `/robots.txt`, `/sitemap.xml`, `/check`.
