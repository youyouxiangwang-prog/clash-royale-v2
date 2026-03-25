# UI规范文档 - Clash Royale V2

## 核心需求

> **使用官方素材，UI必须像真实游戏**

---

## 1. 整体布局

### 1.1 屏幕尺寸
- **竖屏优先**: 9:16 比例
- **设计基准**: 720x1280 (移动端标准)
- **响应式**: 适配不同屏幕尺寸

### 1.2 界面层次

```
┌─────────────────────────────────────┐
│           计时器 (顶部)              │  ← Layer 4: UI顶层
├─────────────────────────────────────┤
│   圣水条  │  │  圣水条              │  ← Layer 4: UI顶层
│   (玩家)  │  │  (敌人)              │
├─────────────────────────────────────┤
│                                      │
│         敌方塔区域                   │
│    [公主塔]  [国王塔]  [公主塔]      │  ← Layer 2: 建筑
│                                      │
│         ════════════════             │  ← Layer 1: 河流
│            桥梁                      │
│         ════════════════             │
│                                      │
│         玩家塔区域                   │
│    [公主塔]  [国王塔]  [公主塔]      │  ← Layer 2: 建筑
│                                      │
├─────────────────────────────────────┤
│   [卡牌] [卡牌] [卡牌] [卡牌]        │  ← Layer 4: UI底层
│   [费用] [费用] [费用] [费用]        │
└─────────────────────────────────────┘
```

---

## 2. 竞技场 (Arena)

### 2.1 使用素材

| 素材类型 | 文件路径 | 尺寸 |
|----------|----------|------|
| 地面纹理 | `assets/sc/arena_training_tex.png` | 970x1018 |
| 地面精灵 | `assets/sc/arena_training_out/*.png` | 23个片段 |

### 2.2 渲染规范

```typescript
interface ArenaSpec {
  // 尺寸
  width: 720;           // 竞技场宽度
  height: 900;          // 竞技场高度 (不含UI)
  
  // 纹理
  texture: 'arena_training_tex.png';
  
  // 网格系统 (用于单位放置)
  grid: {
    columns: 18;        // 18列
    rows: 32;           // 32行
    tileSize: 40;       // 每格40px
  };
  
  // 河流位置
  river: {
    y: 450;             // 河流Y坐标 (中间)
    height: 60;         // 河流高度
    color: 'rgba(0, 191, 255, 0.7)';
  };
  
  // 桥梁
  bridges: [
    { x: 180, y: 450, width: 80, height: 60 },  // 左桥
    { x: 460, y: 450, width: 80, height: 60 }   // 右桥
  ];
}
```

---

## 3. 塔 (Tower)

### 3.1 使用素材

| 素材类型 | 文件路径 | 帧数 |
|----------|----------|------|
| 塔精灵图 | `assets/sc/building_tower_out/*.png` | 214帧 |
| 塔纹理 | `assets/sc/building_tower_tex.png` | - |

### 3.2 塔的类型

```typescript
interface TowerSpec {
  // 公主塔
  princess: {
    width: 80;
    height: 120;
    health: 2534;
    damage: 90;
    range: 7.5;
    attackSpeed: 0.8;   // 秒
    sprites: {
      idle: [0, 10],      // 帧0-10: 待机动画
      attack: [11, 20],   // 帧11-20: 攻击动画
      damaged: [21, 30]   // 帧21-30: 受伤动画
    }
  };
  
  // 国王塔
  king: {
    width: 100;
    height: 140;
    health: 4824;
    damage: 109;
    range: 9;
    attackSpeed: 1.0;
    sprites: {
      idle: [100, 120],
      attack: [121, 140],
      damaged: [141, 160]
    }
  };
}
```

### 3.3 塔的位置

```typescript
// 坐标系: 竞技场中心为(0,0)
const towerPositions = {
  // 敌方塔 (上方)
  enemyPrincessLeft: { x: -150, y: -300 },
  enemyPrincessRight: { x: 150, y: -300 },
  enemyKing: { x: 0, y: -380 },
  
  // 玩家塔 (下方)
  playerPrincessLeft: { x: -150, y: 300 },
  playerPrincessRight: { x: 150, y: 300 },
  playerKing: { x: 0, y: 380 }
};
```

---

## 4. 单位 (Unit)

### 4.1 使用素材

| 角色 | 文件路径 | 精灵尺寸 |
|------|----------|----------|
| Knight | `assets/sc/chr_knight_out/*.png` | 187x181 |
| Archer | `assets/sc/chr_archer_out/*.png` | 130x135 |
| Giant | `assets/sc/chr_giant_out/*.png` | 189x185 |
| Wizard | `assets/sc/chr_wizard_out/*.png` | - |
| Baby Dragon | `assets/sc/chr_baby_dragon_out/*.png` | - |

### 4.2 单位规范

```typescript
interface UnitSpec {
  id: string;
  name: string;
  
  // 属性
  health: number;
  damage: number;
  speed: number;        // 移动速度 (格/秒)
  range: number;        // 攻击范围 (格)
  attackSpeed: number;  // 攻击间隔 (秒)
  
  // 精灵
  sprites: {
    directory: string;  // 精灵目录
    frameCount: number; // 总帧数
    frameWidth: number;
    frameHeight: number;
    
    // 动画配置
    animations: {
      idle: { start: number, end: number, fps: number };
      walk: { start: number, end: number, fps: number };
      attack: { start: number, end: number, fps: number };
      die: { start: number, end: number, fps: number };
    };
  };
  
  // 渲染
  render: {
    scale: number;      // 缩放比例
    shadowOffset: { x: number, y: number };
    healthBarOffset: { x: number, y: number };
  };
}

// 示例: Knight
const knight: UnitSpec = {
  id: 'knight',
  name: 'Knight',
  health: 1432,
  damage: 160,
  speed: 1.0,
  range: 1,
  attackSpeed: 1.1,
  sprites: {
    directory: 'assets/sc/chr_knight_out/',
    frameCount: 50,  // 需要实际确认
    frameWidth: 187,
    frameHeight: 181,
    animations: {
      idle: { start: 0, end: 10, fps: 8 },
      walk: { start: 11, end: 20, fps: 12 },
      attack: { start: 21, end: 30, fps: 15 },
      die: { start: 31, end: 40, fps: 8 }
    }
  },
  render: {
    scale: 0.5,
    shadowOffset: { x: 0, y: 10 },
    healthBarOffset: { x: 0, y: -50 }
  }
};
```

---

## 5. UI元素

### 5.1 计时器

```typescript
interface TimerSpec {
  position: { x: 'center', y: 20 };
  size: { width: 120, height: 50 };
  
  // 样式
  style: {
    background: 'rgba(0, 0, 50, 0.8)';
    borderRadius: 10;
    border: '2px solid #FFD700';
    font: 'bold 24px Arial';
    color: '#FFFFFF';
  };
  
  // 行为
  duration: 180;        // 3分钟
  overtime: 60;         // 加时1分钟
}
```

### 5.2 圣水条

```typescript
interface ElixirBarSpec {
  position: {
    player: { x: 50, y: 1000 };
    enemy: { x: 670, y: 280 };
  };
  
  size: { width: 30, height: 200 };
  
  // 样式
  style: {
    background: 'rgba(50, 50, 80, 0.9)';
    barColor: '#9933FF';   // 紫色
    borderRadius: 5;
    border: '2px solid #666';
  };
  
  // 行为
  maxElixir: 10;
  regenRate: 0.14;      // 每100ms回复
  regenInterval: 100;   // 100ms更新一次
}
```

### 5.3 卡牌手牌

```typescript
interface CardHandSpec {
  position: { x: 'center', y: 1100 };
  
  cards: {
    count: 4;           // 同时显示4张
    spacing: 160;       // 卡牌间距
    size: { width: 120, height: 150 };
  };
  
  // 单张卡牌
  card: {
    background: 'url(assets/ui/card_bg.png)';
    rarityBorder: {
      common: '#808080',
      rare: '#FF8C00',
      epic: '#9933FF',
      legendary: '#FFD700'
    };
    
    // 费用徽章
    costBadge: {
      position: 'top-left';
      size: 30;
      background: '#9933FF';
      font: 'bold 16px Arial';
    };
    
    // 卡牌图片
    image: {
      position: 'center';
      size: { width: 100, height: 100 };
    };
  };
}
```

---

## 6. 精灵动画系统

### 6.1 动画管理器

```typescript
interface AnimationManager {
  // 加载精灵图
  loadSprites(unitId: string, directory: string): Promise<SpriteSheet>;
  
  // 播放动画
  playAnimation(
    unit: Unit,
    animationName: 'idle' | 'walk' | 'attack' | 'die'
  ): void;
  
  // 更新帧
  update(deltaTime: number): void;
  
  // 渲染
  render(ctx: CanvasRenderingContext2D, unit: Unit): void;
}
```

### 6.2 精灵表结构

```typescript
interface SpriteSheet {
  id: string;
  directory: string;
  frames: SpriteFrame[];
  animations: AnimationConfig[];
}

interface SpriteFrame {
  index: number;
  image: HTMLImageElement;
  width: number;
  height: number;
}

interface AnimationConfig {
  name: string;
  frames: number[];     // 帧索引数组
  fps: number;
  loop: boolean;
}
```

---

## 7. 渲染层架构

### 7.1 Canvas分层

```
Layer 0: 背景 (竞技场地面)     - 很少更新
Layer 1: 建筑 (塔)             - 偶尔更新
Layer 2: 单位                  - 频繁更新
Layer 3: 特效                  - 频繁更新
Layer 4: UI                    - 按需更新
```

### 7.2 渲染循环

```typescript
function gameLoop(timestamp: number) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  
  // 更新
  updateElixir(deltaTime);
  updateUnits(deltaTime);
  updateAnimations(deltaTime);
  
  // 渲染
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  renderArena(ctx);
  renderTowers(ctx);
  renderUnits(ctx);
  renderEffects(ctx);
  renderUI(ctx);
  
  requestAnimationFrame(gameLoop);
}
```

---

## 8. 数据结构

### 8.1 游戏状态

```typescript
interface GameState {
  // 时间
  timeRemaining: number;
  phase: 'normal' | 'overtime' | 'ended';
  
  // 玩家
  players: [Player, Player];
  
  // 单位
  units: Unit[];
  
  // 塔
  towers: Tower[];
  
  // 圣水
  elixir: [number, number];  // [玩家圣水, 敌人圣水]
}

interface Player {
  id: string;
  name: string;
  deck: Card[];
  hand: Card[];
  elixir: number;
  towers: Tower[];
}

interface Unit {
  id: string;
  spec: UnitSpec;
  playerId: string;
  position: { x: number, y: number };
  health: number;
  state: 'idle' | 'walking' | 'attacking' | 'dying';
  animation: AnimationState;
}

interface Tower {
  id: string;
  type: 'princess' | 'king';
  playerId: string;
  position: { x: number, y: number };
  health: number;
  state: 'idle' | 'attacking' | 'destroyed';
}

interface Card {
  id: string;
  name: string;
  cost: number;
  type: 'troop' | 'spell' | 'building';
  spec: UnitSpec | SpellSpec | BuildingSpec;
}
```

---

## 9. 文件结构

```
src/
├── components/
│   ├── Game/
│   │   ├── GameCanvas.tsx      # 主Canvas组件
│   │   ├── Arena.tsx           # 竞技场
│   │   ├── Tower.tsx           # 塔
│   │   └── Unit.tsx            # 单位
│   └── UI/
│       ├── Timer.tsx           # 计时器
│       ├── ElixirBar.tsx       # 圣水条
│       └── CardHand.tsx        # 卡牌手牌
│
├── engine/
│   ├── GameEngine.ts           # 游戏引擎
│   ├── AnimationManager.ts     # 动画管理
│   ├── RenderSystem.ts         # 渲染系统
│   └── UnitAI.ts               # 单位AI
│
├── data/
│   ├── cards.ts                # 卡牌数据
│   ├── units.ts                # 单位数据
│   └── sprites.ts              # 精灵配置
│
├── types/
│   ├── game.ts                 # 游戏类型
│   ├── unit.ts                 # 单位类型
│   └── animation.ts            # 动画类型
│
└── assets/
    ├── arena/                  # 竞技场素材
    ├── towers/                 # 塔素材
    ├── units/                  # 单位素材
    └── ui/                     # UI素材
```

---

## 10. Phase 1 验收标准

### 10.1 视觉要求

- [ ] 竞技场使用官方纹理
- [ ] 塔使用官方精灵图，有动画
- [ ] 单位使用官方精灵图，有动画
- [ ] UI元素布局正确
- [ ] 整体视觉效果接近真实游戏

### 10.2 技术要求

- [ ] TypeScript类型完整
- [ ] Canvas渲染流畅 (60fps)
- [ ] 精灵动画正确播放
- [ ] 组件接口清晰

---

**状态**: ⏳ Phase 1 规范文档编写中
**下一步**: 用户确认规范，然后进入 Phase 2 (Test)