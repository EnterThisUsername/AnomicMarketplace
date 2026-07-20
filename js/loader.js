import { CONFIG } from './config.js';

export async function loadDataset(manifestUrl, dataPath) {
  try {
    const response = await fetch(manifestUrl);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const manifest = await response.json();
    if (!manifest.items || !Array.isArray(manifest.items)) {
      throw new Error('Invalid manifest format');
    }

    const promises = manifest.items.map(async (fileName) => {
      try {
        const itemRes = await fetch(`${dataPath}${fileName}`);
        if (!itemRes.ok) {
          console.warn(`Failed to load ${fileName}: ${itemRes.status}`);
          return null;
        }
        const itemData = await itemRes.json();
        return validateItem(itemData) ? itemData : null;
      } catch (e) {
        console.warn(`Error parsing ${fileName}:`, e);
        return null;
      }
    });

    const results = await Promise.all(promises);
    return results.filter(item => item !== null);
  } catch (error) {
    console.error('Error loading dataset:', error);
    throw error;
  }
}

function validateItem(item) {
  return item && item.id && item.name;
}

export function handleImageError(img) {
  img.onerror = null; // Prevent infinite loop
  img.src = CONFIG.placeholders.image;
  img.alt = 'Image not available';
}