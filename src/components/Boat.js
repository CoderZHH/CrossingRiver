import React, { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Character from './Character';
import './Boat.css';

function Boat({ position, passengers, onMove, onCross }) {
  const [boatX, setBoatX] = useState(0);
  const [isCrossing, setIsCrossing] = useState(false);
  const [direction, setDirection] = useState('right');
  const riverRef = useRef(null);

  useEffect(() => {
    const riverElement = document.querySelector('.river');
    if (riverElement) {
      const riverRect = riverElement.getBoundingClientRect();
      const newBoatX = position === 'left' ?
        40 :
        riverRect.width - 150;
      setBoatX(newBoatX);
    }
  }, [position]);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const character = e.dataTransfer.getData('character');
    if (character) {
      onMove(character, position === 'left' ? 'left' : 'right', 'boat');
    }
  };

  const handleCharacterDragStart = (character) => (e) => {
    e.dataTransfer.setData('character', character);
    e.dataTransfer.setData('from', 'boat');
  };

  const handleCharacterClick = (character) => {
    onMove(character, 'boat', position);
  };

  const handleCross = () => {
    setDirection(position === 'left' ? 'right' : 'left');
    setIsCrossing(true);
    onCross();
    setTimeout(() => setIsCrossing(false), 1000);
  };

  return (
    <motion.div
      className="boat"
      animate={{
        x: boatX
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
        mass: 2
      }}
      style={{
        position: 'absolute',
        top: '30%',
        left: 0,
        zIndex: 20
      }}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="boat-content">
        {passengers.map(character => (
          <div
            key={character}
            draggable="true"
            onDragStart={handleCharacterDragStart(character)}
            onClick={() => handleCharacterClick(character)}
            className="boat-passenger"
          >
            <Character
              name={character}
              onMove={() => handleCharacterClick(character)}
            />
          </div>
        ))}
      </div>
      <button
        className="cross-button"
        onClick={handleCross}
        disabled={passengers.length === 0 || !passengers.includes('农夫')}
      >
        划船
      </button>
      {isCrossing && (
        <>
          {/* 上方波浪线 */}
          <motion.div
            className="wave-line horizontal"
            style={{ top: '-10px', left: '0' }}
            animate={{
              y: [0, -10],
              opacity: [1, 0]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
          {/* 右侧波浪线 */}
          {direction === 'right' && (
            <motion.div
              className="wave-line vertical"
              style={{ right: '-15px', top: '5' }}
              animate={{
                x: [0, 5, 0],
                opacity: [0.8, 0.5, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          )}
          {/* 左侧波浪线 */}
          {direction === 'left' && (
            <motion.div
              className="wave-line vertical"
              style={{ left: '-15px', top: '5' }}
              animate={{
                x: [0, 5, 0],
                opacity: [0.8, 0.5, 0.8]
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "mirror"
              }}
            />
          )}
          {/* 下方波浪线 */}
          <motion.div
            className="wave-line horizontal"
            style={{ bottom: '-10px', left: '0' }}
            animate={{
              y: [0, 10],
              opacity: [1, 0]
            }}
            transition={{
              duration: 1,
              ease: "easeOut"
            }}
          />
        </>
      )}
    </motion.div>
  );
}

export default Boat; 