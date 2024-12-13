import React from 'react';
import './Character.css';

function Character({ name, onMove }) {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('character', name);
  };

  const handleClick = () => {
    onMove('boat'); // 点击时移动到船上
  };

  const getCharacterEmoji = () => {
    switch (name) {
      case '农夫':
        return '👨‍🌾';
      case '狼':
        return '🐺';
      case '羊':
        return '🐑';
      case '白菜':
        return '🥬';
      default:
        return '❓';
    }
  };

  return (
    <div 
      className="character"
      draggable="true"
      onDragStart={handleDragStart}
      onClick={handleClick}
    >
      <span className="character-emoji">{getCharacterEmoji()}</span>
      <span className="character-name">{name}</span>
    </div>
  );
}

export default Character; 