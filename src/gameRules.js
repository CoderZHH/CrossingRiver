// 检查船上的基本规则
export function checkBoatRules(boatPassengers) {
  // 检查船上人数不超过2人
  if (boatPassengers.length > 2) return false;

  // 检查船上角色的冲突
  const hasWolf = boatPassengers.includes('狼');
  const hasSheep = boatPassengers.includes('羊');
  const hasCabbage = boatPassengers.includes('白菜');
  const hasFarmer = boatPassengers.includes('农夫');

  // 如果船上有农夫，则允许任何组合
  if (hasFarmer) {
    return true;
  }

  // 检查危险组合
  if (hasWolf && hasSheep) return false;
  if (hasSheep && hasCabbage) return false;

  return true;
}

// 检查划船规则
export function checkCrossingRules(boatPassengers) {
  // 划船时必须有农夫在船上
  return boatPassengers.includes('农夫');
}

// 检查两岸的安全规则
export function checkBankRules(leftBank, rightBank) {
  // 检查单个岸边是否安全
  const isBankSafe = (bank) => {
    // 如果农夫在场，所有组合都是安全的
    if (bank.includes('农夫')) return true;

    // 检查危险组合
    const hasWolf = bank.includes('狼');
    const hasSheep = bank.includes('羊');
    const hasCabbage = bank.includes('白菜');

    // 狼和羊不能共存
    if (hasWolf && hasSheep) return false;
    // 羊和白菜不能共存
    if (hasSheep && hasCabbage) return false;

    return true;
  };

  return isBankSafe(leftBank) && isBankSafe(rightBank);
} 