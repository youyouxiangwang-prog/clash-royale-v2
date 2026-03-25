# Deep Research Report - Phase 0

## 研究目标
研究现有 Clash Royale 克隆项目的实现方式，重点关注 UI/UX

---

## 参考项目分析

### 1. kylemath/ClashRoyale (⭐⭐⭐⭐⭐ 最佳参考)

**GitHub**: https://github.com/kylemath/ClashRoyale  
**Live Demo**: https://kylemath.github.io/ClashRoyale  
**已克隆到**: `research/reference-kylemath/`

#### 技术栈
- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: CSS3 (纯CSS，不用Canvas!)
- **Animation**: Framer Motion
- **Backend**: Node.js + Express + Socket.io
- **State**: React useState

#### 项目结构
```
src/
├── components/
│   ├── Arena.tsx        # 竞技场 (CSS渲染!)
│   ├── GameBoard.tsx    # 游戏主逻辑
│   ├── CardComponent.tsx # 卡牌组件
│   ├── PlayerInfo.tsx   # 玩家信息
│   └── GameLobby.tsx    # 游戏大厅
├── engine/
│   └── GameEngine.ts    # 游戏引擎
├── data/
│   ├── cards.ts         # 卡牌数据
│   └── sprites.ts       # 精灵图配置
├── ai/
│   ├── AIOpponent.ts    # AI对手
│   └── UnitAI.ts        # 单位AI
├── types/
│   └── game.ts          # 类型定义
└── App.css              # 所有样式 (19KB)
```

#### 关键发现：渲染方式

**🔴 重要：使用纯 CSS 渲染，不是 Canvas！**

```css
/* 竞技场 - 700x500px */
.arena {
  background: linear-gradient(135deg, #87CEEB 0%, #98FB98 50%, #87CEEB 100%);
  border-radius: 15px;
  border: 3px solid #8B4513;
}

/* 草地 */
.arena-grass {
  background: radial-gradient(...);
}

/* 河流 */
.arena-river {
  height: 10%;
  background: linear-gradient(90deg, rgba(0, 191, 255, 0.8)...);
}

/* 桥梁 */
.arena-bridge {
  background: linear-gradient(90deg, #8B4513 0%, #A0522D 20%...);
}

/* 公主塔 - 40x40px 圆形 */
.tower {
  width: 40px;
  height: 40px;
  background: linear-gradient(45deg, #696969, #A9A9A9);
  border: 3px solid #2F4F4F;
  border-radius: 50%;
}

/* 国王塔 - 60x60px 圆形 */
.king-tower {
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #FFD700, #FFA500);
  border: 4px solid #B8860B;
  border-radius: 50%;
}
```

---

### 2. 精灵图系统

**文件**: `data/sprites.ts`

```typescript
// 精灵图配置
const SPRITE_WIDTH = 166;
const SPRITE_HEIGHT = 200;
const SHEET_WIDTH = 1000;  // 5列
const SHEET_HEIGHT = 1000; // 6行

// 单位精灵位置
const SPRITE_POSITIONS = {
  'archers': { row: 0, col: 0 },
  'giant': { row: 0, col: 1 },
  'knight': { row: 0, col: 2 },
  'wizard': { row: 0, col: 3 },
  // ... 共 30 个精灵
};
```

**单位渲染**:
- 使用 CSS background-position 从精灵图裁剪
- 每个单位有 idle/moving 动画状态

---

### 3. 卡牌系统

**文件**: `data/cards.ts`

```typescript
export const CARDS: Card[] = [
  {
    id: 'knight',
    name: 'Knight',
    cost: 3,
    type: 'troop',
    health: 1000,
    damage: 100,
    speed: 1.2,
    range: 1,
    image: '/cards/knight.png'
  },
  // ... 更多卡牌
];
```

---

### 4. UI组件架构

#### Arena.tsx
```tsx
const Arena = ({ arena, onTileClick, selectedCard, currentPlayer }) => {
  return (
    <div className="arena">
      {/* 背景: 草地、河流、桥梁 */}
      <div className="arena-background">...</div>
      
      {/* 交互网格: 10x18 */}
      <div className="arena-grid">
        {arena.map((row, y) => 
          row.map((tile, x) => (
            <div className="arena-tile" onClick={() => onTileClick(x, y)}>
              {/* 单位 */}
              {tile.unit && <div className="unit-sprite">...</div>}
            </div>
          ))
        )}
      </div>
      
      {/* 塔 */}
      <div className="arena-towers">...</div>
      <div className="arena-king-towers">...</div>
    </div>
  );
};
```

#### GameBoard.tsx
- 状态管理: GameState (玩家、圣水、时间、竞技场)
- 游戏循环: setInterval 100ms
- 圣水回复: 0.14/100ms = 1.4/秒
- AI对手: 根据难度做决策

---

## 技术决策

### 渲染方式对比

| 方式 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| **纯CSS** | 简单、响应式、易维护 | 复杂动画难做 | ⭐⭐⭐⭐⭐ |
| Canvas | 性能好、灵活 | 复杂、难调试 | ⭐⭐⭐ |
| WebGL | 3D效果 | 过于复杂 | ⭐⭐ |

### 推荐技术方案

**✅ 方案: React + TypeScript + CSS (不用Canvas)**

理由:
1. 参考项目成功验证
2. CSS足够实现所需UI
3. 更简单、更易维护
4. 响应式设计更容易

---

## UI设计规范

### 竞技场尺寸
- 宽度: 700px
- 高度: 500px
- 网格: 10列 x 18行

### 塔的尺寸
- 公主塔: 40x40px (圆形)
- 国王塔: 60x60px (圆形)

### 颜色方案
```css
/* 背景 */
grass: linear-gradient(135deg, #87CEEB, #98FB98)
river: rgba(0, 191, 255, 0.8)
bridge: #8B4513 (棕色)

/* 塔 */
princess-tower: linear-gradient(45deg, #696969, #A9A9A9)
king-tower: linear-gradient(45deg, #FFD700, #FFA500)

/* 玩家颜色 */
player: #4CAF50 (绿色)
enemy: #F44336 (红色)
```

### 单位渲染
- 使用精灵图 (1000x1000, 5x6=30个精灵)
- 每个精灵: 166x200px
- 有血条显示

---

## 实现步骤建议

### Phase 1: Spec (写规范)
1. 定义组件接口
2. 定义数据结构
3. 定义样式规范

### Phase 2: Test (写测试)
1. 组件渲染测试
2. 交互测试

### Phase 3: Implementation (写代码)
1. 搭建项目结构
2. 实现CSS样式
3. 实现组件
4. 添加精灵图

---

## 素材需求

### 必须素材
1. **单位精灵图** - 1000x1000px, 5x6网格
2. **卡牌图片** - 每张卡牌一张图
3. **塔的样式** - 用CSS实现，不需要图片

### 可选素材
1. 背景纹理
2. 粒子效果
3. 音效

---

## 与之前实现的关键差异

| 方面 | 之前做的 | 正确做法 |
|------|----------|----------|
| 渲染 | Canvas/WebGL | **纯CSS** |
| 塔 | 3D几何体 | **CSS圆形** |
| 单位 | 胶囊体 | **精灵图** |
| 复杂度 | 高 | **低** |

---

## 结论

**核心技术决策**:
- ✅ 使用纯 CSS 渲染UI (不用Canvas/WebGL)
- ✅ 使用 React + TypeScript
- ✅ 使用 Framer Motion 做动画
- ✅ 精灵图系统渲染单位

**下一步**: Phase 1 (Spec Phase) - 写详细规范文档

---

*研究完成时间: 2026-03-25*  
*状态: ✅ Phase 0 完成，等待用户确认进入 Phase 1*