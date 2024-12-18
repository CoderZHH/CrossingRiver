import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Boat from './Boat';
import Character from './Character';
import './RiverCrossing.css';
import { checkBoatRules, checkBankRules } from '../constants/gameRules';

const RiverCrossing = forwardRef(({ gameHistory, setGameHistory, currentStep, setCurrentStep, initialState }, ref) => {
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
    if (to === 'boat') {
      handleCharacterClick(character, from);
    } else {
      // 从船上到岸边
      handleCharacterClick(character, 'boat');
    }
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

    // 如果点击的是船上的角色，处理下船逻辑
    if (from === 'boat') {
      const newBoatPassengers = boatPassengers.filter(c => c !== character);
      const targetBank = boatPosition === 'left' ? leftBank : rightBank;
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
    if (boatPassengers.length > 0 && boatPassengers.includes('农夫')) {
      const newBoatPosition = boatPosition === 'left' ? 'right' : 'left';
      const newState = {
        leftBank: [...leftBank],
        rightBank: [...rightBank],
        boatPosition: newBoatPosition,
        boatPassengers: [...boatPassengers]
      };
      updateGameState(newState);
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