# 数据结构定义 - Clash Royale V2

## 1. 核心类型

```typescript
// 基础类型
type PlayerId = 'player' | 'enemy';
type TeamId = string;
type CardId = string;
type UnitId = string;
type TowerId = string;

// 位置
interface Position {
  x: number;
  y: number;
}

// 尺寸
interface Size {
  width: number;
  height: number;
}

// 矩形
interface Rect extends Position, Size {}

// 稀有度
type Rarity = 'common' | 'rare' | 'epic' | 'legendary';

// 卡牌类型
type CardType = 'troop' | 'spell' | 'building';
```

---

## 2. 游戏状态

```typescript
interface GameState {
  // 基本信息
  id: string;
  timestamp: number;
  
  // 时间
  timeRemaining: number;      // 剩余时间 (秒)
  phase: GamePhase;
  overtimeTriggered: boolean;
  
  // 玩家
  players: Record<PlayerId, PlayerState>;
  
  // 单位
  units: Unit[];
  
  // 塔
  towers: Tower[];
  
  // 游戏结束
  winner: PlayerId | null;
  endReason: EndReason | null;
}

type GamePhase = 'waiting' | 'normal' | 'overtime' | 'ended';
type EndReason = 'destroyed_king' | 'most_damage' | 'time_out';
```

---

## 3. 玩家状态

```typescript
interface PlayerState {
  id: PlayerId;
  name: string;
  
  // 圣水
  elixir: number;
  maxElixir: number;
  elixirRegenRate: number;    // 每秒回复量
  
  // 卡牌
  deck: Card[];               // 完整卡组 (8张)
  hand: Card[];               // 当前手牌 (4张)
  nextCard: Card | null;      // 下一张卡牌
  
  // 统计
  towersDestroyed: number;
  damageDealt: number;
  
  // 塔
  towers: TowerId[];
}
```

---

## 4. 卡牌数据

```typescript
interface Card {
  id: CardId;
  name: string;
  cost: number;               // 圣水消耗
  type: CardType;
  rarity: Rarity;
  
  // 描述
  description: string;
  
  // 图标
  icon: string;               // 图标路径
  
  // 类型特定数据
  troopData?: TroopData;
  spellData?: SpellData;
  buildingData?: BuildingData;
}

interface TroopData {
  health: number;
  damage: number;
  speed: number;              // 移动速度 (格/秒)
  range: number;              // 攻击范围 (格)
  attackSpeed: number;        // 攻击间隔 (秒)
  targetCount: number;        // 同时攻击目标数
  targetTypes: TargetType[];
  
  // 精灵配置
  sprites: SpriteConfig;
  
  // 渲染配置
  render: RenderConfig;
}

interface SpellData {
  radius: number;             // 半径 (格)
  damage: number;
  duration: number;           // 持续时间 (秒)
  effects: SpellEffect[];
}

interface BuildingData {
  health: number;
  damage: number;
  range: number;
  attackSpeed: number;
  lifetime: number;           // 存活时间 (秒)
  spawnCount?: number;        // 生成单位数量
  spawnInterval?: number;     // 生成间隔
}

type TargetType = 'ground' | 'air' | 'buildings';

interface SpellEffect {
  type: 'damage' | 'slow' | 'push' | 'heal';
  value: number;
  duration?: number;
}
```

---

## 5. 单位数据

```typescript
interface Unit {
  id: UnitId;
  cardId: CardId;
  playerId: PlayerId;
  
  // 位置和移动
  position: Position;
  target: Position | null;
  velocity: Velocity;
  facing: Facing;
  
  // 状态
  state: UnitState;
  health: number;
  maxHealth: number;
  
  // 战斗
  targetId: UnitId | TowerId | null;
  lastAttackTime: number;
  
  // 动画
  animation: AnimationState;
  
  // 时间
  spawnTime: number;
}

interface Velocity {
  x: number;
  y: number;
}

type Facing = 'left' | 'right';
type UnitState = 'idle' | 'walking' | 'attacking' | 'dying' | 'dead';

interface AnimationState {
  name: string;
  frame: number;
  time: number;
  playing: boolean;
}
```

---

## 6. 塔数据

```typescript
interface Tower {
  id: TowerId;
  type: TowerType;
  playerId: PlayerId;
  
  // 位置
  position: Position;
  
  // 状态
  state: TowerState;
  health: number;
  maxHealth: number;
  
  // 属性
  damage: number;
  range: number;
  attackSpeed: number;
  
  // 战斗
  targetId: UnitId | null;
  lastAttackTime: number;
  
  // 动画
  animation: AnimationState;
  
  // 特殊
  isActivated: boolean;       // 国王塔是否激活
}

type TowerType = 'princess_left' | 'princess_right' | 'king';
type TowerState = 'idle' | 'attacking' | 'destroyed';
```

---

## 7. 精灵配置

```typescript
interface SpriteConfig {
  // 目录
  directory: string;
  
  // 帧信息
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  
  // 动画
  animations: Record<AnimationName, AnimationFrames>;
  
  // 缩放
  scale: number;
}

type AnimationName = 'idle' | 'walk' | 'attack' | 'die' | 'spawn';

interface AnimationFrames {
  start: number;              // 起始帧
  end: number;                // 结束帧
  fps: number;
  loop: boolean;
}

// 示例
const knightSprites: SpriteConfig = {
  directory: 'assets/sc/chr_knight_out/',
  frameCount: 50,
  frameWidth: 187,
  frameHeight: 181,
  animations: {
    idle: { start: 0, end: 10, fps: 8, loop: true },
    walk: { start: 11, end: 25, fps: 12, loop: true },
    attack: { start: 26, end: 35, fps: 15, loop: false },
    die: { start: 36, end: 45, fps: 8, loop: false }
  },
  scale: 0.5
};
```

---

## 8. 渲染配置

```typescript
interface RenderConfig {
  // 缩放
  scale: number;
  
  // 偏移
  offset: Position;
  
  // 阴影
  shadow: ShadowConfig;
  
  // 血条
  healthBar: HealthBarConfig;
  
  // 层级
  zIndex: number;
}

interface ShadowConfig {
  enabled: boolean;
  offset: Position;
  color: string;
  blur: number;
}

interface HealthBarConfig {
  enabled: boolean;
  offset: Position;
  size: Size;
  colors: {
    background: string;
    health: string;
    damage: string;
  };
}
```

---

## 9. 竞技场配置

```typescript
interface ArenaConfig {
  // 尺寸
  size: Size;
  
  // 网格
  grid: GridConfig;
  
  // 河流
  river: RiverConfig;
  
  // 桥梁
  bridges: BridgeConfig[];
  
  // 塔
  towerPositions: TowerPositions;
}

interface GridConfig {
  columns: number;
  rows: number;
  tileSize: number;
}

interface RiverConfig {
  y: number;
  height: number;
  color: string;
}

interface BridgeConfig {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface TowerPositions {
  player: {
    princessLeft: Position;
    princessRight: Position;
    king: Position;
  };
  enemy: {
    princessLeft: Position;
    princessRight: Position;
    king: Position;
  };
}
```

---

## 10. 游戏事件

```typescript
interface GameEvent {
  type: GameEventType;
  timestamp: number;
  data: GameEventData;
}

type GameEventType =
  | 'card_placed'
  | 'unit_spawned'
  | 'unit_moved'
  | 'unit_attacked'
  | 'unit_died'
  | 'tower_attacked'
  | 'tower_damaged'
  | 'tower_destroyed'
  | 'elixir_changed'
  | 'time_changed'
  | 'game_started'
  | 'game_ended';

type GameEventData =
  | CardPlacedData
  | UnitSpawnedData
  | UnitMovedData
  | UnitAttackedData
  | UnitDiedData
  | TowerEventData
  | ElixirChangedData
  | TimeChangedData
  | GameEndedData;

interface CardPlacedData {
  playerId: PlayerId;
  cardId: CardId;
  position: Position;
  elixirCost: number;
}

interface UnitSpawnedData {
  unitId: UnitId;
  cardId: CardId;
  playerId: PlayerId;
  position: Position;
}

interface UnitAttackedData {
  attackerId: UnitId;
  targetId: UnitId | TowerId;
  damage: number;
}

interface GameEndedData {
  winner: PlayerId;
  reason: EndReason;
}
```

---

**状态**: ⏳ Phase 1 数据结构定义完成
**文件**: `specs/DATA-STRUCTURES.md`