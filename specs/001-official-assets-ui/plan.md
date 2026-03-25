# Implementation Plan: Official Assets UI for Clash Royale Clone

**Branch**: `001-official-assets-ui` | **Date**: 2026-03-25 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-official-assets-ui/spec.md`

## Summary

Build a Clash Royale clone UI using official game assets rendered on HTML5 Canvas. The implementation must use sprite-based rendering with frame animations to match the visual quality of the real game.

## Technical Context

**Language/Version**: TypeScript 5.x with strict mode
**Primary Dependencies**: React 18, Vite, HTML5 Canvas API
**Storage**: Browser localStorage (for game state), IndexedDB (for cached assets)
**Testing**: Vitest (unit), Playwright (visual regression)
**Target Platform**: Modern browsers (Chrome 90+, Firefox 88+, Safari 14+)
**Project Type**: web-application (single-player game)
**Performance Goals**: 60fps rendering, <2s initial load, <100ms interaction response
**Constraints**: 
- Must use official assets from smlbiobot/cr-assets-png
- No WebGL (Canvas only)
- Portrait mode (9:16 aspect ratio)
**Scale/Scope**: 
- 1 arena
- 6 towers (3 per team)
- 10+ unit types with animations
- 4 UI elements (timer, elixir bars, card hand)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Official Assets First | ✅ PASS | Using assets from cr-assets-png (21,060 files) |
| II. Canvas Rendering | ✅ PASS | HTML5 Canvas with sprite animation system |
| III. Visual Fidelity | ✅ PASS | Matching real game visuals is primary goal |
| IV. TypeScript Strict | ✅ PASS | tsconfig strict mode enabled |
| V. TDD | ⏳ PENDING | Tests to be written in Phase 2 |

**Gate Result**: ✅ PASSED - All critical principles satisfied

## Project Structure

### Documentation (this feature)

```text
specs/001-official-assets-ui/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── contracts/           # Phase 1 output
```

### Source Code (repository root)

```text
src/
├── components/
│   ├── Game/
│   │   ├── GameCanvas.tsx      # Main Canvas component
│   │   ├── Arena.tsx           # Arena renderer
│   │   ├── Tower.tsx           # Tower renderer
│   │   └── Unit.tsx            # Unit renderer
│   └── UI/
│       ├── Timer.tsx           # Game timer
│       ├── ElixirBar.tsx       # Elixir display
│       └── CardHand.tsx        # Card hand
├── engine/
│   ├── GameEngine.ts           # Game loop
│   ├── AnimationManager.ts     # Sprite animation
│   └── RenderSystem.ts         # Canvas layers
├── data/
│   ├── sprites.ts              # Sprite configurations
│   └── animations.ts           # Animation definitions
├── types/
│   ├── game.ts                 # Game types
│   └── sprites.ts              # Sprite types
└── assets/
    ├── arena/                  # Arena textures
    ├── towers/                 # Tower sprites
    └── units/                  # Unit sprites

tests/
├── unit/                       # Unit tests
├── integration/                # Integration tests
└── visual/                     # Visual regression tests
```

**Structure Decision**: Single-project web application structure. All game code in `src/`, tests mirror structure in `tests/`.

## Complexity Tracking

> No violations - Constitution Check passed

## Implementation Phases

### Phase 0: Research (Completed)
- ✅ Found official assets repository (smlbiobot/cr-assets-png)
- ✅ Analyzed asset structure (21,060 files)
- ✅ Studied reference implementations (kylemath/ClashRoyale)
- ✅ Documented technical decisions

### Phase 1: Design (In Progress)
- ⏳ Data model design
- ⏳ Component interfaces
- ⏳ Animation system design

### Phase 2: Tests (Next)
- Unit tests for core systems
- Visual regression tests for rendering

### Phase 3: Implementation
- Arena rendering
- Tower rendering with animation
- Unit rendering with animation
- UI components

### Phase 4: Review
- Visual comparison to real game
- Performance profiling
- Code review