# Research Notes - Official Assets UI

## Asset Sources

### Primary Source: smlbiobot/cr-assets-png

**Repository**: https://github.com/smlbiobot/cr-assets-png
**Total Files**: 21,060
**License**: Game assets extracted from Clash Royale APK

### Directory Structure

```
assets/sc/
├── arena_training_tex.png          # Arena ground texture (970x1018)
├── arena_training_out/             # Arena sprite parts (23 files)
├── building_tower_tex.png          # Tower texture atlas (3MB)
├── building_tower_out/             # Tower sprites (214 frames)
├── chr_knight_out/                 # Knight sprites (~50 frames)
├── chr_archer_out/                 # Archer sprites (~40 frames)
├── chr_giant_out/                  # Giant sprites (~40 frames)
├── chr_wizard_out/                 # Wizard sprites
├── chr_baby_dragon_out/            # Baby Dragon sprites
└── ... (50+ character directories)
```

## Technical Decisions

### 1. Rendering Technology

**Decision**: HTML5 Canvas (not CSS or WebGL)

**Rationale**:
- Canvas allows precise sprite positioning and animation
- Better performance for many animated sprites
- WebGL is overkill for 2D sprite rendering
- CSS would be difficult for complex sprite animations

**Alternatives Considered**:
- CSS transforms - Rejected: Limited animation control
- WebGL - Rejected: Added complexity without benefit for 2D
- Phaser.js - Considered but decided on custom for full control

### 2. Animation System

**Decision**: Frame-based sprite animation

**Rationale**:
- Official assets are already frame-based
- Simple to implement and debug
- Flexible FPS control per animation

**Animation States**:
- idle: Character standing still (8-12 FPS)
- walk: Character moving (12-15 FPS)
- attack: Character attacking (15-20 FPS)
- die: Character dying (8 FPS, one-shot)

### 3. Layer Architecture

**Decision**: 5-layer Canvas rendering

**Rationale**:
- Separates concerns for easier debugging
- Allows partial updates (only redraw changed layers)
- Matches game logic organization

**Layers**:
| Layer | Content | Update Frequency |
|-------|---------|------------------|
| 0 | Arena background | Rare (once on load) |
| 1 | Towers | Low (on state change) |
| 2 | Units | High (every frame) |
| 3 | Effects | High (particles, spells) |
| 4 | UI | Medium (timer, elixir) |

### 4. Asset Loading

**Decision**: Lazy loading with preload queue

**Rationale**:
- 21,060 files is too many to load upfront
- Only load assets needed for current game state
- Cache loaded assets in memory

**Loading Strategy**:
1. Preload arena and towers (essential)
2. Load unit sprites on demand
3. Cache in memory for reuse

## Reference Implementations

### kylemath/ClashRoyale

**Tech Stack**: React 18 + TypeScript + Vite + CSS
**Key Learnings**:
- Pure CSS rendering works but lacks visual fidelity
- Game loop at 100ms interval (not ideal for animations)
- Framer Motion for UI animations

**What We're Doing Differently**:
- Using Canvas instead of CSS for better sprite control
- Using official assets instead of simplified graphics
- 60fps game loop for smoother animations

### squiig/clash-royale-clone (Unity)

**Tech Stack**: Unity 3D + C#
**Key Learnings**:
- 3D rendering with official assets looks great
- NavMesh for pathfinding
- Proper animation state machine

**What We're Doing Differently**:
- Web-based (not Unity)
- 2D Canvas instead of 3D
- Simpler pathfinding (direct movement)

## Performance Considerations

### Target: 60 FPS

**Optimization Strategies**:
1. Only redraw dirty regions
2. Use requestAnimationFrame
3. Batch sprite draws
4. Cache rendered frames for static elements

### Memory Management

**Estimates**:
- Arena texture: ~1MB
- Tower sprites: ~3MB
- Unit sprites (10 types): ~10MB
- Total: ~15MB (acceptable)

## Risks and Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| Asset load failure | High | Implement fallback placeholders |
| Performance issues | Medium | Profile early, optimize render loop |
| Visual mismatch | High | Compare screenshots side-by-side |

## Next Steps

1. Define data models for sprites and animations
2. Create animation configuration files
3. Implement sprite loading system