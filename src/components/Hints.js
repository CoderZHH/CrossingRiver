import React from 'react';

const Hints = ({ hints, isSidebarOpen }) => {
  if (!isSidebarOpen) return null;

  return (
    <div className="right-panel">
      <h3>🎯 提示步骤</h3>
      <div className="hints-list">
        {hints.map((hint, index) => (
          hint.type === 'header' ? (
            <div key={index} className="hint-header">
              {hint.content}
            </div>
          ) : (
            <div key={index} className="hint-step">
              <div className="step-number">步骤 {hint.stepNumber}</div>
              <div className="step-content">
                <div className="step-action">{hint.content.action}</div>
                <div className="step-state">
                  <div>左岸: {hint.content.leftBank}</div>
                  <div>右岸: {hint.content.rightBank}</div>
                  <div>船上: {hint.content.boat}</div>
                </div>
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

export default Hints; 