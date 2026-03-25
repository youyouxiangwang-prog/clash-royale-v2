// Game types for Clash Royale V2

export interface Position {
  x: number;
  y: number;
}

export interface Tower {
  id: string;
  position: Position;
  health: number;
  maxHealth: number;
  isKingTower: boolean;
}

export interface Unit {
  id: string;
  type: string;
  position: Position;
  health: number;
  maxHealth: number;
  speed: number;
  damage: number;
  range: number;
  isEnemy: boolean;
}

export interface Card {
  id: string;
  type: string;
  elixirCost: number;
  icon?: string;
}

export interface GameState {
  time: number;
  elixir: number;
  maxElixir: number;
  cards: Card[];
  units: Unit[];
  towers: Tower[];
  isGameOver: boolean;
  winner?: 'player' | 'enemy';
}
