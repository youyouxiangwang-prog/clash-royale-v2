# SPEC: Clash Royale V2 - Phase 1 Spec

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 1 - Research & Specification
**Branch**: `001-official-assets-ui`

---

## Research Findings

### CORRECT Background Found
- **File**: `ui_arena_tex.png` (NOT the ice arena texture!)
- **Size**: 1792 x 2976 pixels (FULL ARENA)
- **Source**: `research/reference-assets/assets/sc/ui_arena_tex.png`

![Full Arena Background](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/arena_background_full.png)

### Tower Sprites
| Sprite | File | Dimensions |
|--------|------|------------|
| King Tower | `enemy-king-1.png` | 407 x 471 px |
| Princess | `enemy-princess-1.png` | 268 x 180 px |

---

## Arena Dimensions (FINAL)

**Canvas Size**: 1792 x 2976 pixels (matching full background)

### Arena Zones (from top to bottom)
```
Y: 0-600        → Enemy Territory
Y: 600-900       → Enemy Princess Towers area
Y: 900           → Enemy King Tower
Y: 900-1400      → Enemy Lane
Y: 1400-1576     → River Bank
Y: 1488          → RIVER CENTER
Y: 1576-1750     → River Bank  
Y: 1750-2100     → Player Lane
Y: 2100          → Player King Tower
Y: 2100-2400     → Player Princess Towers area
Y: 2400-2976     → Player Territory
```

### Tower Positions (to be verified visually)
| Tower | X | Y | Notes |
|-------|---|---|-------|
| Enemy King | 896 (center) | 900 | Top center |
| Enemy Princess L | 300 | 750 | Top left |
| Enemy Princess R | 1492 | 750 | Top right |
| Player King | 896 (center) | 2100 | Bottom center |
| Player Princess L | 300 | 1950 | Bottom left |
| Player Princess R | 1492 | 1950 | Bottom right |

### River & Bridges
- River: Y = 1488, Height = 176px
- Bridges: X = 448 and X = 1344

---

## Next Steps

1. ✅ Research complete - found correct background
2. ⏳ Need to verify tower positions visually
3. ⏳ Implement with correct dimensions

---

*Last updated: 2026-03-25*
*Issue: Was using texture tile instead of full arena background*
