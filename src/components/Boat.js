import React from 'react';
import Character from './Character';
import './Boat.css';

function Boat({ position, passengers, onMove, onCross }) {
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

  return (
    <div 
      className={`boat ${position}`}
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
        onClick={onCross}
        disabled={passengers.length === 0 || !passengers.includes('农夫')}
      >
        划船
      </button>
    </div>
  );
}

export default Boat; 