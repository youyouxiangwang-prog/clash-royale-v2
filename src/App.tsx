import { useState, useEffect } from 'react';
import Arena from './components/game/Arena';
import type { Tower, Unit } from './types';
import './App.css';

function App() {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [units] = useState<Unit[]>([]);

  useEffect(() => {
    const initialTowers: Tower[] = [
      { 
        id: 'enemy-king', 
        position: { x: 282, y: 0 }, 
        health: 4824, 
        maxHealth: 4824, 
        type: 'king', 
        team: 'enemy', 
        state: 'idle', 
        isKingTower: true, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      { 
        id: 'enemy-princess-left', 
        position: { x: 125, y: 54 }, 
        health: 2534, 
        maxHealth: 2534, 
        type: 'princess', 
        team: 'enemy', 
        state: 'idle', 
        isKingTower: false, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      { 
        id: 'enemy-princess-right', 
        position: { x: 438, y: 54 }, 
        health: 2534, 
        maxHealth: 2534, 
        type: 'princess', 
        team: 'enemy', 
        state: 'idle', 
        isKingTower: false, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      { 
        id: 'player-king', 
        position: { x: 282, y: 912 }, 
        health: 4824, 
        maxHealth: 4824, 
        type: 'king', 
        team: 'player', 
        state: 'idle', 
        isKingTower: true, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      { 
        id: 'player-princess-left', 
        position: { x: 125, y: 859 }, 
        health: 2534, 
        maxHealth: 2534, 
        type: 'princess', 
        team: 'player', 
        state: 'idle', 
        isKingTower: false, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      { 
        id: 'player-princess-right', 
        position: { x: 438, y: 859 }, 
        health: 2534, 
        maxHealth: 2534, 
        type: 'princess', 
        team: 'player', 
        state: 'idle', 
        isKingTower: false, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
    ];
    setTowers(initialTowers);
  }, []);

  // Arena dimensions match background texture
  const ARENA_WIDTH = 626;
  const ARENA_HEIGHT = 966;

  return (
    <div className="app">
      <div className="game-container">
        <Arena towers={towers} units={units} width={ARENA_WIDTH} height={ARENA_HEIGHT} />
      </div>
    </div>
  );
}

export default App;
