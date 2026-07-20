import { loadDataset, handleImageError } from './loader.js';
import { CONFIG } from './config.js';
import { escapeHtml, formatNumber, getRelativeTime } from './utils.js';
import { sortData } from './sorting.js';
import { filterData, getUniqueValues } from './filtering.js';
import { SORT_OPTIONS } from './constants.js';

let valuesData = [];
let currentLayout = localStorage.getItem(CONFIG.layouts.storageKey) || 'grid';
let currentFilters = {};
let currentSort = SORT_OPTIONS.UPDATED_DESC;

export async function initValuesPage() {
  const grid = document.getElementById('values-grid');
  if (!grid) return;

  try {
    showSkeletons(grid, 8);
    valuesData = await loadDataset(CONFIG.endpoints.valuesManifest, CONFIG.endpoints.valuesPath);
    
    populateFilterDropdowns();
    initControls();
    applyAndRender();
  } catch (error) {
    grid.innerHTML = `<div class="error-state"><i data-lucide="alert-triangle"></i><p>Failed to load marketplace data.</p><button onclick="location.reload()" class="btn btn-secondary">Retry</button></div>`;
    if (window.lucide) window.lucide.createIcons();
  }
}

function initControls() {
  const searchInput = document.getElementById('page-search');
  const sortDropdown = document.getElementById('sort-dropdown');
  const layoutToggle = document.getElementById('layout-toggle');
  const filterCheckboxes = document.querySelectorAll('.filter-checkbox');
  const minValueInput = document.getElementById('filter-min-value');
  const maxValueInput = document.getElementById('filter-max-value');
  const clearFiltersBtn = document.getElementById('clear-filters');

  // Layout setup
  updateLayoutIcon();

  // Search
  searchInput.addEventListener('input', debounceApply());

  // Sorting
  sortDropdown.addEventListener('change', (e) => {
    currentSort = e.target.value;
    applyAndRender();
  });

  // Layout Toggle
  layoutToggle.addEventListener('click', () => {
    currentLayout = currentLayout === 'grid' ? 'table' : 'grid';
    localStorage.setItem(CONFIG.layouts.storageKey, currentLayout);
    updateLayoutIcon();
    applyAndRender();
  });

  // Filters
  filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const type = checkbox.getAttribute('data-filter-type');
      const value = checkbox.getAttribute('data-filter-value');
      
      if (!currentFilters[type]) currentFilters[type] = [];
      
      if (checkbox.checked) {
        currentFilters[type].push(value);
      } else {
        currentFilters[type] = currentFilters[type].filter(v => v !== value);
      }
      applyAndRender();
    });
  });

  // Value Range
  [minValueInput, maxValueInput].forEach(input => {
    input.addEventListener('input', debounceApply());
  });

  // Clear Filters
  clearFiltersBtn.addEventListener('click', () => {
    currentFilters = {};
    filterCheckboxes.forEach(cb => cb.checked = false);
    minValueInput.value = '';
    maxValueInput.value = '';
    searchInput.value = '';
    applyAndRender();
  });
}

function updateLayoutIcon() {
  const layoutToggle = document.getElementById('layout-toggle');
  const iconName = currentLayout === 'grid' ? 'list' : 'layout-grid';
  layoutToggle.innerHTML = `<i data-lucide="${iconName}"></i>`;
  layoutToggle.setAttribute('aria-label', `Switch to ${currentLayout === 'grid' ? 'table' : 'grid'} view`);
  if (window.lucide) window.lucide.createIcons({ nodes: [layoutToggle] });
}

function applyAndRender() {
  const searchInput = document.getElementById('page-search');
  const query = searchInput.value.toLowerCase().trim();
  
  let processed = [...valuesData];

  // 1. Search
  if (query) {
    const terms = query.split(/\s+/);
    processed = processed.filter(item => 
      terms.every(term => 
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term) ||
        item.event.toLowerCase().includes(term) ||
        item.rarity.toLowerCase().includes(term) ||
        item.prediction.toLowerCase().includes(term) ||
        (item.description && item.description.toLowerCase().includes(term))
      )
    );
  }

  // 2. Filters
  if (currentFilters.event && currentFilters.event.length > 0) processed = processed.filter(i => currentFilters.event.includes(i.event));
  if (currentFilters.category && currentFilters.category.length > 0) processed = processed.filter(i => currentFilters.category.includes(i.category));
  if (currentFilters.demand && currentFilters.demand.length > 0) processed = processed.filter(i => currentFilters.demand.includes(i.demand));
  if (currentFilters.prediction && currentFilters.prediction.length > 0) processed = processed.filter(i => currentFilters.prediction.includes(i.prediction));
  if (currentFilters.rarity && currentFilters.rarity.length > 0) processed = processed.filter(i => currentFilters.rarity.includes(i.rarity));
  
  const minVal = document.getElementById('filter-min-value').value;
  const maxVal = document.getElementById('filter-max-value').value;
  if (minVal) processed = processed.filter(i => i.value >= parseInt(minVal, 10));
  if (maxVal) processed = processed.filter(i => i.value <= parseInt(maxVal, 10));

  // 3. Sort
  processed = sortData(processed, currentSort);

  // 4. Render
  renderItems(processed);
  
  // 5. Update Count
  document.getElementById('results-count').textContent = `${processed.length} Items`;
}

function renderItems(items) {
  const container = document.getElementById('values-grid');
  container.className = currentLayout === 'grid' ? 'values-grid' : 'values-table-container';
  container.innerHTML = '';

  if (!items || items.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <i data-lucide="search-x"></i>
        <h3>No items match your search</h3>
        <p>Try adjusting your search terms or clearing filters.</p>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  if (currentLayout === 'grid') {
    renderGrid(container, items);
  } else {
    renderTable(container, items);
  }
  
  if (window.lucide) window.lucide.createIcons();
}

function renderGrid(container, items) {
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'value-card';
    
    const isRecent = isRecentlyUpdated(item.lastUpdated);
    const demandClass = `demand-${item.demand.toLowerCase().replace(' ', '-')}`;
    
    card.innerHTML = `
      <div class="card-image-container">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="handleImageError(this)">
        ${isRecent ? '<span class="badge badge-new"><i data-lucide="sparkles"></i> Recently Updated</span>' : ''}
        <span class="badge badge-rarity">${escapeHtml(item.rarity)}</span>
      </div>
      <div class="card-content">
        <h3 class="card-title">${escapeHtml(item.name)}</h3>
        <p class="card-value">${formatNumber(item.value)}</p>
        <div class="card-meta">
          <span class="badge ${demandClass}"><i data-lucide="trending-up"></i> ${escapeHtml(item.demand)}</span>
          <span class="badge badge-prediction">${escapeHtml(item.prediction)}</span>
        </div>
        <div class="card-footer">
          <span class="card-info"><i data-lucide="tag"></i> ${escapeHtml(item.category)}</span>
          <span class="card-info"><i data-lucide="calendar"></i> ${escapeHtml(item.event)}</span>
        </div>
        <time class="card-updated" datetime="${escapeHtml(item.lastUpdated)}">Updated ${getRelativeTime(item.lastUpdated)}</time>
      </div>
    `;
    fragment.appendChild(card);
  });
  
  container.appendChild(fragment);
}

function renderTable(container, items) {
  const table = document.createElement('table');
  table.className = 'values-table';
  
  table.innerHTML = `
    <thead>
      <tr>
        <th>Item</th>
        <th>Value</th>
        <th>Demand</th>
        <th>Prediction</th>
        <th>Category</th>
        <th>Event</th>
        <th>Last Updated</th>
      </tr>
    </thead>
    <tbody></tbody>
  `;
  
  const tbody = table.querySelector('tbody');
  const fragment = document.createDocumentFragment();
  
  items.forEach(item => {
    const tr = document.createElement('tr');
    const demandClass = `demand-${item.demand.toLowerCase().replace(' ', '-')}`;
    
    tr.innerHTML = `
      <td data-label="Item">
        <div class="table-item-name">
          <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}" loading="lazy" onerror="handleImageError(this)" class="table-thumb">
          <span>${escapeHtml(item.name)}</span>
        </div>
      </td>
      <td data-label="Value" class="table-value">${formatNumber(item.value)}</td>
      <td data-label="Demand"><span class="badge ${demandClass}">${escapeHtml(item.demand)}</span></td>
      <td data-label="Prediction"><span class="badge badge-prediction">${escapeHtml(item.prediction)}</span></td>
      <td data-label="Category">${escapeHtml(item.category)}</td>
      <td data-label="Event">${escapeHtml(item.event)}</td>
      <td data-label="Last Updated"><time datetime="${escapeHtml(item.lastUpdated)}">${getRelativeTime(item.lastUpdated)}</time></td>
    `;
    fragment.appendChild(tr);
  });
  
  tbody.appendChild(fragment);
  container.appendChild(table);
}

function populateFilterDropdowns() {
  const populate = (key, containerId) => {
    const container = document.getElementById(containerId);
    if (!container) return;
    const values = getUniqueValues(valuesData, key).sort();
    container.innerHTML = '';
    
    values.forEach(value => {
      const id = `filter-${key}-${value.toLowerCase().replace(/\s+/g, '-')}`;
      const div = document.createElement('div');
      div.className = 'filter-option';
      div.innerHTML = `
        <input type="checkbox" id="${id}" class="filter-checkbox" data-filter-type="${key}" data-filter-value="${escapeHtml(value)}">
        <label for="${id}">${escapeHtml(value)}</label>
      `;
      container.appendChild(div);
    });
  };
  
  populate('category', 'filter-categories');
  populate('event', 'filter-events');
  populate('demand', 'filter-demands');
  populate('prediction', 'filter-predictions');
  populate('rarity', 'filter-rarities');
}

function showSkeletons(container, count) {
  let html = '';
  for (let i = 0; i < count; i++) {
    html += `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton skeleton-line"></div>
        <div class="skeleton skeleton-line short"></div>
        <div class="skeleton skeleton-line"></div>
      </div>
    `;
  }
  container.innerHTML = html;
}

function isRecentlyUpdated(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now - date);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays <= CONFIG.updates.recentThresholdDays;
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function debounceApply() {
  return debounce(() => applyAndRender(), 150);
}

// Expose for onerror inline handler
window.handleImageError = handleImageError;