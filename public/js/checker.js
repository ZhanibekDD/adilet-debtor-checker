(() => {
  function byId(id) { return document.getElementById(id); }

  async function onSubmit(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const lang = form?.dataset?.lang === 'kz' ? 'kz' : 'ru';

    const iinInput = byId('iin');
    const iinValidation = byId('iin-validation');
    const loading = byId('loading-container');
    const results = byId('results');
    const errorBox = byId('error-message');
    const errorText = byId('error-text');
    const output = byId('results-json');

    if (!iinInput) return;
    const iin = (iinInput.value || '').replace(/\D/g, '');
    if (!/^\d{12}$/.test(iin)) {
      if (iinValidation) {
        iinValidation.classList.remove('hidden');
        iinValidation.textContent = lang === 'kz' ? 'ЖСН 12 сан болуы керек' : 'ИИН должен содержать 12 цифр';
      }
      return;
    }

    iinValidation?.classList.add('hidden');
    errorBox?.classList.add('hidden');
    results?.classList.add('hidden');
    loading?.classList.remove('hidden');

    try {
      const response = await fetch('/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ iin, lang }),
      });
      const data = await response.json();
      if (!response.ok || !data.ok) {
        throw new Error(data.error || 'Request failed');
      }
      if (output) output.textContent = JSON.stringify(data, null, 2);
      results?.classList.remove('hidden');
    } catch (error) {
      if (errorBox && errorText) {
        errorText.textContent = error.message;
        errorBox.classList.remove('hidden');
      }
    } finally {
      loading?.classList.add('hidden');
    }
  }

  document.addEventListener('DOMContentLoaded', () => {
    const form = byId('search-form');
    if (form) form.addEventListener('submit', onSubmit);
  });
})();
