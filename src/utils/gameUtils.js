import { ICONS, getCharacterIcon } from '../constants/icons';


export const formatBankState = (bank) => {
  if (!bank || bank.length === 0) return '空';
  return bank.map(getCharacterIcon).join(' ');
};

export const formatStateChange = (current, next) => {
  if (current.boatPosition !== next.boatPosition) {
    const direction = next.boatPosition === 'right' ? ICONS.right : ICONS.left;
    return `${ICONS.boat} ${direction} 划船`;
  }

  const currentBoatSet = new Set(current.boatPassengers);
  const nextBoatSet = new Set(next.boatPassengers);

  if (nextBoatSet.size > currentBoatSet.size) {
    const boarding = next.boatPassengers.filter(p => !currentBoatSet.has(p));
    return `${boarding.map(getCharacterIcon).join('')} ${ICONS.arrow} ${ICONS.boat}`;
  }

  const unboarding = current.boatPassengers.filter(p => !nextBoatSet.has(p));
  return `${unboarding.map(getCharacterIcon).join('')} ${ICONS.arrow} ${current.boatPosition === 'left' ? '🏖️' : '🏝️'}`;
};