import React from 'react';

const GameControls = ({ onReset, onUndo, onDemo, onToggleHints, currentStep, isSidebarOpen, isDemoPlaying }) => {
  return (
    <div className="controls">
      <button onClick={onReset}>重新开始</button>
      <button onClick={onUndo} disabled={currentStep === 0 || isDemoPlaying}>撤销</button>
      <button onClick={onDemo}>
        {isDemoPlaying ? '暂停演示' : '演示'}
      </button>
      <button onClick={onToggleHints} disabled={isDemoPlaying}>
        {isSidebarOpen ? '隐藏提示' : '显示提示'}
      </button>
    </div>
  );
};

export default GameControls; 