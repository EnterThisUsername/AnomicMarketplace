import { DISCORD_SERVERS } from './config.js';
import { escapeHtml } from './utils.js';

export function initDiscordsPage() {
  const grid = document.getElementById('discord-grid');
  if (!grid) return;

  renderDiscords(DISCORD_SERVERS);
}

function renderDiscords(servers) {
  const grid = document.getElementById('discord-grid');
  grid.innerHTML = '';

  if (servers.length === 0) {
    grid.innerHTML = `<p class="empty-state">No Discord servers available at the moment.</p>`;
    return;
  }

  const fragment = document.createDocumentFragment();

  servers.forEach(server => {
    const card = document.createElement('article');
    card.className = 'discord-card';
    
    const verifiedBadge = server.verified 
      ? `<span class="badge badge-verified" title="Official Server"><i data-lucide="badge-check"></i> Verified</span>` 
      : '';

    card.innerHTML = `
      <div class="discord-card-header">
        <img src="${escapeHtml(server.icon)}" alt="${escapeHtml(server.name)} icon" class="discord-icon" loading="lazy">
        <div class="discord-info">
          <h3 class="discord-name">${escapeHtml(server.name)}</h3>
          ${verifiedBadge}
        </div>
      </div>
      <p class="discord-description">${escapeHtml(server.description)}</p>
      <div class="discord-stats">
        <span class="stat"><i data-lucide="users"></i> ${escapeHtml(server.members)} members</span>
      </div>
      <a href="${escapeHtml(server.invite)}" target="_blank" rel="noopener noreferrer" class="btn btn-primary btn-block">
        <i data-lucide="log-in"></i> Join Server
      </a>
    `;
    fragment.appendChild(card);
  });

  grid.appendChild(fragment);
  if (window.lucide) window.lucide.createIcons();
}