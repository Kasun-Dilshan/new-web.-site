'use strict';

(function initDetailsLoader() {
  const loader = document.getElementById('details-loader');
  if (!loader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.remove('show');
      loader.setAttribute('aria-hidden', 'true');
    }, 650);
  });
})();
