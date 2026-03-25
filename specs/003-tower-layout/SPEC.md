# SPEC: Clash Royale V2 - Phase 1 Spec

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 1 - Specification
**Branch**: `001-official-assets-ui`

---

## Phase 0: Deep Research Summary

### Research Completed
- Found official sprite resources in `research/reference-assets/assets/sc/`
- Identified tower sprites: `building_tower_out/`, `chr_princess_out/`
- Identified arena backgrounds: multiple arena textures available
- Selected ice arena: `level_ice_arena_tex_.png`

---

## Phase 1: Specification (Current Phase)

### 1. CONFIRMED ASSETS (with images)

#### Arena Background
![Arena Background](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/arena_background.png)
**File**: `arena_background.png` (ice arena)
**Status**: ✅ CONFIRMED

#### King Tower Sprite
![King Tower](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-king-1.png)
**File**: `tower-sprites/enemy-king-1.png`
**Dimensions**: 407 x 471 px
**Status**: ✅ CONFIRMED

#### Princess Sprite
![Princess](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-princess-1.png)
**File**: `tower-sprites/enemy-princess-1.png`
**Dimensions**: 268 x 180 px
**Status**: ✅ CONFIRMED

#### Decoration Sprites (Samples)
| Type | Sample | Range |
|------|--------|-------|
| Tree | ![Tree](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/tree-000.png) | 000-015 |
| Bush | ![Bush](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/bush-016.png) | 016-040 |
| Rock | ![Rock](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/docs/decorations/rock-041.png) | 041-060 |

---

### 2. Arena Layout (506x832 portrait)

#### Tower Positions (FIXED)
| Tower ID | X | Y | Type | Team |
|----------|---|---|------|------|
| enemy-king | 253 | 180 | King | enemy |
| enemy-princess-left | 100 | 280 | Princess | enemy |
| enemy-princess-right | 406 | 280 | Princess | enemy |
| player-king | 253 | 650 | King | player |
| player-princess-left | 100 | 552 | Princess | player |
| player-princess-right | 406 | 552 | Princess | player |

#### River & Bridges
- River: Y = 416, Height = 40px
- Bridges: X = 126 and X = 380

---

### 3. Tower Size Calculation

#### Problem
- Current display size: 60px (too small)
- Sprite dimensions: 407x471px

#### Recommended Sizes
| Tower | Display Height | Scale | Rationale |
|-------|---------------|-------|-----------|
| King Tower | **140px** | ~30% | ~17% of 832px arena |
| Princess | **100px** | ~56% | Overlay on tower top |

---

### 4. Rendering Layers

```
Layer 1: Arena Background (ice arena texture)
Layer 2: River (procedural blue + waves)
Layer 3: Bridges (procedural wooden)
Layer 4: Towers (king base + princess overlay)
Layer 5: Health Bars
```

**Note**: Units NOT in scope

---

### 5. Implementation Tasks

#### Task 1: Tower Size Fix
- [ ] Update King tower height: 60px → 140px
- [ ] Update Princess height: 40px → 100px
- [ ] Adjust princess overlay position
- [ ] Update health bar positions

#### Task 2: River & Bridges
- [ ] River: procedural (current implementation OK)
- [ ] Bridges: procedural (current implementation OK)

#### Task 3: Decorations (Optional)
- [ ] Add edge decorations if needed

---

### 6. Acceptance Criteria

1. ✅ Arena background: ice arena texture
2. ✅ 6 towers at correct positions (3 enemy, 3 player)
3. ✅ King tower height: 140px
4. ✅ Princess overlay: 100px height
5. ✅ Player towers: horizontal flip
6. ✅ River at Y=416
7. ✅ Bridges at X=126, X=380
8. ✅ No units (out of scope)
9. ✅ Health bars visible

---

## Phase 2: Test Phase
**Status**: TODO
**Command**: `opencode run 'Write tests for Tower size adjustment'`

## Phase 3: Implementation Phase
**Status**: TODO
**Command**: `opencode run 'Update Tower.tsx with 140px king and 100px princess sizes'`

---

## File Changes Required

| File | Change |
|------|--------|
| `src/components/game/Tower.tsx` | Update tower sizes |
| `src/components/game/Arena.tsx` | May need position adjustments |

---

*Last updated: 2026-03-25*
*Process: Following AGENTS.md Phase 0-3*
