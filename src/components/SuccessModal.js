import React from 'react';
import { ICONS } from '../constants/icons';

const SuccessModal = ({ isSuccess }) => {
  if (!isSuccess) return null;

  return (
    <div className="success-overlay">
      <div className="success-modal">
        <div className="success-icon">🎉</div>
        <h2>恭喜通关！</h2>
        <p>你成功帮助所有角色安全过河</p>
        <div className="success-emojis">
          {ICONS.farmer} {ICONS.wolf} {ICONS.sheep} {ICONS.cabbage}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal; 