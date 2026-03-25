# SPEC: Clash Royale V2 - Asset Specification

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Status**: Phase 1 - Asset Review
**Branch**: `001-official-assets-ui`

---

## 1. Official 2D Sprite Resources Found

### 1.1 UI Arena Sprites (`ui_arena_out/`)

154 official UI arena sprites - likely contains arena tiles, bridges, decorations.

**Preview:**
- frame-000: ![frame-000](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/ui-arena/frame-000.png)
- frame-050: ![frame-050](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/ui-arena/frame-050.png)
- frame-075: ![frame-075](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/ui-arena/frame-075.png)

**Full list**: `research/reference-assets/assets/sc/ui_arena_out/ui_arena_sprite_000.png` to `ui_arena_sprite_153.png`

---

### 1.2 Arena Training Sprites (`arena_training_out/`)

23 training arena sprites.

**Preview:**
- frame-00: ![frame-00](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/arena-training/frame-00.png)
- frame-05: ![frame-05](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/arena-training/frame-05.png)

**Full list**: `research/reference-assets/assets/sc/arena_training_out/arena_training_sprite_00.png` to `arena_training_sprite_22.png`

---

### 1.3 Barbarian Arena Sprites (`level_barbarian_arena_out/`)

Barbarian arena sprites.

**Preview:**
- frame-00: ![frame-00](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/barbarian-arena/frame-00.png)
- frame-05: ![frame-05](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/barbarian-arena/frame-05.png)

**Full list**: `research/reference-assets/assets/sc/level_barbarian_arena_out/level_barbarian_arena_sprite_00.png` to `level_barbarian_arena_sprite_XX.png`

---

## 2. Tower Sprites (CONFIRMED)

| Purpose | File | Source Frame |
|---------|------|-------------|
| Enemy King Tower | `tower-sprites/enemy-king-1.png` | building_tower_out frame 14 |
| Enemy Princess | `tower-sprites/enemy-princess-1.png` | chr_princess_out frame 0 |

**Preview:**
- King Tower: ![enemy-king-1.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-king-1.png)
- Princess: ![enemy-princess-1.png](https://raw.githubusercontent.com/youyouxiangwang-prog/clash-royale-v2/001-official-assets-ui/public/assets/game/tower-sprites/enemy-princess-1.png)

---

## 3. Decoration Sprites

Available in `/public/assets/game/environment/decos/level_decos_sprite_XXX.png`

- Trees: 000-015
- Bushes: 016-040
- Rocks: 041-060

---

## 4. Pending Decisions

| Item | Options | Status |
|------|---------|--------|
| Arena Background | `ui_arena_out/` (154 sprites) / `arena_training_out/` (23 sprites) | ⏳ NEEDS REVIEW |
| How to tile | Use as background or tile pattern? | ⏳ PENDING |

---

## 5. Next Steps

1. User reviews the preview images above
2. Select which sprite set to use for arena background
3. Determine how to tile/arrange the sprites

---

*Last updated: 2026-03-25*
*Awaiting: User selection of official sprite resources*
