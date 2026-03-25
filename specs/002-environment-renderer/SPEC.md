# SPEC: Environment Renderer

**Date**: 2026-03-25
**Project**: Clash Royale V2
**Feature**: Environment Rendering System
**Status**: Phase 2 - Implementation

---

## 1. Overview

This spec defines the Environment Renderer system for rendering the game arena background, decorative elements, water effects, and bridges using official Clash Royale assets.

---

## 2. Asset Requirements

### 2.1 Arena Background
- **File**: `assets/game/arena_background.png`
- **Dimensions**: 506x832 pixels
- **Purpose**: Main arena ground texture (grass, terrain base)
- **Source**: `level_barbarian_arena_tex.png`

### 2.2 Arena Animation Frames
- **Location**: `assets/game/arena_animation/`
- **Files**: 34 frames (`level_barbarian_arena_sprite_00.png` to `level_barbarian_arena_sprite_33.png`)
- **Purpose**: Animated arena background (water ripples, grass movement)
- **Frame Rate**: 15 FPS (animating through frames creates water effect)

### 2.3 Decoration Sprites
- **Atlas File**: `assets/game/environment/decos_atlas.png` (1024x988 sprite sheet)
- **Individual Files**: `assets/game/environment/decos/` (107 individual PNGs)
- **Sprite Range**:
  - `000-015`: Trees (16 types)
  - `016-040`: Bushes/Shrubs (25 types)
  - `041-060`: Rocks/Stones (20 types)
  - `061-080`: Flowers/Plants (20 types)
  - `081-100`: Fences/Wooden structures (20 types)
  - `101-106`: Bridges (6 types)

---

## 3. Rendering Layer Architecture

```
Layer Stack (bottom to top):
┌─────────────────────────────────────────┐
│ Layer 6: UI Overlays                     │
├─────────────────────────────────────────┤
│ Layer 5: Units & Buildings               │
├─────────────────────────────────────────┤
│ Layer 4: Animated Arena (water frames)   │
├─────────────────────────────────────────┤
│ Layer 3: Decorative Elements             │
│           (trees, bushes, rocks)         │
├─────────────────────────────────────────┤
│ Layer 2: Static Arena Background         │
│           (grass texture base)           │
├─────────────────────────────────────────┤
│ Layer 1: Arena Base                      │
└─────────────────────────────────────────┘
```

---

## 4. Functionality Specification

### 4.1 EnvironmentRenderer Class

```typescript
interface DecorationPlacement {
  spriteIndex: number;  // 0-106
  x: number;
  y: number;
  scale: number;        // 0.5 - 1.5
  flip?: boolean;        // horizontal flip
}

interface ArenaConfig {
  width: number;
  height: number;
  riverY: number;        // y position of river center
  riverHeight: number;   // height of river band
  bridgePositions: {x: number, y: number}[];
}

class EnvironmentRenderer {
  // State
  private backgroundImage: HTMLImageElement | null;
  private animationFrames: HTMLImageElement[];
  private decosSprites: Map<number, HTMLImageElement>;
  private currentFrame: number = 0;
  private animationTime: number = 0;
  private decorations: DecorationPlacement[] = [];
  
  // Configuration
  private config: ArenaConfig;
  
  // Methods
  async loadAssets(): Promise<void>;
  generateDefaultDecorations(): void;
  renderBase(ctx: CanvasRenderingContext2D): void;
  renderAnimatedLayer(ctx: CanvasRenderingContext2D, deltaTime: number): void;
  renderDecorations(ctx: CanvasRenderingContext2D): void;
  renderRiver(ctx: CanvasRenderingContext22D, time: number): void;
  renderBridges(ctx: CanvasRenderingContext2D): void;
  update(deltaTime: number): void;
}
```

### 4.2 Decoration Placement Logic

Decorations should be placed semi-randomly but in aesthetically pleasing positions:

```typescript
function generateDecorationPlacement(): DecorationPlacement[] {
  // Trees (000-015): Place along edges, away from lanes
  // Bushes (016-040): Place near lane edges, corners
  // Rocks (041-060): Scatter in grass areas
  // Flowers (061-080): Place in corners, decoration spots
  // Avoid placing in:
  //   - River area
  //   - Bridge positions
  //   - Tower positions
  //   - Lane centers
}
```

### 4.3 River Rendering

Procedural water effect using sine waves:

```typescript
function renderRiver(ctx: CanvasRenderingContext2D, rect: Rect, time: number) {
  // Base water color
  ctx.fillStyle = '#3a7bd5';
  ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
  
  // Animated wave lines
  const waveCount = 12;
  for (let i = 0; i < waveCount; i++) {
    const yOffset = (time * 30 + i * 40) % rect.height;
    ctx.strokeStyle = `rgba(100, 181, 246, ${0.3 - i * 0.02})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let x = 0; x < rect.width; x += 8) {
      const y = rect.y + yOffset + Math.sin((x + time * 50) * 0.03) * 4;
      x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    }
    ctx.stroke();
  }
}
```

### 4.4 Bridge Rendering

Use bridge sprites from decos (indices 101-106):

```typescript
const BRIDGE_SPRITES = {
  WOODEN_PLAIN: 101,
  WOODEN_RAILS: 102,
  STONE_PLAIN: 103,
  STONE_RAILS: 104,
  GOLD_ORNATE: 105,
  SPECIAL: 106
};
```

---

## 5. Integration with Arena.tsx

### 5.1 Modified Arena.tsx Structure

```typescript
// In Arena.tsx
import { EnvironmentRenderer } from '../../engine/EnvironmentRenderer';

const Arena: React.FC<ArenaProps> = ({ towers, units, width = 800, height = 600 }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const envRendererRef = useRef<EnvironmentRenderer | null>(null);
  
  // Initialize environment renderer
  useEffect(() => {
    const renderer = new EnvironmentRenderer({ width, height });
    envRendererRef.current = renderer;
    
    renderer.loadAssets().then(() => {
      renderer.generateDefaultDecorations();
    });
  }, [width, height]);
  
  // Animation loop
  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    
    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;
      
      if (envRendererRef.current) {
        envRendererRef.current.update(deltaTime);
        // Render environment layers first
        envRendererRef.current.renderBase(ctx);
        envRendererRef.current.renderAnimatedLayer(ctx, deltaTime);
        envRendererRef.current.renderDecorations(ctx);
        // Then render game objects on top
        towers.forEach(tower => drawTower(ctx, tower));
        units.forEach(unit => drawUnit(ctx, unit));
      }
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, [towers, units]);
}
```

---

## 6. Decoration Placement Map

Based on real Clash Royale arena layout:

```
Arena Layout (800x600):

    [Enemy King Tower]     [Enemy Princess Towers]
    
         🌲   🪨      🏠      🪨   🌲
    🌳        🌿  🪨         🌿        🌳
         🏠                      🏠
[Lane1][Bridge1][  RIVER  ][Bridge2][Lane2]
         🏠                      🏠
    🌳        🌿         🌿        🌳
         🌲   🪨              🪨   🌲
    
    [Player King Tower]    [Player Princess Towers]

Placement Rules:
- Trees (🌲🌳): Corners and edges, not in lanes
- Bushes (🌿): Near lane edges
- Rocks (🪨): Scatter in grass, avoid paths
- Bridges: At river crossing points
- Buildings (🏠): Fixed positions for spawners
```

---

## 7. Performance Considerations

| Technique | Implementation |
|-----------|----------------|
| Off-screen Canvas | Pre-render static background to offscreen canvas |
| Sprite Caching | Cache all sprites after first load |
| RequestAnimationFrame | Use for smooth 60fps animation |
| Dirty Rectangles | Only redraw changed areas (future optimization) |

---

## 8. File Structure

```
src/
└── engine/
    ├── EnvironmentRenderer.ts    # Main environment renderer
    └── types/
        └── environment.ts        # Type definitions

public/assets/game/
├── arena_background.png          # Static background
├── arena_animation/              # 34 animation frames
└── environment/
    ├── decos_atlas.png          # Sprite atlas
    └── decos/                   # 107 individual sprites
```

---

## 9. Acceptance Criteria

### Must Have (P0)
- [ ] Arena background renders correctly (not stretched, proper aspect)
- [ ] At least one type of decoration visible (tree/bush/rock)
- [ ] River renders with basic blue color
- [ ] Bridges render at correct positions
- [ ] No console errors

### Should Have (P1)
- [ ] River has animated wave effect
- [ ] Decorations distributed aesthetically
- [ ] Animation frames cycle for water effect
- [ ] Performance: 60fps on mid-range devices

### Nice to Have (P2)
- [ ] Parallax effect on decorations
- [ ] Seasonal/arena-specific decoration sets
- [ ] Dynamic decoration placement based on arena type

---

## 10. Testing Strategy

```typescript
describe('EnvironmentRenderer', () => {
  it('loads all assets without error', async () => {
    const renderer = new EnvironmentRenderer(config);
    await renderer.loadAssets();
    expect(renderer.isReady()).toBe(true);
  });
  
  it('renders decorations without overlap', () => {
    const renderer = new EnvironmentRenderer(config);
    renderer.generateDefaultDecorations();
    const placements = renderer.getDecorations();
    // No overlapping bounding boxes
  });
  
  it('animates river at 60fps', () => {
    // Test deltaTime-based animation
  });
});
```

---

*Last updated: 2026-03-25*
