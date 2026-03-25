import React from 'react';

interface ElixirBarProps {
  elixir: number;
  maxElixir: number;
  side: 'left' | 'right';
}

const ElixirBar: React.FC<ElixirBarProps> = ({ elixir, maxElixir, side }) => {
  const percentage = (elixir / maxElixir) * 100;

  return (
    <div className={`elixir-bar elixir-bar-${side}`}>
      <div className="elixir-icon">💧</div>
      <div className="elixir-track">
        <div 
          className="elixir-fill" 
          style={{ height: `${percentage}%` }}
        />
      </div>
      <div className="elixir-count">{elixir}/{maxElixir}</div>
    </div>
  );
};

export default ElixirBar;