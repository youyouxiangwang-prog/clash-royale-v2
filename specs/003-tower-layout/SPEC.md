# SPEC: Tower Layout Fix

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Feature**: Correct Tower Placement and Unit Positioning
**Status**: Phase 1 - Specification Confirmed

---

## 1. Tower Sprite Strategy (CONFIRMED)

### 4 Key Tower Sprites (Keep These)

| Sprite | File | Usage |
|--------|------|-------|
| Enemy King Tower | `anim-014.png` (frame 14) | Enemy king tower |
| Enemy King Tower Alt | `anim-098.png` (frame 98) | Enemy king tower (alternate) |
| Enemy Princess | `princess-000.png` (frame 0) | Enemy princess tower sprite |
| Enemy Princess Alt | `princess-100.png` (frame 100) | Enemy princess tower sprite |

### Player vs Enemy Towers

| Tower Type | Enemy | Player |
|------------|-------|--------|
| King Tower | `anim-014.png` (normal) | Same sprite + **horizontal flip** |
| Princess Tower | `princess-000.png` (normal) | Same sprite + **horizontal flip** |

**Rendering:**
- Enemy towers: Draw sprite normally
- Player towers: Draw sprite with `ctx.scale(-1, 1)` for horizontal mirror

### Princess Overlay

Princess sprite should be **drawn on top of** the tower sprite, slightly offset upward.

**Composite Tower = King Tower Base + Princess Overlay**

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

## 3. Sprite Asset Paths

### Tower Sprites (in public/assets/game/)
```
tower-sprites/
├── enemy-king-1.png    (anim-014.png) - Enemy King Tower frame 14
├── enemy-king-2.png    (anim-098.png) - Enemy King Tower frame 98
├── enemy-princess-1.png (princess-000.png) - Enemy Princess frame 0
└── enemy-princess-2.png (princess-100.png) - Enemy Princess frame 100
```

### Unit Sprites
| Unit | Path |
|------|------|
| Knight | `/assets/game/units/knight.png` |
| Archer | `/assets/game/units/archer.png` |
| Giant | `/assets/game/units/giant.png` |

---

## 4. Rendering Layers

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
Layer 7: Tower Base (king tower sprite)
    ↓
Layer 8: Princess Overlay (princess sprite on top of tower)
    ↓
Layer 9: Health Bars + UI
```

---

## 5. Implementation Tasks

### Task 1: Copy & Rename Tower Sprites
- [ ] Copy `anim-014.png` → `enemy-king-1.png`
- [ ] Copy `anim-098.png` → `enemy-king-2.png`
- [ ] Copy `princess-000.png` → `enemy-princess-1.png`
- [ ] Copy `princess-100.png` → `enemy-princess-2.png`

### Task 2: Update Tower Rendering
- [ ] Modify `Tower.tsx` to support player/enemy flip
- [ ] Add princess overlay rendering
- [ ] Composite: draw tower base, then princess on top

### Task 3: Update Tower Positions
- [ ] Fix App.tsx with correct 506x832 positions
- [ ] Update bridge positions: X = 126 and X = 380

### Task 4: Decoration Placement
- [ ] Fix EnvironmentRenderer.ts decoration positions
- [ ] Ensure symmetric placement
- [ ] No overlap with river/towers

---

## 6. Acceptance Criteria

1. ✅ Enemy towers render with normal orientation
2. ✅ Player towers render with horizontal flip
3. ✅ Princess sprite visible on top of tower sprite
4. ✅ 6 towers at correct positions
5. ✅ River at Y=416 with bridges at X=126, X=380
6. ✅ Decorations symmetric and non-overlapping

---

*Last updated: 2026-03-25*
*Status: SPEC CONFIRMED by user*
