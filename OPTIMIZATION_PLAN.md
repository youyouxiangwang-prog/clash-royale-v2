# Terrain/Environment Graphics Optimization Plan

**Date**: 2026-03-25
**Project**: Clash Royale V2 - React + Canvas 2D
**Status**: Research Complete

---

## 1. Current Situation Analysis

### Existing Assets in `/assets/game/`
| Asset | File | Dimensions | Purpose |
|-------|------|------------|---------|
| Arena Texture | `arena_training_tex.png` | 970x1018 | Training arena ground texture |
| Tower Sprite | `tower.png` | ~12KB | Tower placeholder sprite |
| Unit Sprites | `units/knight.png`, etc. | varies | Character sprites |

### Reference Assets (Official Sprites)
| Asset Type | Location | Count | Purpose |
|------------|----------|-------|---------|
| Arena Sprites | `research/reference-assets/assets/sc/level_*_arena_out/` | 30-50 frames each | Full arena animations |
| Decorations | `research/reference-assets/assets/sc/level_decos_out/` | 107 sprites | Trees, bushes, rocks, etc. |
| Arena Textures | `research/reference-assets/assets/sc/level_*_tex.png` | 1024x988 | Seamless arena backgrounds |

### Current Implementation Issues
1. **Flat texture stretching** - `arena_training_tex.png` simply stretched to fill canvas
2. **Hardcoded terrain** - River, lanes, bridges drawn with basic shapes
3. **No detail variation** - Missing grass patches, shadows, environmental details
4. **No animated elements** - Water effects, decorative animations missing

---

## 2. Required Assets Analysis

### Priority 1: Ground/Arena
| Asset | Source | Status | Action |
|-------|--------|--------|--------|
| Main Arena Background | `level_*_tex.png` | Available | Copy to project assets |
| Grass Detail Texture | Procedural or `level_decos_tex.png` | Need to extract | Create procedural grass shader |
| Arena Sprite Animation | `level_*_arena_out/` | Available (30-50 frames) | Use for animated background |

### Priority 2: Decorative Elements (from `level_decos_out/`)
| Element | Sprite Range | Count | Use |
|---------|--------------|-------|-----|
| Trees (oak/pine) | 000-015 | 16 | Background decoration |
| Bushes | 016-040 | 25 | Lane edges |
| Rocks/Stones | 041-060 | 20 | Lane edges |
| Flowers/Plants | 061-080 | 20 | Arena corners |
| Fences/Wood | 081-100 | 20 | Arena boundaries |
| Bridges | 101-106 | 6 | River crossing |

**Note**: `level_decos_sprite_000.png` to `level_decos_sprite_106.png` contain all decorative elements

### Priority 3: Water/River Effects
| Asset | Source | Status | Solution |
|-------|--------|--------|----------|
| River Base | Arena texture center | Available | Extract from arena texture |
| Wave Animation | `level_*_arena_out/` frames | Available | Use animated frames |
| Splash Effects | `effects_sprite_*.png` | Available (600+ frames) | Use for unit splashes |

---

## 3. Implementation Strategy

### Hybrid Approach: Sprite + Procedural

```
┌─────────────────────────────────────────────────────────────┐
│                    RENDER LAYER STACK                        │
├─────────────────────────────────────────────────────────────┤
│  Layer 5: UI Overlays (health bars, elixir, cards)         │
│  Layer 4: Units & Buildings (sprite-based)                   │
│  Layer 3: Water/River Effects (procedural animation)        │
│  Layer 2: Decorative Elements (sprite-based, static)        │
│  Layer 1: Arena Background (sprite-based, animated)          │
└─────────────────────────────────────────────────────────────┘
```

### Approach Selection by Element

| Element | Method | Rationale |
|---------|--------|----------|
| Arena Ground | **Sprite-based** | Official textures already detailed |
| Water/River | **Procedural** | Need animated waves, simpler than sprite |
| Bushes/Shrubs | **Sprite-based** | Available in decos, too varied to procedural |
| Trees | **Sprite-based** | Available in decos, complex shapes |
| Rocks | **Sprite-based** | Available in decos |
| Bridges | **Sprite-based** | Available in decos (6 variants) |
| Grass Details | **Procedural** | Can use noise/pattern generation |

---

## 4. Implementation Plan

### Phase 1: Asset Preparation (Day 1)

**Copy and organize official assets:**
```bash
# Arena backgrounds (textures)
cp research/reference-assets/assets/sc/level_barbarian_arena_tex.png \
   assets/game/arena_barbarian_tex.png

# Decorative elements
mkdir -p assets/game/environment
cp research/reference-assets/assets/sc/level_decos_out/*.png \
   assets/game/environment/decos/
```

**Assets to copy:**
- `level_barbarian_arena_tex.png` → `assets/game/arena_background.png`
- `level_decos_out/` → `assets/game/environment/decos/` (107 files)

### Phase 2: Environment Renderer (Day 2)

**Create `src/engine/EnvironmentRenderer.ts`:**

```typescript
interface DecorationLayer {
  type: 'tree' | 'bush' | 'rock' | 'bridge';
  spriteIndex: number;
  position: { x: number; y: number };
  scale: number;
  parallax?: number; // For depth effect
}

interface ArenaEnvironment {
  background: string; // Texture path
  decorations: DecorationLayer[];
  riverPath: Path2D;
  bridgePositions: { x: number; y: number }[];
}

class EnvironmentRenderer {
  private decoSprites: Map<number, HTMLImageElement>;
  private waterOffset: number = 0;
  
  async loadDecorationSprites(): Promise<void> { ... }
  renderArena(ctx: CanvasRenderingContext2D, env: ArenaEnvironment): void { ... }
  renderWater(ctx: CanvasRenderingContext2D, riverRect: Rect): void { ... }
  renderDecorations(ctx: CanvasRenderingContext2D, env: ArenaEnvironment): void { ... }
  updateWaterAnimation(deltaTime: number): void { ... }
}
```

### Phase 3: Water Effect System (Day 3)

**Procedural water rendering:**

```typescript
// Water rendering with sine-wave animation
function renderWater(ctx: CanvasRenderingContext2D, rect: Rect, time: number) {
  const waveHeight = 3;
  const waveCount = 8;
  
  // Base water color
  ctx.fillStyle = '#3a7bd5';
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  
  // Animated wave lines
  for (let i = 0; i < waveCount; i++) {
    const yOffset = (time * 50 + i * 20) % rect.height;
    ctx.strokeStyle = `rgba(255, 255, 255, ${0.2 - i * 0.02})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = rect.x; x < rect.x + rect.width; x += 5) {
      const y = rect.y + yOffset + Math.sin((x + time * 100) * 0.05) * waveHeight;
      x === rect.x ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
```

### Phase 4: Bridge System (Day 4)

**Use official bridge sprites from decos (indices 101-106):**

```typescript
const BRIDGE_SPRITES = {
  WOODEN_PLANK: 101,
  WOODEN_WITH_RAIL: 102,
  STONE_BASE: 103,
  STONE_WITH_GUARD: 104,
  // ... etc
};

function renderBridge(ctx: CanvasRenderingContext2D, pos: Position, type: number) {
  const sprite = this.decoSprites.get(type + 101);
  if (sprite) {
    ctx.drawImage(sprite, pos.x - sprite.width/2, pos.y - sprite.height/2);
  }
}
```

---

## 5. Priority Order

| Priority | Task | Effort | Impact | Status |
|----------|------|--------|--------|--------|
| 1 | Copy arena texture to assets | Low | High | Pending |
| 2 | Copy decos sprites to assets | Low | High | Pending |
| 3 | Implement EnvironmentRenderer | Medium | High | Pending |
| 4 | Implement animated water effect | Medium | Medium | Pending |
| 5 | Integrate decorations into arena | Medium | Medium | Pending |
| 6 | Add bridge rendering | Low | Low | Pending |
| 7 | Add grass detail procedural | High | Low | Optional |

---

## 6. Code Structure Recommendations

```
src/
├── engine/
│   ├── EnvironmentRenderer.ts    # NEW: Main environment rendering
│   ├── WaterRenderer.ts          # NEW: Procedural water effects
│   ├── DecorationAtlas.ts        # NEW: Sprite atlas management
│   └── AnimationManager.ts       # Existing: Animation system
├── components/
│   └── game/
│       ├── Arena.tsx             # Modified: Use EnvironmentRenderer
│       └── ArenaBackground.tsx   # NEW: Background layer component
├── assets/
│   └── game/
│       ├── arena_background.png   # Copied from reference
│       └── environment/
│           └── decos/            # 107 decoration sprites
└── types/
    └── environment.ts            # NEW: Type definitions
```

---

## 7. Asset Files Summary

### Source Files (Read-Only, in research/)
- `research/reference-assets/assets/sc/level_barbarian_arena_tex.png` (1024x988)
- `research/reference-assets/assets/sc/level_decos_out/` (107 sprites)
- `research/reference-assets/assets/sc/level_barbarian_arena_out/` (34 frames)

### Target Files (In project assets/)
```
assets/game/
├── arena_barbarian_tex.png       # Main arena background
├── environment/
│   └── decos/
│       ├── level_decos_sprite_000.png  # Tree (oak)
│       ├── level_decos_sprite_001.png  # Tree (pine)
│       ├── ...                          # 107 total decorations
│       └── level_decos_sprite_106.png
```

---

## 8. Performance Considerations

| Technique | Benefit | Implementation |
|-----------|---------|----------------|
| Sprite Atlas | Reduce draw calls | Combine decos into single texture |
| Off-screen Canvas | Cache static elements | Pre-render arena to offscreen canvas |
| Parallax Rendering | Depth perception | Only re-render moved layers |
| RequestAnimationFrame | Smooth 60fps | Use for water animation |

---

## 9. Conclusion

**Recommended Approach**: Hybrid Sprite + Procedural

**Key Benefits**:
1. ✅ Uses official textures (high quality)
2. ✅ Leverages existing decos sprites (107 elements)
3. ✅ Procedural water = smaller file size + infinite variation
4. ✅ Can add grass details procedurally if needed

**Next Steps**:
1. Copy `level_barbarian_arena_tex.png` to `assets/game/arena_barbarian_tex.png`
2. Copy `level_decos_out/` contents to `assets/game/environment/decos/`
3. Implement `EnvironmentRenderer.ts`
4. Add procedural water animation
5. Integrate decorations into arena layout

---

*Report generated: 2026-03-25*
*Research by: Subagent terrain-research*
