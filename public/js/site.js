(() => {
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.current-year').forEach((node) => { node.textContent = new Date().getFullYear(); });

    const toggle = document.querySelector('[data-nav-toggle]');
    const navLinks = document.querySelector('[data-nav-links]');
    if (toggle && navLinks) {
      toggle.addEventListener('click', () => {
        const isOpen = document.body.classList.toggle('nav-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      navLinks.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
          document.body.classList.remove('nav-open');
          toggle.setAttribute('aria-expanded', 'false');
        });
      });
    }
  });
})();
