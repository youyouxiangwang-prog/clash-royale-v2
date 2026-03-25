import { useState, useEffect } from 'react';
import Arena from './components/game/Arena';
import type { Tower, Unit } from './types';
import './App.css';

function App() {
  const [towers, setTowers] = useState<Tower[]>([]);
  const [units] = useState<Unit[]>([]);

  // Initialize towers - positions scaled for 506x832 portrait arena
  useEffect(() => {
    // Scale factors: x: 506/800 = 0.6325, y: 832/600 = 1.3867
    const sx = 506 / 800;
    const sy = 832 / 600;
    const initialTowers: Tower[] = [
      // Player towers (bottom, higher y values)
      { id: 'player-princess-left', position: { x: Math.round(150 * sx), y: Math.round(450 * sy) }, health: 2534, maxHealth: 2534, type: 'princess', team: 'player', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'player-princess-right', position: { x: Math.round(650 * sx), y: Math.round(450 * sy) }, health: 2534, maxHealth: 2534, type: 'princess', team: 'player', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'player-king', position: { x: Math.round(400 * sx), y: Math.round(500 * sy) }, health: 4824, maxHealth: 4824, type: 'king', team: 'player', state: 'idle', isKingTower: true, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      // Enemy towers (top, lower y values)
      { id: 'enemy-princess-left', position: { x: Math.round(150 * sx), y: Math.round(150 * sy) }, health: 2534, maxHealth: 2534, type: 'princess', team: 'enemy', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'enemy-princess-right', position: { x: Math.round(650 * sx), y: Math.round(150 * sy) }, health: 2534, maxHealth: 2534, type: 'princess', team: 'enemy', state: 'idle', isKingTower: false, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
      { id: 'enemy-king', position: { x: Math.round(400 * sx), y: Math.round(100 * sy) }, health: 4824, maxHealth: 4824, type: 'king', team: 'enemy', state: 'idle', isKingTower: true, animationState: { currentAnimation: 'idle', currentFrame: 0, frameTime: 0, playing: true, completed: false } },
    ];
    setTowers(initialTowers);
  }, []);

  // Use portrait orientation to match Clash Royale arena (506x832 background)
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