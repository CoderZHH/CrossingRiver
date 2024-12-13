import { getCharacterIcon } from '../constants/icons';

export const findCharacterDifferences = (state1, state2) => {
  const boarding = [];
  const unboarding = [];

  if (state2.boatPassengers.length > state1.boatPassengers.length) {
    state2.boatPassengers.forEach(char => {
      if (!state1.boatPassengers.includes(char)) {
        boarding.push(char);
      }
    });
  }

  if (state2.boatPassengers.length < state1.boatPassengers.length) {
    state1.boatPassengers.forEach(char => {
      if (!state2.boatPassengers.includes(char)) {
        unboarding.push(char);
      }
    });
  }

  return { boarding, unboarding };
};

export const formatBankState = (bank) => {
  if (!bank || bank.length === 0) return '空';
  return bank.map(getCharacterIcon).join(' ');
}; 