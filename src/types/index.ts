// Game types for Clash Royale V2
// Based on data-model.md specification

export interface Position {
  x: number;
  y: number;
}

export interface Velocity {
  x: number;
  y: number;
}

export interface AnimationConfig {
  name: string;
  frames: number[];
  fps: number;
  loop: boolean;
  pingPong?: boolean;
}

export interface AnimationState {
  currentAnimation: string;
  currentFrame: number;
  frameTime: number;
  playing: boolean;
  completed: boolean;
}

export interface SpriteSheet {
  id: string;
  name: string;
  directory: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animations: Map<string, AnimationConfig>;
  loaded: boolean;
  frames: HTMLImageElement[];
}

export interface Tower {
  id: string;
  type?: 'princess' | 'king';
  team?: 'player' | 'enemy';
  position: Position;
  width?: number;
  height?: number;
  health: number;
  maxHealth: number;
  isKingTower: boolean;
  state?: 'idle' | 'attacking' | 'destroyed';
  target?: Unit | null;
  spriteSheet?: SpriteSheet;
  animationState?: AnimationState;
}

export interface Unit {
  id: string;
  type: string;
  team?: 'player' | 'enemy';
  position: Position;
  targetPosition?: Position | null;
  velocity?: Velocity;
  facing?: 'left' | 'right';
  health: number;
  maxHealth: number;
  damage: number;
  speed: number;
  range: number;
  attackSpeed?: number;
  state?: 'idle' | 'walking' | 'attacking' | 'dying' | 'dead';
  target?: Unit | Tower | null;
  lastAttackTime?: number;
  spriteSheet?: SpriteSheet;
  animationState?: AnimationState;
  isEnemy: boolean;
}

export interface Arena {
  width: number;
  height: number;
  texture?: HTMLImageElement;
  texturePath?: string;
  grid?: {
    columns: number;
    rows: number;
    cellWidth: number;
    cellHeight: number;
  };
  riverY?: number;
  bridgePositions?: Position[];
}

export interface Card {
  id: string;
  type: string;
  elixirCost: number;
  icon?: string;
}

export interface PlayerState {
  elixir: number;
  maxElixir?: number;
  hand: Card[];
  deck?: Card[];
}

export interface GameState {
  timeRemaining?: number;
  phase?: 'normal' | 'overtime' | 'ended';
  arena: Arena;
  towers: Tower[];
  units: Unit[];
  player: PlayerState;
  enemy: PlayerState;
  isGameOver?: boolean;
  winner?: 'player' | 'enemy';
}
