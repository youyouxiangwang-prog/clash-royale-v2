# SPEC: Clash Royale V2 - Implementation Spec

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 2 - Implementation
**Branch**: `001-official-assets-ui`

---

## 1. CONFIRMED ASSETS

### 1.1 Arena Background
- **Selected**: `level_ice_arena_tex_.png` (422KB)
- **Path**: `/assets/game/official-arena/ice-full.png`
- **Source**: `research/reference-assets/assets/sc/level_ice_arena_tex_.png`

### 1.2 Tower Sprites
| Purpose | File | Source |
|---------|------|--------|
| King Tower | `tower-sprites/enemy-king-1.png` | building_tower_out frame 14 |
| Princess | `tower-sprites/enemy-princess-1.png` | chr_princess_out frame 0 |

### 1.3 Decoration Sprites (OPTIONAL)
Available in: `/assets/game/environment/decos/level_decos_sprite_XXX.png`
- Trees: 000-015
- Bushes: 016-040
- Rocks: 041-060

---

## 2. Arena Layout (506x832)

### Tower Positions
| Tower ID | X | Y | Type | Team |
|----------|---|---|------|------|
| enemy-king | 253 | 180 | King | enemy |
| enemy-princess-left | 100 | 280 | Princess | enemy |
| enemy-princess-right | 406 | 280 | Princess | enemy |
| player-king | 253 | 650 | King | player |
| player-princess-left | 100 | 552 | Princess | player |
| player-princess-right | 406 | 552 | Princess | player |

### River & Bridges
- River: Y = 416, Height = 40px
- Bridges: X = 126 and X = 380

---

## 3. Rendering Layers

```
Layer 1: Arena Background (ice-full.png)
Layer 2: Decoration Sprites (OPTIONAL)
Layer 3: River (procedural blue + waves)
Layer 4: Bridges (procedural or sprite)
Layer 5: Units (future)
Layer 6: Towers (king + princess overlay)
Layer 7: Health Bars + UI
```

---

## 4. Implementation Tasks

### Phase 1: Background (TODO)
- [ ] Copy `level_ice_arena_tex_.png` to `public/assets/game/`
- [ ] Update EnvironmentRenderer to use this background
- [ ] Verify correct aspect ratio (may need cropping)

### Phase 2: Tower Rendering (DONE)
- [x] Tower positions fixed
- [x] Tower sprites with princess overlay
- [x] Player/enemy flip logic

### Phase 3: River & Bridges (TODO)
- [ ] River: Keep procedural or use sprite?
- [ ] Bridges: Keep procedural or use sprite?

### Phase 4: Decorations (TODO)
- [ ] Add decoration sprites at edges
- [ ] Symmetric placement

---

## 5. File Changes Required

| File | Changes |
|------|---------|
| `src/engine/EnvironmentRenderer.ts` | Use ice-full.png as background |
| `public/assets/game/arena_background.png` | Replace with ice arena |

---

*Last updated: 2026-03-25*
*CONFIRMED: Using ice arena background*
