import { escapeHtml } from './utils.js';

let toastContainer;

function initContainer() {
  if (!toastContainer) {
    toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
      toastContainer = document.createElement('div');
      toastContainer.id = 'toast-container';
      toastContainer.className = 'toast-container';
      document.body.appendChild(toastContainer);
    }
  }
}

export function showToast(message, type = 'info', duration = 3000) {
  initContainer();
  
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'alert');
  
  const iconMap = {
    success: 'check-circle',
    error: 'alert-circle',
    info: 'info',
    warning: 'alert-triangle'
  };
  
  const iconName = iconMap[type] || 'info';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}" class="toast-icon"></i>
    <span class="toast-message">${escapeHtml(message)}</span>
    <button class="toast-close" aria-label="Close notification">
      <i data-lucide="x"></i>
    </button>
  `;
  
  toastContainer.appendChild(toast);
  
  // Initialize Lucide icons for this specific toast
  if (window.lucide) {
    window.lucide.createIcons({ nodes: [toast] });
  }

  const closeBtn = toast.querySelector('.toast-close');
  let timeoutId = setTimeout(() => removeToast(toast), duration);

  const pauseTimeout = () => clearTimeout(timeoutId);
  const resumeTimeout = () => {
    timeoutId = setTimeout(() => removeToast(toast), 1000);
  };

  toast.addEventListener('mouseenter', pauseTimeout);
  toast.addEventListener('mouseleave', resumeTimeout);

  closeBtn.addEventListener('click', () => {
    clearTimeout(timeoutId);
    removeToast(toast);
  });
}

function removeToast(toast) {
  if (!toast || !toast.parentNode) return;
  toast.classList.add('toast-exit');
  toast.addEventListener('transitionend', () => {
    toast.remove();
  }, { once: true });
}