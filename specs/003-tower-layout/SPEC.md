# SPEC: Clash Royale V2 - Phase 1 Spec

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 1 - Specification
**Branch**: `001-official-assets-ui`

---

## Problem Identified

**Background Image Size**: 626 x 966 px
**Canvas Size**: 506 x 832 px (WRONG - causing mismatch)

**Need to update canvas to match background!**

---

## FIXED: Arena Layout

### Canvas Dimensions (UPDATED)
- **Width**: 626 pixels
- **Height**: 966 pixels
- **Background**: `arena_background.png` (626 x 966)

### Tower Positions (UPDATED for 626x966)
| Tower ID | X | Y | Type | Team |
|----------|---|---|------|------|
| enemy-king | 313 | 200 | King | enemy |
| enemy-princess-left | 120 | 340 | Princess | enemy |
| enemy-princess-right | 506 | 340 | Princess | enemy |
| player-king | 313 | 760 | King | player |
| player-princess-left | 120 | 630 | Princess | player |
| player-princess-right | 506 | 630 | Princess | player |

### River & Bridges (UPDATED)
- River: Y = 485, Height = 50px
- Bridges: X = 156 and X = 470

### Tower Sizes
| Tower | Display Height |
|-------|---------------|
| King Tower | 140px |
| Princess | 100px |

---

## CONFIRMED ASSETS

### Arena Background
![Arena Background](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/arena_background.png)
**Size**: 626 x 966 px

### King Tower Sprite
![King Tower](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-king-1.png)
**Size**: 407 x 471 px

### Princess Sprite
![Princess](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-princess-1.png)
**Size**: 268 x 180 px

---

## Rendering Layers

```
Layer 1: Arena Background (626x966 ice arena)
Layer 2: River (procedural blue + waves)
Layer 3: Bridges (procedural wooden)
Layer 4: Towers (king + princess overlay)
Layer 5: Health Bars
```

---

## Implementation Tasks

- [ ] Update App.tsx: Canvas to 626x966
- [ ] Update tower positions for 626x966
- [ ] Update Arena.tsx: River Y to 485
- [ ] Rebuild and deploy

---

*Last updated: 2026-03-25*
*Issue: Canvas/Background dimension mismatch fixed*
