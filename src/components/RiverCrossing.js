import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Boat from './Boat';
import Character from './Character';
import './RiverCrossing.css';
import { checkBoatRules, checkBankRules } from '../constants/gameRules';

const RiverCrossing = forwardRef(({ gameHistory, setGameHistory, currentStep, setCurrentStep, initialState, onMove, onCross }, ref) => {
  const [leftBank, setLeftBank] = useState(initialState.leftBank);
  const [rightBank, setRightBank] = useState(initialState.rightBank);
  const [boatPosition, setBoatPosition] = useState(initialState.boatPosition);
  const [boatPassengers, setBoatPassengers] = useState(initialState.boatPassengers);

  // 更新游戏状态的辅助函数
  const updateGameState = (newState) => {
    const newHistory = [...gameHistory.slice(0, currentStep + 1), newState];
    setGameHistory(newHistory);
    setCurrentStep(currentStep + 1);
  };

  // 处理角色移动的函数
  const handleCharacterMove = (character, from, to) => {
    console.log('RiverCrossing: handling move', { character, from, to });
    if (to === 'boat') {
      handleCharacterClick(character, from);
    } else {
      handleCharacterClick(character, 'boat');
    }
    // 通知父组件
    onMove && onMove(character, from, to);
  };

  useEffect(() => {
    if (gameHistory.length > 0) {
      const currentState = gameHistory[currentStep];
      setLeftBank([...currentState.leftBank]);
      setRightBank([...currentState.rightBank]);
      setBoatPosition(currentState.boatPosition);
      setBoatPassengers([...currentState.boatPassengers]);
    }
  }, [currentStep, gameHistory]);

  const handleCharacterClick = (character, from) => {
    const currentState = gameHistory[currentStep];
    const { leftBank, rightBank, boatPosition, boatPassengers } = currentState;

    // 检查角色是否已经在目标位置
    if (from === 'boat') {
      // 如果角色已经在目标岸边，则不允许重复添加
      const targetBank = boatPosition === 'left' ? leftBank : rightBank;
      if (targetBank.includes(character)) {
        console.log('Character already exists in target bank');
        return;
      }

      const newBoatPassengers = boatPassengers.filter(c => c !== character);
      const newState = {
        ...currentState,
        boatPassengers: newBoatPassengers,
        [boatPosition === 'left' ? 'leftBank' : 'rightBank']: [...targetBank, character]
      };

      // 检查新状态是否合法
      if (!checkBankRules(newState.leftBank, newState.rightBank)) {
        toast.error('这样会导致岸边出现危险情况！', {
          position: "top-center",
          toastId: 'bank-rules-error'
        });
        return;
      }

      updateGameState(newState);
      return;
    }

    // 处理上船逻辑
    // 检查角色是否已经在船上
    if (boatPassengers.includes(character)) {
      console.log('Character already on boat');
      return;
    }

    const newBoatPassengers = [...boatPassengers, character];
    const sourceBank = from === 'left' ? leftBank : rightBank;
    const newSourceBank = sourceBank.filter(c => c !== character);

    const newState = {
      ...currentState,
      boatPassengers: newBoatPassengers,
      [from === 'left' ? 'leftBank' : 'rightBank']: newSourceBank
    };

    // 检查船的规则
    if (!checkBoatRules(newBoatPassengers)) {
      if (newBoatPassengers.length > 2) {
        toast.error('船最多只能载两个角色！', {
          position: "top-center",
          toastId: 'boat-capacity-error'
        });
      } else {
        toast.error('这些角色不能同时在船上！', {
          position: "top-center",
          toastId: 'dangerous-combination-error'
        });
      }
      return;
    }

    // 检查岸边规则
    if (!checkBankRules(newState.leftBank, newState.rightBank)) {
      toast.error('狼会吃羊！或羊会吃菜！', {
        position: "top-center",
        toastId: 'bank-rules-error'
      });
      return;
    }

    updateGameState(newState);
  };

  const moveBoat = () => {
    console.log('RiverCrossing: moving boat');
    if (boatPassengers.length > 0 && boatPassengers.includes('农夫')) {
      const newBoatPosition = boatPosition === 'left' ? 'right' : 'left';
      const newState = {
        leftBank: [...leftBank],
        rightBank: [...rightBank],
        boatPosition: newBoatPosition,
        boatPassengers: [...boatPassengers]
      };
      updateGameState(newState);
      // 通知父组件
      onCross && onCross();
    } else {
      toast.error('船需要农夫才能过河！', { position: "top-center" });
    }
  };

  useImperativeHandle(ref, () => ({
    handleDemoMove: handleCharacterMove,
    moveBoat
  }));

  return (
    <div className="river-crossing">
      <ToastContainer />
      <div
        className="bank left-bank"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const character = e.dataTransfer.getData('character');
          const from = e.dataTransfer.getData('from');
          if (from === 'boat') {
            handleCharacterMove(character, 'boat', 'left');
          }
        }}
      >
        {leftBank.map(character => (
          <Character
            key={character}
            name={character}
            onMove={(to) => handleCharacterMove(character, 'left', to)}
          />
        ))}
      </div>

      <div className="river">
        <Boat
          position={boatPosition}
          passengers={boatPassengers}
          onMove={handleCharacterMove}
          onCross={moveBoat}
        />
      </div>

      <div
        className="bank right-bank"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const character = e.dataTransfer.getData('character');
          const from = e.dataTransfer.getData('from');
          if (from === 'boat') {
            handleCharacterMove(character, 'boat', 'right');
          }
        }}
      >
        {rightBank.map(character => (
          <Character
            key={character}
            name={character}
            onMove={(to) => handleCharacterMove(character, 'right', to)}
          />
        ))}
      </div>
    </div>
  );
});

export default RiverCrossing; 