import { CONFIG } from './config.js';

export function initTheme() {
  const storedTheme = localStorage.getItem(CONFIG.theme.storageKey);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = storedTheme || (prefersDark ? 'dark' : CONFIG.theme.default);
  
  applyTheme(theme);
  
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      applyTheme(newTheme);
      localStorage.setItem(CONFIG.theme.storageKey, newTheme);
    });
  }
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const iconName = theme === 'dark' ? 'moon' : 'sun';
    toggleBtn.innerHTML = `<i data-lucide="${iconName}"></i>`;
    if (window.lucide) {
      window.lucide.createIcons({ nodes: [toggleBtn] });
    }
  }
}