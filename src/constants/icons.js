export const ICONS = {
  left: '⬅️',
  right: '➡️',
  boat: '🛶',
  farmer: '👨‍🌾',
  wolf: '🐺',
  sheep: '🐑',
  cabbage: '🥬',
  arrow: '➡️',
};

export const getCharacterIcon = (character) => {
  switch (character) {
    case '农夫': return ICONS.farmer;
    case '狼': return ICONS.wolf;
    case '羊': return ICONS.sheep;
    case '白菜': return ICONS.cabbage;
    default: return character;
  }
}; 