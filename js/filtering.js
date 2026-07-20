export function filterData(data, filters) {
  return data.filter(item => {
    let matches = true;
    
    if (filters.event && item.event !== filters.event) matches = false;
    if (filters.category && item.category !== filters.category) matches = false;
    if (filters.demand && item.demand !== filters.demand) matches = false;
    if (filters.prediction && item.prediction !== filters.prediction) matches = false;
    if (filters.rarity && item.rarity !== filters.rarity) matches = false;
    
    if (filters.minValue && item.value < parseInt(filters.minValue, 10)) matches = false;
    if (filters.maxValue && item.value > parseInt(filters.maxValue, 10)) matches = false;
    
    return matches;
  });
}

export function getUniqueValues(data, key) {
  return [...new Set(data.map(item => item[key]).filter(Boolean))];
}