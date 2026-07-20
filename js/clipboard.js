import { showToast } from './toast.js';

export async function copyToClipboard(text, successMessage = 'Copied to clipboard!') {
  if (!text) {
    showToast('Nothing to copy.', 'warning');
    return false;
  }

  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers or non-secure contexts
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);
      
      if (!successful) throw new Error('Fallback copy failed');
    }
    showToast(successMessage, 'success');
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    showToast('Failed to copy. Please try manually.', 'error');
    return false;
  }
}