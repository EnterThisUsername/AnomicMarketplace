import { initTheme } from './theme.js';
import { initNavigation } from './navigation.js';
import { initScrollToTop } from './scroll.js';
import { initKeyboardShortcuts } from './keyboard.js';
import { initValuesPage } from './values.js';
import { initVhsPage } from './vhs.js';
import { initDiscordsPage } from './discords.js';

function initGlobalComponents() {
  initTheme();
  initNavigation();
  initScrollToTop();
  initKeyboardShortcuts();
  
  // Initialize Lucide Icons globally after initial DOM load
  if (window.lucide) {
    window.lucide.createIcons();
  }
}

function initPageSpecific() {
  const body = document.body;
  const pageId = body.getAttribute('data-page');
  
  switch(pageId) {
    case 'home':
      initHomePage();
      break;
    case 'values':
      initValuesPage();
      break;
    case 'vhs':
      initVhsPage();
      break;
    case 'discords':
      initDiscordsPage();
      break;
  }
}

async function initHomePage() {
  // Dynamic stats loading for homepage
  const totalItemsEl = document.getElementById('stat-total-items');
  if (totalItemsEl) {
    try {
      // We don't need to load the whole dataset just for a count, but for simplicity in a static site:
      const res = await fetch('./data/values/manifest.json');
      const manifest = await res.json();
      totalItemsEl.textContent = manifest.items.length;
    } catch (e) {
      totalItemsEl.textContent = 'Error';
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initGlobalComponents();
  initPageSpecific();
});