import { debounce } from './utils.js';

export function initSearch(dataset, renderCallback) {
  const searchInput = document.getElementById('page-search');
  if (!searchInput) return;

  const handleInput = debounce((e) => {
    const query = e.target.value.toLowerCase().trim();
    if (!query) {
      renderCallback(dataset);
      return;
    }
    
    const terms = query.split(/\s+/);
    const results = dataset.filter(item => {
      return terms.every(term => {
        return Object.values(item).some(value => {
          if (typeof value === 'string') {
            return value.toLowerCase().includes(term);
          }
          if (typeof value === 'number') {
            return value.toString().includes(term);
          }
          return false;
        });
      });
    });
    
    renderCallback(results);
  }, 150);

  searchInput.addEventListener('input', handleInput);
}