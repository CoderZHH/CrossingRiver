import { getCharacterIcon } from '../constants/icons';

export const formatBankState = (bank) => {
  if (!bank || bank.length === 0) return '空';
  return bank.map(getCharacterIcon).join(' ');
}; 