import { useState, useEffect } from 'react';
import Arena from './components/game/Arena';
import type { Tower, Unit } from './types';
import './App.css';

function App() {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [units] = useState<Unit[]>([]);

  // Initialize towers
  useEffect(() => {
    const initialTowers: Tower[] = [
      // Player towers (bottom)
      { id: 'player-princess-left', position: { x: 150, y: 450 }, health: 2534, maxHealth: 2534, type: 'princess', team: 'player', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'player-princess-right', position: { x: 650, y: 450 }, health: 2534, maxHealth: 2534, type: 'princess', team: 'player', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'player-king', position: { x: 400, y: 500 }, health: 4824, maxHealth: 4824, type: 'king', team: 'player', state: 'idle', isKingTower: true, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      // Enemy towers (top)
      { id: 'enemy-princess-left', position: { x: 150, y: 150 }, health: 2534, maxHealth: 2534, type: 'princess', team: 'enemy', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'enemy-princess-right', position: { x: 650, y: 150 }, health: 2534, maxHealth: 2534, type: 'princess', team: 'enemy', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'enemy-king', position: { x: 400, y: 100 }, health: 4824, maxHealth: 4824, type: 'king', team: 'enemy', state: 'idle', isKingTower: true, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
    ];
    setTowers(initialTowers);
  }, []);

  return (
    <div className="app">
      <div className="game-container">
        <Arena towers={towers} units={units} width={800} height={600} />
      </div>
    </div>
  );
}

export default App;