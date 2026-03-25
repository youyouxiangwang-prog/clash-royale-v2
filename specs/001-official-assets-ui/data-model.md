# Data Model - Official Assets UI

## Core Entities

### 1. SpriteSheet

Represents a collection of animation frames from official assets.

```typescript
interface SpriteSheet {
  id: string;                    // e.g., "knight", "archer"
  name: string;                  // Display name
  directory: string;             // Asset directory path
  
  // Frame info
  frameCount: number;            // Total frames available
  frameWidth: number;            // Width of each frame (px)
  frameHeight: number;           // Height of each frame (px)
  
  // Animations
  animations: Map<string, AnimationConfig>;
  
  // Loaded state
  loaded: boolean;
  frames: HTMLImageElement[];    // Loaded frame images
}
```

### 2. AnimationConfig

Defines how frames are grouped into animations.

```typescript
interface AnimationConfig {
  name: string;                  // e.g., "idle", "walk", "attack"
  frames: number[];              // Frame indices for this animation
  fps: number;                   // Frames per second
  loop: boolean;                 // Whether animation loops
  pingPong?: boolean;            // Reverse at end before looping
}
```

### 3. AnimationState

Tracks the current state of an animation instance.

```typescript
interface AnimationState {
  currentAnimation: string;      // Current animation name
  currentFrame: number;          // Current frame index in animation
  frameTime: number;             // Time since last frame (ms)
  playing: boolean;              // Is animation playing?
  completed: boolean;            // Has one-shot animation completed?
}
```

### 4. Arena

Represents the game arena.

```typescript
interface Arena {
  // Dimensions
  width: number;                 // Arena width (px)
  height: number;                // Arena height (px)
  
  // Texture
  texture: HTMLImageElement;     // Loaded arena texture
  texturePath: string;           // Path to texture file
  
  // Grid (for unit placement)
  grid: {
    columns: number;             // Grid columns
    rows: number;                // Grid rows
    cellWidth: number;           // Cell width (px)
    cellHeight: number;          // Cell height (px)
  };
  
  // Zones
  riverY: number;                // Y position of river
  bridgePositions: Position[];   // Bridge positions
}
```

### 5. Tower

Represents a princess or king tower.

```typescript
interface Tower {
  id: string;                    // Unique tower ID
  type: 'princess' | 'king';     // Tower type
  team: 'player' | 'enemy';      // Which team
  
  // Position
  position: Position;            // Center position on arena
  
  // Dimensions
  width: number;                 // Tower width (px)
  height: number;                // Tower height (px)
  
  // Stats
  health: number;                // Current health
  maxHealth: number;             // Maximum health
  
  // Animation
  spriteSheet: SpriteSheet;      // Tower sprites
  animationState: AnimationState; // Current animation
  
  // State
  state: 'idle' | 'attacking' | 'destroyed';
  target: Unit | null;           // Current target
}
```

### 6. Unit

Represents a game unit (troop).

```typescript
interface Unit {
  id: string;                    // Unique unit ID
  type: string;                  // Unit type (e.g., "knight")
  team: 'player' | 'enemy';      // Which team
  
  // Position and movement
  position: Position;            // Current position
  targetPosition: Position | null; // Movement target
  velocity: Velocity;            // Current velocity
  facing: 'left' | 'right';      // Facing direction
  
  // Stats
  health: number;                // Current health
  maxHealth: number;             // Maximum health
  damage: number;                // Attack damage
  speed: number;                 // Movement speed (px/s)
  range: number;                 // Attack range (px)
  attackSpeed: number;           // Attacks per second
  
  // Animation
  spriteSheet: SpriteSheet;      // Unit sprites
  animationState: AnimationState; // Current animation
  
  // State
  state: 'idle' | 'walking' | 'attacking' | 'dying' | 'dead';
  target: Unit | Tower | null;   // Attack target
  lastAttackTime: number;        // Time of last attack (ms)
}
```

### 7. Position & Velocity

```typescript
interface Position {
  x: number;
  y: number;
}

interface Velocity {
  x: number;
  y: number;
}
```

## Sprite Configurations

### Knight Example

```typescript
const knightSprite: SpriteSheet = {
  id: 'knight',
  name: 'Knight',
  directory: 'assets/sc/chr_knight_out/',
  frameCount: 50,
  frameWidth: 187,
  frameHeight: 181,
  animations: new Map([
    ['idle', { name: 'idle', frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], fps: 8, loop: true }],
    ['walk', { name: 'walk', frames: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20], fps: 12, loop: true }],
    ['attack', { name: 'attack', frames: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30], fps: 15, loop: false }],
    ['die', { name: 'die', frames: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40], fps: 8, loop: false }]
  ]),
  loaded: false,
  frames: []
};
```

### Tower Example

```typescript
const towerSprite: SpriteSheet = {
  id: 'tower',
  name: 'Princess Tower',
  directory: 'assets/sc/building_tower_out/',
  frameCount: 214,
  frameWidth: 407,
  frameHeight: 471,
  animations: new Map([
    ['idle', { name: 'idle', frames: range(0, 30), fps: 8, loop: true }],
    ['attack', { name: 'attack', frames: range(31, 60), fps: 12, loop: true }],
    ['damaged', { name: 'damaged', frames: range(61, 90), fps: 10, loop: true }],
    ['destroyed', { name: 'destroyed', frames: range(91, 100), fps: 8, loop: false }]
  ]),
  loaded: false,
  frames: []
};
```

## Game State

```typescript
interface GameState {
  // Time
  timeRemaining: number;         // Seconds remaining
  phase: 'normal' | 'overtime' | 'ended';
  
  // Arena
  arena: Arena;
  
  // Towers
  towers: Tower[];
  
  // Units
  units: Unit[];
  
  // Players
  player: PlayerState;
  enemy: PlayerState;
}

interface PlayerState {
  elixir: number;                // Current elixir (0-10)
  hand: Card[];                  // 4 cards in hand
  deck: Card[];                  // Full deck (8 cards)
}
```

## Relationships

```
GameState
├── Arena (1)
│   └── texture: HTMLImageElement
├── Tower[] (6)
│   ├── spriteSheet: SpriteSheet
│   └── animationState: AnimationState
├── Unit[] (0-n)
│   ├── spriteSheet: SpriteSheet
│   └── animationState: AnimationState
└── PlayerState (2)
    └── hand: Card[] (4 each)
```

## Validation Rules

1. **SpriteSheet.frameCount** must match actual files in directory
2. **AnimationConfig.frames** must be valid indices into SpriteSheet.frames
3. **Unit.health** must be >= 0 and <= maxHealth
4. **Tower.position** must be within arena bounds
5. **PlayerState.elixir** must be >= 0 and <= 10