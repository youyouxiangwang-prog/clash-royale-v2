import { useState, useEffect } from 'react';
import Timer from './components/ui/Timer';
import ElixirBar from './components/ui/ElixirBar';
import CardHand from './components/ui/CardHand';
import Arena from './components/game/Arena';
import type { GameState, Card, Tower, Unit } from './types';
import './App.css';

// Initial game state
const createInitialState = (): GameState => ({
  time: 180,
  elixir: 5,
  maxElixir: 10,
  cards: [
    { id: '1', type: 'Knight', elixirCost: 4 },
    { id: '2', type: 'Archer', elixirCost: 3 },
    { id: '3', type: 'Goblin', elixirCost: 3 },
    { id: '4', type: 'Fireball', elixirCost: 4 },
  ],
  units: [],
  towers: [
    { id: 'pt', position: { x: 200, y: 150 }, health: 100, maxHealth: 100, isKingTower: false },
    { id: 'pb', position: { x: 200, y: 450 }, health: 100, maxHealth: 100, isKingTower: false },
    { id: 'pk', position: { x: 200, y: 300 }, health: 150, maxHealth: 150, isKingTower: true },
    { id: 'et', position: { x: 600, y: 150 }, health: 100, maxHealth: 100, isKingTower: false },
    { id: 'eb', position: { x: 600, y: 450 }, health: 100, maxHealth: 100, isKingTower: false },
    { id: 'ek', position: { x: 600, y: 300 }, health: 150, maxHealth: 150, isKingTower: true },
  ],
  isGameOver: false,
});

function App() {
  const [gameState, setGameState] = useState<GameState>(createInitialState);

  // Game timer
  useEffect(() => {
    if (gameState.isGameOver) return;

    const timer = setInterval(() => {
      setGameState((prev) => {
        if (prev.time <= 0) {
          return { ...prev, isGameOver: true };
        }
        return { ...prev, time: prev.time - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isGameOver]);

  // Elixir regeneration
  useEffect(() => {
    if (gameState.isGameOver) return;

    const elixirTimer = setInterval(() => {
      setGameState((prev) => ({
        ...prev,
        elixir: Math.min(prev.elixir + 1, prev.maxElixir),
      }));
    }, 3000);

    return () => clearInterval(elixirTimer);
  }, [gameState.isGameOver]);

  const handleCardClick = (card: Card) => {
    if (gameState.elixir < card.elixirCost) return;

    setGameState((prev) => ({
      ...prev,
      elixir: prev.elixir - card.elixirCost,
      units: [
        ...prev.units,
        {
          id: `${Date.now()}`,
          type: card.type,
          position: { x: 100, y: 300 },
          health: 50,
          maxHealth: 50,
          speed: 1,
          damage: 10,
          range: 50,
          isEnemy: false,
        },
      ],
    }));
  };

  return (
    <div className="app">
      <div className="game-container">
        <ElixirBar elixir={gameState.elixir} maxElixir={gameState.maxElixir} side="left" />
        
        <div className="game-area">
          <div className="top-bar">
            <Timer time={gameState.time} />
          </div>
          
          <Arena 
            towers={gameState.towers} 
            units={gameState.units}
            width={800}
            height={600}
          />
          
          <div className="bottom-bar">
            <CardHand cards={gameState.cards} onCardClick={handleCardClick} />
          </div>
        </div>

        <ElixirBar elixir={8} maxElixir={10} side="right" />
      </div>
    </div>
  );
}

export default App;