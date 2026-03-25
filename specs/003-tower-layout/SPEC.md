# SPEC: Tower Layout Fix

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Feature**: Correct Tower Placement and Unit Positioning
**Status**: Phase 0 - Specification

---

## 1. Problem Statement

Current implementation has:
- Tower positions incorrectly scaled from 800x600 to 506x832
- No correlation with actual arena layout
- Decorations placed randomly without proper spacing
- River and bridge positions not aligned with towers

---

## 2. Arena Layout Reference

### Canvas Dimensions
- **Width**: 506 pixels
- **Height**: 832 pixels
- **Orientation**: Portrait (竖屏)

### Arena Zones (from top to bottom)
```
Y: 0-180      → Enemy Territory
Y: 180-280    → Enemy Princess Towers
Y: 180        → Enemy King Tower (centered)
Y: 280-380    → Enemy Lane Area
Y: 380-452    → River Bank (north)
Y: 416        → RIVER CENTER LINE
Y: 452-524    → River Bank (south)
Y: 552-652    → Player Lane Area
Y: 552        → Player Princess Towers
Y: 580-650    → Player King Tower (centered)
Y: 652-832    → Player Territory
```

### River Configuration
- **Position**: Y = 416 (center)
- **Height**: 40 pixels (Y: 396-436)
- **Bridges**: X = 126 and X = 380

### Tower Positions (FIXED)

| Tower ID | X | Y | Type |
|----------|---|---|------|
| enemy-king | 253 | 180 | King |
| enemy-princess-left | 100 | 280 | Princess |
| enemy-princess-right | 406 | 280 | Princess |
| player-king | 253 | 650 | King |
| player-princess-left | 100 | 552 | Princess |
| player-princess-right | 406 | 552 | Princess |

---

## 3. Available Assets

### Tower Sprites
| Asset | Path | Dimensions | Notes |
|-------|------|-----------|-------|
| King Tower | `/assets/game/tower.png` | 407x471 | Single tower sprite |
| Building Tower Tex | `/assets/game/building_tower_tex.png` | 1982x2542 | Texture atlas (NOT USED) |
| Tower Animation | `building_tower_out/*.png` | 407x471 | 214 animation frames |
| Princess Tower | `chr_princess_out/*.png` | ? | 748 frames! |

### ⚠️ Tower Sprite Analysis

**问题：当前只有一个 `tower.png`**

真实 Clash Royale 中敌方塔和我方塔的视角不同：
- **敌方塔**：玩家从外部看，看到塔的正面（有炮口朝向玩家）
- **我方塔**：玩家从内部看，看到塔的背面（无炮口可见）

**当前解决方案：**
- 使用同一张 `tower.png`
- 敌方塔：正常显示
- 我方塔：水平翻转 (`ctx.scale(-1, 1)`)

---

## 3.1 Tower Sprite Images

### 当前使用的 Tower Sprite (tower.png)
![tower-main.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/tower-main.png)

### 塔动画帧 - 帧 014 (building_tower_out/)
![anim-014.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/anim-014.png)

### 塔动画帧 - 帧 098
![anim-098.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/anim-098.png)

### 塔动画帧 - 帧 197 (最后几帧之一)
![anim-197.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/anim-197.png)

### 公主塔精灵 - 帧 000 (chr_princess_out/)
![princess-000.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/princess-000.png)

### 公主塔精灵 - 帧 014
![princess-014.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/princess-014.png)

### 公主塔精灵 - 帧 100
![princess-100.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/princess-100.png)

---

## 4. Unit Sprites

| Unit | Path | Dimensions |
|------|------|------------|
| Knight | `/assets/game/units/knight.png` | ~187x181 |
| Archer | `/assets/game/units/archer.png` | ~130x135 |
| Giant | `/assets/game/units/giant.png` | ~189x185 |

## 5. Environment

| Element | Path | Notes |
|---------|------|-------|
| Arena Background | `/assets/game/arena_background.png` | 506x832 |
| Decorations | `/assets/game/environment/decos/level_decos_sprite_XXX.png` | 107 sprites |

---

## 6. Rendering Layers (Final)

```
Layer 1: Base Color (#3d6b41)
    ↓
Layer 2: Arena Background (506x832 texture)
    ↓
Layer 3: Decorations (trees, bushes, rocks)
    ↓
Layer 4: River Water (procedural blue + waves)
    ↓
Layer 5: Bridges (sprite 101-106)
    ↓
Layer 6: Units (knight, archer, giant)
    ↓
Layer 7: Towers (king + princess)
    ↓
Layer 8: Health Bars + UI
```

---

## 7. Decoration Placement (FIXED)

### Placement Rules
- Trees in corners only (X < 80 or X > 426, Y < 120 or Y > 712)
- Bushes along edges, away from lanes
- Rocks scattered in territory zones
- NO decoration in:
  - River zone (Y: 396-436)
  - Bridge zones (X: 76-176 and X: 330-430 when Y: 396-436)
  - Tower zones (within 60px of any tower)

### Decoration Positions
```
Corner Trees (symmetric):
  - (45, 65), (80, 45), (35, 105)  ← enemy corners
  - (45, 767), (80, 787), (35, 727) ← player corners

Edge Bushes:
  - (90, 150), (140, 180)  ← enemy side
  - (90, 682), (140, 652)  ← player side

Scattered Rocks:
  - (110, 250), (150, 300) ← enemy territory
  - (110, 582), (150, 532) ← player territory
```

---

## 8. Implementation Checklist

### Phase 1: Tower Fix
- [ ] Update App.tsx with correct tower positions (table above)
- [ ] Verify tower sprite loads correctly
- [ ] Test tower rendering at correct positions

### Phase 2: Decoration Fix
- [ ] Update EnvironmentRenderer.ts decoration positions
- [ ] Ensure no decoration overlaps river or towers
- [ ] Verify symmetric placement

### Phase 3: Layer Verification
- [ ] Confirm all 8 layers render in correct order
- [ ] Verify no z-index issues
- [ ] Test on different screen sizes

### Phase 4: Final Polish
- [ ] Add unit sprite support
- [ ] Verify health bars display correctly
- [ ] Performance check (60fps)

---

## 9. File Changes Required

| File | Changes |
|------|---------|
| `src/App.tsx` | Hardcode tower positions for 506x832 |
| `src/engine/EnvironmentRenderer.ts` | Update decoration positions |
| `src/engine/types/environment.ts` | May need updated avoid zones |

---

## 10. Acceptance Criteria

1. ✅ 6 towers visible at correct positions (3 enemy top, 3 player bottom)
2. ✅ King tower in center, princess towers on sides
3. ✅ River runs horizontally at Y=416
4. ✅ Two bridges at X=126 and X=380 crossing river
5. ✅ Decorations only in corner/edge areas, symmetric
6. ✅ No decoration overlapping towers or river
7. ✅ All sprites loading and displaying correctly
8. ✅ Consistent 60fps performance
9. ⚠️ Player vs Enemy tower differentiation (flip or different sprite)

---

## 11. Questions for Confirmation

1. **Tower Sprite**: Is `tower.png` suitable for both enemy and player towers?
   - Should we use horizontal flip for player towers?
2. **Princess vs King**: Are princess towers visually different from king towers?
   - Should we use `chr_princess_out/` frames instead?
3. **Animation**: Should towers animate using the 214/748 frame sequences?
   - Current: Static sprite only

---

*Last updated: 2026-03-25*
