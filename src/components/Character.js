import React from 'react';
import './Character.css';
import { getCharacterIcon } from '../constants/icons';

function Character({ name, onMove }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('character', name);
  };

  const handleClick = () => {
    onMove('boat'); // 点击时移动到船上
  };

  return (
    <div 
      className="character"
      draggable="true"
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <span className="character-emoji">{getCharacterIcon(name)}</span>
      <span className="character-name">{name}</span>
    </div>
  );
}

export default Character; 