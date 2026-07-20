import { DEMAND_RANKING, SORT_OPTIONS } from './constants.js';

export function sortData(data, sortOption) {
  const sorted = [...data];
  
  switch (sortOption) {
    case SORT_OPTIONS.VALUE_DESC:
      return sorted.sort((a, b) => b.value - a.value);
    case SORT_OPTIONS.VALUE_ASC:
      return sorted.sort((a, b) => a.value - b.value);
    case SORT_OPTIONS.NAME_ASC:
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case SORT_OPTIONS.NAME_DESC:
      return sorted.sort((a, b) => b.name.localeCompare(a.name));
    case SORT_OPTIONS.DEMAND_DESC:
      return sorted.sort((a, b) => (DEMAND_RANKING[b.demand] || 0) - (DEMAND_RANKING[a.demand] || 0));
    case SORT_OPTIONS.DEMAND_ASC:
      return sorted.sort((a, b) => (DEMAND_RANKING[a.demand] || 0) - (DEMAND_RANKING[b.demand] || 0));
    case SORT_OPTIONS.UPDATED_DESC:
      return sorted.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
    case SORT_OPTIONS.UPDATED_ASC:
      return sorted.sort((a, b) => new Date(a.lastUpdated) - new Date(b.lastUpdated));
    case SORT_OPTIONS.EVENT_DESC:
      return sorted.sort((a, b) => b.event.localeCompare(a.event));
    case SORT_OPTIONS.EVENT_ASC:
      return sorted.sort((a, b) => a.event.localeCompare(b.event));
    case SORT_OPTIONS.PREDICTION:
      return sorted.sort((a, b) => a.prediction.localeCompare(b.prediction));
    case SORT_OPTIONS.CATEGORY:
      return sorted.sort((a, b) => a.category.localeCompare(b.category));
    case SORT_OPTIONS.RARITY:
      return sorted.sort((a, b) => a.rarity.localeCompare(b.rarity));
    default:
      return sorted;
 
    }
}