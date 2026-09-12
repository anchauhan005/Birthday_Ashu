(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  window.ACCESSIBILITY = {
    reducedMotion: () => reduced.matches,
    announce(message) {
      const el = document.getElementById('srAnnouncer');
      if (!el) return;
      el.textContent = '';
      requestAnimationFrame(() => { el.textContent = message; });
    }
  };

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.body.dispatchEvent(new CustomEvent('birthday:escape'));
    }
  });
})();
