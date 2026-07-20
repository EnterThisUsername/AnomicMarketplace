export function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+K or Cmd+K for global search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      const searchInput = document.getElementById('global-search') || document.getElementById('page-search');
      if (searchInput) {
        searchInput.focus();
        searchInput.select();
      }
    }

    // Escape to close mobile menu or dialogs
    if (e.key === 'Escape') {
      const mobileNav = document.getElementById('mobile-nav');
      if (mobileNav && mobileNav.classList.contains('active')) {
        const toggleBtn = document.getElementById('mobile-menu-toggle');
        if (toggleBtn) toggleBtn.click();
      }
    }
  });
}