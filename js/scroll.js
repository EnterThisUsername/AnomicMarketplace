export function initScrollToTop() {
  const backToTopBtn = document.getElementById('back-to-top');
  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 400) {
      backToTopBtn.classList.add('visible');
      backToTopBtn.setAttribute('aria-hidden', 'false');
    } else {
      backToTopBtn.classList.remove('visible');
      backToTopBtn.setAttribute('aria-hidden', 'true');
    }
  }, { passive: true });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}