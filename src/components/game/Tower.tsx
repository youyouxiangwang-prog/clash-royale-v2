import React from 'react';
import type { Tower as TowerType } from '../../types';

interface TowerProps {
  tower: TowerType;
}

const Tower: React.FC<TowerProps> = ({ tower }) => {
  const healthPercent = (tower.health / tower.maxHealth) * 100;

  return (
    <div 
      className={`tower ${tower.isKingTower ? 'king' : 'princess'}`}
      style={{
        position: 'absolute',
        left: `${tower.position.x}px`,
        top: `${tower.position.y}px`,
      }}
    >
      <div className="tower-body" />
      <div className="tower-health">
        <div 
          className="tower-health-fill" 
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    </div>
  );
};

export default Tower;
