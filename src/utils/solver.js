import { checkBankRules, checkBoatRules, checkCrossingRules } from '../constants/gameRules.js';

class State {
  constructor(leftBank, rightBank, boatPosition, boatPassengers = []) {
    this.leftBank = leftBank; // 左岸的对象列表
    this.rightBank = rightBank; // 右岸的对象列表
    this.boatPosition = boatPosition; // 船的位置 ('left' 或 'right')
    this.boatPassengers = boatPassengers; // 船上的乘客
  }

  // 检查当前状态是否是目标状态
  isGoalState(goalState) {
    return (
      this.leftBank.length === 0 &&
      this.boatPassengers.length === 0 &&
      JSON.stringify(this.rightBank.sort()) ===
      JSON.stringify(goalState.rightBank.sort()) &&
      this.boatPosition === goalState.boatPosition
    );
  }

  // 返回状态的唯一键，用于哈希表（防止循环）
  getStateKey() {
    return JSON.stringify({
      leftBank: this.leftBank.sort(),
      rightBank: this.rightBank.sort(),
      boatPosition: this.boatPosition,
      boatPassengers: this.boatPassengers.sort()
    });
  }

  // 创建状态的副本
  clone() {
    return new State(
      [...this.leftBank],
      [...this.rightBank],
      this.boatPosition,
      [...this.boatPassengers]
    );
  }
}

// 定义目标状态
const goalState = new State(
  [], // 左岸为空
  ['农夫', '狼', '羊', '白菜'], // 右岸有所有角色
  'right', // 船在右岸
  [] // 船上没有乘客
);

// BFS 求解过河问题
function findSolution(initialState, goalState) {
  console.log('=== 开始寻找最优解 ===');
  console.log('初始状态:', {
    leftBank: initialState.leftBank,
    rightBank: initialState.rightBank,
    boatPosition: initialState.boatPosition,
    boatPassengers: initialState.boatPassengers
  });

  const queue = []; // 队列，用于存储当前状态和路径
  const visited = new Map(); // 使用 Map 记录访问过的状态和其最短路径长度

  // 初始化队列
  queue.push({ state: initialState, path: [initialState] });
  visited.set(initialState.getStateKey(), 0); // 记录初始状态的路径长度为0

  let bestSolution = null;
  let minSteps = Infinity;

  while (queue.length > 0) {
    const { state, path } = queue.shift();
    const currentSteps = path.length - 1;

    // 如果当前路径已经比找到的最优解还长，就跳过
    if (currentSteps >= minSteps) {
      continue;
    }

    // 检查是否到达目标状态
    if (state.isGoalState(goalState)) {
      console.log(`找到一个解决方案，步数: ${currentSteps}`);
      if (currentSteps < minSteps) {
        minSteps = currentSteps;
        bestSolution = path;
        console.log('✨ 更新最优解');
      }
      continue;
    }

    // 生成所有可能的下一步状态
    for (const neighbor of generateNeighbors(state)) {
      const neighborKey = neighbor.getStateKey();
      const newPathLength = path.length;

      // 如果这个状态没有被访问过，或者找到了更短的路径
      if (!visited.has(neighborKey) || visited.get(neighborKey) > newPathLength) {
        visited.set(neighborKey, newPathLength);
        queue.push({
          state: neighbor,
          path: [...path, neighbor]
        });
      }
    }
  }

  if (bestSolution) {
    console.log(`=== 找到最优解 ===`);
    console.log(`最少步数: ${minSteps}`);
    return bestSolution;
  }

  console.log('未找到解决方案');
  return null;
}

// 生成所有可能的合法下一步状态
function generateNeighbors(state) {
  console.group('=== 开始生成邻居状态 ===');
  console.log('当前状态:', {
    leftBank: state.leftBank,
    rightBank: state.rightBank,
    boatPosition: state.boatPosition,
    boatPassengers: state.boatPassengers
  });

  const neighbors = [];
  const currentBank = state.boatPosition === 'left' ? state.leftBank : state.rightBank;

  // 辅助函数：生成上船状态
  const generateBoardingStates = (currentBank) => {
    console.group('检查上船状态:');
    const states = [];

    // 如果船上已经有人，只能添加一个人
    if (state.boatPassengers.length === 1) {
      console.group('尝试添加第二个乘客:');
      for (const passenger of currentBank) {
        console.log(`\n尝试 ${passenger} 上船:`);
        const boardState = state.clone();
        // 保持原有乘客，添加新乘客
        boardState.boatPassengers = [...state.boatPassengers, passenger];

        // 从当前岸边移除上船的乘客
        if (state.boatPosition === 'left') {
          boardState.leftBank = boardState.leftBank.filter(item => item !== passenger);
        } else {
          boardState.rightBank = boardState.rightBank.filter(item => item !== passenger);
        }

        console.log('生成状态:', {
          leftBank: boardState.leftBank,
          rightBank: boardState.rightBank,
          boatPassengers: boardState.boatPassengers
        });

        const bankRulesOk = checkBankRules(boardState.leftBank, boardState.rightBank);
        const boatRulesOk = checkBoatRules(boardState.boatPassengers);

        console.log('规则检查结果:');
        console.log('- 两岸规则:', bankRulesOk ? '通过' : '不通过');
        console.log('- 船规则:', boatRulesOk ? '通过' : '不通过');

        if (bankRulesOk && boatRulesOk) {
          console.log('✅ 状态有效，添加到列表');
          states.push(boardState);
        } else {
          console.log('❌ 状态无效，跳过');
        }
      }
      console.groupEnd();
    } else if (state.boatPassengers.length === 0) {
      // 船是空的，可以上一个人或两个人
      // 单人上船
      console.group('1. 尝试单人上船:');
      for (const passenger of currentBank) {
        console.log(`\n尝试 ${passenger} 上船:`);
        const boardState = state.clone();
        boardState.boatPassengers = [passenger];

        // 从当前岸边移除上船的乘客
        if (state.boatPosition === 'left') {
          boardState.leftBank = boardState.leftBank.filter(item => item !== passenger);
        } else {
          boardState.rightBank = boardState.rightBank.filter(item => item !== passenger);
        }

        console.log('生成状态:', {
          leftBank: boardState.leftBank,
          rightBank: boardState.rightBank,
          boatPassengers: boardState.boatPassengers
        });

        const bankRulesOk = checkBankRules(boardState.leftBank, boardState.rightBank);
        const boatRulesOk = checkBoatRules(boardState.boatPassengers);

        if (bankRulesOk && boatRulesOk) {
          console.log('✅ 状态有效，添加到列表');
          states.push(boardState);
        } else {
          console.log('❌ 状态无效，跳过');
        }
      }
      console.groupEnd();

      // 两人上船
      console.group('2. 尝试两人上船:');
      for (let i = 0; i < currentBank.length; i++) {
        for (let j = i + 1; j < currentBank.length; j++) {
          const passenger1 = currentBank[i];
          const passenger2 = currentBank[j];
          console.log(`\n尝试 ${passenger1} 和 ${passenger2} 上船:`);

          const boardState = state.clone();
          boardState.boatPassengers = [passenger1, passenger2];

          // 从当前岸边移除上船的乘客
          if (state.boatPosition === 'left') {
            boardState.leftBank = boardState.leftBank.filter(item =>
              item !== passenger1 && item !== passenger2);
          } else {
            boardState.rightBank = boardState.rightBank.filter(item =>
              item !== passenger1 && item !== passenger2);
          }

          console.log('生成状态:', {
            leftBank: boardState.leftBank,
            rightBank: boardState.rightBank,
            boatPassengers: boardState.boatPassengers
          });

          const bankRulesOk = checkBankRules(boardState.leftBank, boardState.rightBank);
          const boatRulesOk = checkBoatRules(boardState.boatPassengers);

          if (bankRulesOk && boatRulesOk) {
            console.log('✅ 状态有效，添加到列表');
            states.push(boardState);
          } else {
            console.log('❌ 状态无效，跳过');
          }
        }
      }
      console.groupEnd();
    }
    console.groupEnd();
    return states;
  };

  // 辅助函数：生成划船状态
  const generateCrossingState = () => {
    console.group('检查划船状态:');
    if (state.boatPassengers.length === 0) {
      console.log('❌ 船上没有乘客，无法划船');
      console.groupEnd();
      return null;
    }

    console.log('当前船上乘客:', state.boatPassengers);
    const crossState = state.clone();
    crossState.boatPosition = state.boatPosition === 'left' ? 'right' : 'left';

    const bankRulesOk = checkBankRules(crossState.leftBank, crossState.rightBank);
    const boatRulesOk = checkBoatRules(crossState.boatPassengers);
    const crossingRulesOk = checkCrossingRules(crossState.boatPassengers);

    console.log('规则检查结果:');
    console.log('- 两岸规则:', bankRulesOk ? '通过' : '不通过');
    console.log('- 船规则:', boatRulesOk ? '通过' : '不通过');
    console.log('- 划船规则:', crossingRulesOk ? '通过' : '不通过');

    if (bankRulesOk && boatRulesOk && crossingRulesOk) {
      console.log('✅ 状态有效，可以划船');
      console.groupEnd();
      return crossState;
    }
    console.log('❌ 状态无效，无法划船');
    console.groupEnd();
    return null;
  };

  // 辅助函数：生成下船状态
  const generateUnboardingStates = () => {
    console.group('检查下船状态:');
    const states = [];
    for (const passenger of state.boatPassengers) {
      console.log(`\n尝试 ${passenger} 下船:`);
      const unboardState = state.clone();

      // 从船上移除下船的乘客
      unboardState.boatPassengers = unboardState.boatPassengers.filter(p => p !== passenger);

      // 将乘客添加到当前岸边
      if (state.boatPosition === 'left') {
        unboardState.leftBank = [...unboardState.leftBank, passenger];
      } else {
        unboardState.rightBank = [...unboardState.rightBank, passenger];
      }

      console.log('生成状态:', {
        leftBank: unboardState.leftBank,
        rightBank: unboardState.rightBank,
        boatPassengers: unboardState.boatPassengers
      });

      const bankRulesOk = checkBankRules(unboardState.leftBank, unboardState.rightBank);
      const boatRulesOk = checkBoatRules(unboardState.boatPassengers);

      if (bankRulesOk && boatRulesOk) {
        console.log('✅ 状态有效，添加到列表');
        states.push(unboardState);
      } else {
        console.log('❌ 状态无效，跳过');
      }
    }
    console.groupEnd();
    return states;
  };

  // 生成所有可能的状态
  if (state.boatPassengers.length === 0) {
    console.log('\n船是空的，尝试上船操作');
    neighbors.push(...generateBoardingStates(currentBank));
  } else if (state.boatPassengers.length === 1) {
    // 船上有一个人，可以继续上船或划船或下船
    console.log('\n船上有一个人，可以继续上船、划船或下船');
    neighbors.push(...generateBoardingStates(currentBank)); // 可以继续上船
    const crossingState = generateCrossingState();
    if (crossingState) neighbors.push(crossingState);
    neighbors.push(...generateUnboardingStates());
  } else {
    // 船上有两个人，只能划船或下船
    console.log('\n船上已有两个人，只能划船或下船');
    const crossingState = generateCrossingState();
    if (crossingState) neighbors.push(crossingState);
    neighbors.push(...generateUnboardingStates());
  }

  console.log('\n=== 生成邻居状态完成 ===');
  console.log('总共生成有效邻居状态数量:', neighbors.length);
  console.groupEnd();
  return neighbors;
}


export { State, findSolution, goalState };
