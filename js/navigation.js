export function initNavigation() {
  const mobileMenuBtn = document.getElementById('mobile-menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const navbar = document.getElementById('main-nav');

  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('active');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      const iconName = isOpen ? 'x' : 'menu';
      mobileMenuBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
      if (window.lucide) window.lucide.createIcons({ nodes: [mobileMenuBtn] });
    });
  }

  // Navbar shrink on scroll
  if (navbar) {
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;
      if (currentScroll > 50) {
        navbar.classList.add('nav-scrolled');
      } else {
        navbar.classList.remove('nav-scrolled');
      }
      lastScroll = currentScroll;
    }, { passive: true });
  }
}