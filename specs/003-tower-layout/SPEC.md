# SPEC: Clash Royale V2 - Asset Specification

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 1 - Asset Documentation
**Branch**: `001-official-assets-ui`

---

## 1. Selected Assets (CONFIRMED)

### 1.1 Background Arena (PENDING USER SELECTION)

Choose ONE of these arena backgrounds:

| Arena | File | Size | Notes |
|-------|------|------|-------|
| Barbarian | `arenas/barbarian.png` | 365KB | Current default |
| Training | `arenas/training.png` | 793KB | More structured |
| Ice | `arenas/ice.png` | 743KB | Winter theme |
| Jungle | `arenas/jungle.png` | 719KB | Forest theme |

**Preview:**
- Barbarian: ![barbarian.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/arenas/barbarian.png)
- Training: ![training.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/arenas/training.png)
- Ice: ![ice.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/arenas/ice.png)
- Jungle: ![jungle.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/arenas/jungle.png)

**⚠️ ACTION REQUIRED**: User must select ONE background.

---

### 1.2 Tower Sprites (CONFIRMED)

| Purpose | File | Source Frame |
|---------|------|-------------|
| Enemy King Tower | `tower-sprites/enemy-king-1.png` | building_tower_out frame 14 |
| Enemy King Tower Alt | `tower-sprites/enemy-king-2.png` | building_tower_out frame 98 |
| Enemy Princess | `tower-sprites/enemy-princess-1.png` | chr_princess_out frame 0 |
| Enemy Princess Alt | `tower-sprites/enemy-princess-2.png` | chr_princess_out frame 100 |

**Preview:**
- King Tower: ![enemy-king-1.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-king-1.png)
- Princess: ![enemy-princess-1.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-princess-1.png)

---

### 1.3 Decoration Sprites (TO BE SELECTED)

Decoration sprites are in: `/public/assets/game/environment/decos/`

**Available Types:**
- Trees: `level_decos_sprite_000.png` to `level_decos_sprite_015.png`
- Bushes: `level_decos_sprite_016.png` to `level_decos_sprite_040.png`
- Rocks: `level_decos_sprite_041.png` to `level_decos_sprite_060.png`
- Flowers: `level_decos_sprite_061.png` to `level_decos_sprite_080.png`

**Sample Decorations:**
- Tree: ![tree-000.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/tree-000.png)
- Bush: ![bush-016.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/bush-016.png)
- Rock: ![rock-041.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/rock-041.png)

**⚠️ DECISIONS NEEDED**:
1. Select background arena
2. Which decoration sprites to use (or none)?
3. Should decorations be symmetric?

---

### 1.4 Unit Sprites (TO BE IMPLEMENTED)

Available in `/public/assets/game/units/`:

| Unit | File | Dimensions |
|------|------|------------|
| Knight | `units/knight.png` | ~187x181 |
| Archer | `units/archer.png` | ~130x135 |
| Giant | `units/giant.png` | ~189x185 |

---

### 1.5 River & Bridges (PROCEDURAL)

**Decision**: Use procedural graphics or sprite-based?

Current implementation:
- River: Procedural blue rectangles with wave animation
- Bridges: Procedural wooden bridge (fallback)

**Alternative**: Use sprite from `level_decos_sprite_101.png` to `level_decos_sprite_106.png`

---

## 2. Arena Layout

**Canvas Size**: 506 x 832 (portrait)

### Tower Positions

| Tower ID | X | Y | Type |
|----------|---|---|------|
| enemy-king | 253 | 180 | King |
| enemy-princess-left | 100 | 280 | Princess |
| enemy-princess-right | 406 | 280 | Princess |
| player-king | 253 | 650 | King |
| player-princess-left | 100 | 552 | Princess |
| player-princess-right | 406 | 552 | Princess |

### River & Bridges

- River: Y = 416, Height = 40px
- Bridges: X = 126 and X = 380

---

## 3. Rendering Layers

```
Layer 1: Base Color (fallback)
Layer 2: Arena Background (SELECTED BACKGROUND)
Layer 3: Decorations (SELECTED SPRITES) [OPTIONAL]
Layer 4: River (procedural or sprite)
Layer 5: Bridges (procedural or sprite)
Layer 6: Units (knight, archer, giant) [FUTURE]
Layer 7: Towers (king + princess overlay)
Layer 8: Health Bars + UI
```

---

## 4. Pending Decisions

| Item | Options | Status |
|------|---------|--------|
| Background | barbarian / training / ice / jungle | ⏳ PENDING |
| Decorations | Use sprites / Use none / Use simple | ⏳ PENDING |
| River | Procedural / Sprite | ⏳ PENDING |
| Bridges | Procedural / Sprite | ⏳ PENDING |

---

## 5. Implementation Status

### Completed
- ✅ Tower positions fixed
- ✅ Tower sprites with princess overlay
- ✅ Player/enemy flip logic

### In Progress
- 🔄 Background selection (need user input)
- 🔄 Decoration selection (need user input)

### TODO
- ⏳ Implement selected background
- ⏳ Implement decorations (if selected)
- ⏳ River/Bridge implementation (procedural or sprite)
- ⏳ Unit sprites (future)

---

*Last updated: 2026-03-25*
*Awaiting: User background selection*
