import { useState, useEffect } from 'react';
import Arena from './components/game/Arena';
import type { Tower, Unit } from './types';
import './App.css';

function App() {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [units] = useState<Unit[]>([]);

  // Initialize towers with CORRECT positions for 506x832 portrait arena
  useEffect(() => {
    // All positions hardcoded for 506x832 canvas
    // River is at Y=416, bridges at X=126 and X=380
    const initialTowers: Tower[] = [
      // === ENEMY TOWERS (top, y: 100-280) ===
      { 
        id: 'enemy-king', 
        position: { x: 253, y: 180 }, 
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
        position: { x: 100, y: 280 }, 
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
        position: { x: 406, y: 280 }, 
        health: 2534, 
        maxHealth: 2534, 
        type: 'princess', 
        team: 'enemy', 
        state: 'idle', 
        isKingTower: false, 
        animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } 
      },
      
      // === PLAYER TOWERS (bottom, y: 550-650) ===
      { 
        id: 'player-king', 
        position: { x: 253, y: 650 }, 
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
        position: { x: 100, y: 552 }, 
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
        position: { x: 406, y: 552 }, 
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
  const ARENA_WIDTH = 506;
  const ARENA_HEIGHT = 832;

  return (
    <div className="app">
      <div className="game-container">
        <Arena towers={towers} units={units} width={ARENA_WIDTH} height={ARENA_HEIGHT} />
      </div>
    </div>
  );
}

export default App;
