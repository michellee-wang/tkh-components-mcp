(() => {
  document.querySelectorAll('.tkh-header').forEach((h) => {
    const b = h.querySelector('.tkh-burger');
    if (b) b.addEventListener('click', () => {
      const open = h.classList.toggle('is-open');
      b.setAttribute('aria-expanded', String(open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
  });
})();
