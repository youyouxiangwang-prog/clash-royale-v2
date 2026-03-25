# 组件接口规范 - Clash Royale V2

## 1. GameCanvas 组件

```typescript
/**
 * 主游戏Canvas组件
 * 负责初始化Canvas、管理渲染循环
 */
interface GameCanvasProps {
  width: number;
  height: number;
  gameState: GameState;
  onUnitPlace?: (x: number, y: number) => void;
}

interface GameCanvasRef {
  getCanvas: () => HTMLCanvasElement;
  getContext: () => CanvasRenderingContext2D;
  resize: (width: number, height: number) => void;
}

// 组件签名
const GameCanvas: React.ForwardRefExoticComponent<
  GameCanvasProps & React.RefAttributes<GameCanvasRef>
>;
```

---

## 2. Arena 组件

```typescript
/**
 * 竞技场渲染
 * 负责绘制地面、河流、桥梁
 */
interface ArenaRenderer {
  // 初始化
  init(ctx: CanvasRenderingContext2D): Promise<void>;
  
  // 加载纹理
  loadTexture(src: string): Promise<HTMLImageElement>;
  
  // 渲染
  render(ctx: CanvasRenderingContext2D): void;
  
  // 配置
  config: ArenaConfig;
}

interface ArenaConfig {
  width: number;
  height: number;
  texture: string;          // 纹理路径
  grid: GridConfig;
  river: RiverConfig;
  bridges: BridgeConfig[];
}
```

---

## 3. Tower 组件

```typescript
/**
 * 塔渲染
 * 负责绘制塔精灵、血条、动画
 */
interface TowerRenderer {
  // 初始化
  init(ctx: CanvasRenderingContext2D): Promise<void>;
  
  // 加载精灵
  loadSprites(directory: string): Promise<SpriteSheet>;
  
  // 更新
  update(tower: Tower, deltaTime: number): void;
  
  // 渲染
  render(ctx: CanvasRenderingContext2D, tower: Tower): void;
  
  // 播放动画
  playAnimation(towerId: string, animation: TowerAnimation): void;
}

type TowerAnimation = 'idle' | 'attack' | 'damaged' | 'destroyed';

interface TowerRenderState {
  currentFrame: number;
  animation: TowerAnimation;
  animationTime: number;
  healthBarVisible: boolean;
}
```

---

## 4. Unit 组件

```typescript
/**
 * 单位渲染
 * 负责绘制单位精灵、血条、动画、移动
 */
interface UnitRenderer {
  // 初始化
  init(ctx: CanvasRenderingContext2D): Promise<void>;
  
  // 注册单位类型
  registerUnitType(spec: UnitSpec): void;
  
  // 更新所有单位
  updateAll(units: Unit[], deltaTime: number): void;
  
  // 渲染所有单位
  renderAll(ctx: CanvasRenderingContext2D, units: Unit[]): void;
  
  // 单个单位操作
  spawn(spec: UnitSpec, position: Position, playerId: string): Unit;
  despawn(unitId: string): void;
  playAnimation(unitId: string, animation: UnitAnimation): void;
}

type UnitAnimation = 'idle' | 'walk' | 'attack' | 'die';

interface UnitRenderState {
  currentFrame: number;
  animation: UnitAnimation;
  animationTime: number;
  facingLeft: boolean;
}
```

---

## 5. Timer 组件

```typescript
/**
 * 计时器UI
 * 显示剩余时间
 */
interface TimerProps {
  timeRemaining: number;      // 秒
  isOvertime: boolean;
  onTimeEnd?: () => void;
}

interface TimerRenderOptions {
  position: Position;
  style: TimerStyle;
}

interface TimerStyle {
  background: string;
  borderRadius: number;
  border: string;
  font: string;
  color: string;
}
```

---

## 6. ElixirBar 组件

```typescript
/**
 * 圣水条UI
 * 显示当前圣水值
 */
interface ElixirBarProps {
  elixir: number;             // 当前圣水 (0-10)
  maxElixir: number;          // 最大圣水
  isPlayer: boolean;          // 是否是玩家
  position: Position;
}

interface ElixirBarRenderOptions {
  style: ElixirBarStyle;
  animated: boolean;          // 是否有动画
}

interface ElixirBarStyle {
  background: string;
  barColor: string;
  borderRadius: number;
  border: string;
}
```

---

## 7. CardHand 组件

```typescript
/**
 * 卡牌手牌UI
 * 显示当前可用的卡牌
 */
interface CardHandProps {
  cards: Card[];              // 4张手牌
  selectedCard: Card | null;
  elixir: number;             // 当前圣水
  onCardSelect: (card: Card) => void;
  onCardHover: (card: Card | null) => void;
}

interface CardComponentProps {
  card: Card;
  isSelected: boolean;
  canAfford: boolean;         // 是否买得起
  onClick: () => void;
  onHover: () => void;
}

interface CardRenderOptions {
  size: Size;
  position: Position;
  style: CardStyle;
}

interface CardStyle {
  background: string;
  rarityBorder: Record<Rarity, string>;
  costBadge: BadgeStyle;
  image: ImageStyle;
}

type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
```

---

## 8. AnimationManager 接口

```typescript
/**
 * 动画管理器
 * 管理所有精灵动画
 */
interface AnimationManager {
  // 初始化
  init(): Promise<void>;
  
  // 加载精灵表
  loadSpriteSheet(config: SpriteSheetConfig): Promise<SpriteSheet>;
  
  // 创建动画实例
  createAnimation(sheetId: string, animationName: string): Animation;
  
  // 更新所有动画
  update(deltaTime: number): void;
  
  // 获取当前帧
  getCurrentFrame(animationId: string): SpriteFrame;
}

interface SpriteSheetConfig {
  id: string;
  directory: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animations: Record<string, AnimationConfig>;
}

interface AnimationConfig {
  frames: number[];           // 帧索引
  fps: number;
  loop: boolean;
}

interface Animation {
  id: string;
  sheet: SpriteSheet;
  config: AnimationConfig;
  currentFrameIndex: number;
  time: number;
  playing: boolean;
}
```

---

## 9. RenderSystem 接口

```typescript
/**
 * 渲染系统
 * 管理渲染循环和分层
 */
interface RenderSystem {
  // 初始化
  init(canvas: HTMLCanvasElement): void;
  
  // 注册渲染器
  registerRenderer(layer: number, renderer: Renderer): void;
  
  // 渲染循环
  start(): void;
  stop(): void;
  
  // 渲染一帧
  render(timestamp: number): void;
  
  // 获取上下文
  getContext(): CanvasRenderingContext2D;
}

interface Renderer {
  id: string;
  layer: number;
  update(deltaTime: number): void;
  render(ctx: CanvasRenderingContext2D): void;
}
```

---

## 10. GameEngine 接口

```typescript
/**
 * 游戏引擎
 * 管理游戏状态和逻辑
 */
interface GameEngine {
  // 初始化
  init(canvas: HTMLCanvasElement): Promise<void>;
  
  // 游戏控制
  start(): void;
  pause(): void;
  resume(): void;
  reset(): void;
  
  // 状态
  getState(): GameState;
  setState(state: Partial<GameState>): void;
  
  // 操作
  placeCard(card: Card, position: Position): boolean;
  selectCard(card: Card): void;
  
  // 事件
  on(event: GameEvent, callback: Function): void;
  off(event: GameEvent, callback: Function): void;
}

type GameEvent = 
  | 'gameStart'
  | 'gameEnd'
  | 'cardPlaced'
  | 'unitSpawned'
  | 'unitDied'
  | 'towerDestroyed'
  | 'elixirChanged'
  | 'timeChanged';
```

---

## 接口依赖关系

```
GameEngine
    ├── GameState
    ├── RenderSystem
    │   ├── ArenaRenderer
    │   ├── TowerRenderer
    │   ├── UnitRenderer
    │   └── UIRenderer
    │       ├── Timer
    │       ├── ElixirBar
    │       └── CardHand
    └── AnimationManager
        └── SpriteSheet[]
```

---

**状态**: ⏳ Phase 1 规范文档完成
**下一步**: 用户确认规范