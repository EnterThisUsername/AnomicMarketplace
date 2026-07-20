import { loadDataset, handleImageError } from './loader.js';
import { CONFIG } from './config.js';
import { escapeHtml } from './utils.js';
import { copyToClipboard } from './clipboard.js';

let vhsData = [];

export async function initVhsPage() {
  const grid = document.getElementById('vhs-grid');
  if (!grid) return;

  try {
    showSkeletons(grid, 6);
    vhsData = await loadDataset(CONFIG.endpoints.vhsManifest, CONFIG.endpoints.vhsPath);
    renderVhs(vhsData);
    initVhsControls();
  } catch (error) {
    grid.innerHTML = `<div class="error-state"><i data-lucide="alert-triangle"></i><p>Failed to load VHS data.</p><button onclick="location.reload()" class="btn btn-secondary">Retry</button></div>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

function initVhsControls() {
  const searchInput = document.getElementById('vhs-search');
  const fpsFilter = document.getElementById('vhs-fps-filter');
  const sortDropdown = document.getElementById('vhs-sort');

  const applyFilters = () => {
    let filtered = [...vhsData];
    
    const query = searchInput.value.toLowerCase().trim();
    if (query) {
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) ||
        (item.description && item.description.toLowerCase().includes(query)) ||
        (item.category && item.category.toLowerCase().includes(query)) ||
        (item.tags && item.tags.join(' ').toLowerCase().includes(query))
      );
    }

    const fps = fpsFilter.value;
    if (fps) {
      filtered = filtered.filter(item => item.fps === parseInt(fps, 10));
    }

    const sort = sortDropdown.value;
    if (sort === 'name-asc') filtered.sort((a, b) => a.name.localeCompare(b.name));
    if (sort === 'name-desc') filtered.sort((a, b) => b.name.localeCompare(a.name));
    if (sort === 'fps-asc') filtered.sort((a, b) => a.fps - b.fps);
    if (sort === 'fps-desc') filtered.sort((a, b) => b.fps - a.fps);

    renderVhs(filtered);
  };

  searchInput.addEventListener('input', applyFilters);
  fpsFilter.addEventListener('change', applyFilters);
  sortDropdown.addEventListener('change', applyFilters);
}

function renderVhs(items) {
  const grid = document.getElementById('vhs-grid');
  grid.innerHTML = '';

  if (!items || items.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i data-lucide="search-x"></i>
        <h3>No animations found</h3>
        <p>Try adjusting your search or filters.</p>
        <button class="btn btn-secondary" onclick="document.getElementById('vhs-search').value=''; document.getElementById('vhs-fps-filter').value=''; document.dispatchEvent(new Event('change'))">Clear Filters</button>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const fragment = document.createDocumentFragment();

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'vhs-card';
    card.innerHTML = `
      <div class="vhs-preview">
        <img src="${escapeHtml(item.preview)}" alt="${escapeHtml(item.name)} preview" loading="lazy" onerror="handleImageError(this)">
        <span class="vhs-fps-badge">${item.fps} FPS</span>
      </div>
      <div class="vhs-content">
        <h3 class="vhs-name">${escapeHtml(item.name)}</h3>
        <p class="vhs-desc">${escapeHtml(item.description || 'No description provided.')}</p>
        <div class="vhs-bulk-id-container">
          <label class="vhs-label">Bulk ID</label>
          <code class="vhs-bulk-id">${escapeHtml(item.bulkId)}</code>
        </div>
        <button class="btn btn-primary btn-block copy-bulk-btn" data-bulk-id="${escapeHtml(item.bulkId)}">
          <i data-lucide="copy"></i> Copy Bulk ID
        </button>
      </div>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  
  // Attach event listeners to copy buttons
  grid.querySelectorAll('.copy-bulk-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const bulkId = e.currentTarget.getAttribute('data-bulk-id');
      copyToClipboard(bulkId, 'Bulk ID copied!');
      
      // Visual feedback
      const originalHTML = e.currentTarget.innerHTML;
      e.currentTarget.classList.add('btn-success');
      e.currentTarget.innerHTML = `<i data-lucide="check"></i> Copied!`;
      if (window.lucide) window.lucide.createIcons({ nodes: [e.currentTarget] });
      
      setTimeout(() => {
        e.currentTarget.classList.remove('btn-success');
        e.currentTarget.innerHTML = originalHTML;
        if (window.lucide) window.lucide.createIcons({ nodes: [e.currentTarget] });
      }, 2000);
    });
  });

  if (window.lucide) window.lucide.createIcons();
}

function showSkeletons(container, count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-button"></div>
      </div>
    `;
  }
  container.innerHTML = html;
}

// Expose for onerror inline handler
window.handleImageError = handleImageError;