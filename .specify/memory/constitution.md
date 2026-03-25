# Clash Royale V2 Constitution

## Core Principles

### I. Official Assets First (NON-NEGOTIABLE)
All game assets MUST be sourced from official Clash Royale game files:
- Arena textures from `assets/sc/arena_training_tex.png`
- Tower sprites from `assets/sc/building_tower_out/`
- Unit sprites from `assets/sc/chr_*/` directories
- UI elements from official game assets

**Rationale**: Visual authenticity is the primary requirement. Using official assets ensures the UI matches the real game.

### II. Canvas Rendering with Sprite Animation
All game elements MUST be rendered using HTML5 Canvas with proper sprite animation:
- Use sprite sheets from official assets
- Implement frame-based animation system
- Support multiple animation states (idle, walk, attack, die)
- Maintain 60fps performance

**Rationale**: Canvas provides the flexibility needed for complex sprite animations while maintaining performance.

### III. Visual Fidelity (NON-NEGOTIABLE)
The UI MUST look like the real Clash Royale game:
- Exact proportions and positions
- Correct colors extracted from official assets
- Proper animation timings
- Authentic visual effects

**Rationale**: User's core requirement is that the UI must match the real game. No approximations accepted.

### IV. TypeScript Strict Mode
All code MUST be written in TypeScript with strict mode enabled:
- Full type coverage for all functions
- No `any` types without explicit justification
- Proper interfaces for all game entities

**Rationale**: Type safety ensures maintainability and catches errors early.

### V. Test-Driven Development
Tests MUST be written before implementation:
- Unit tests for core game logic
- Visual regression tests for rendering
- Integration tests for game flow

**Rationale**: TDD ensures code quality and prevents regressions.

## Technical Constraints

### Asset Management
- All assets stored in `assets/` directory
- Reference official asset repository: `smlbiobot/cr-assets-png`
- Document asset sources and modifications

### Rendering Architecture
- 5-layer Canvas system:
  - Layer 0: Background (Arena)
  - Layer 1: Buildings (Towers)
  - Layer 2: Units
  - Layer 3: Effects
  - Layer 4: UI
- Each layer renders independently
- Game loop at 60fps

### Animation System
- Sprite-based frame animation
- Configurable FPS per animation
- Support for loop, ping-pong, and one-shot animations
- Smooth transitions between states

## Development Workflow

### Phase Gates
1. Phase 0: Deep Research (Manual)
2. Phase 1: Specification (Using spec-kit)
3. Phase 2: Tests (Using opencode)
4. Phase 3: Implementation (Using opencode)
5. Phase 4: Review (Using opencode)

### Required Tools
- **spec-kit**: For all specification work (`/speckit.*` commands)
- **opencode**: For all code implementation

### Forbidden Actions
- ❌ Manually writing specification files
- ❌ Manually writing code (use opencode)
- ❌ Skipping development phases
- ❌ Claiming completion without verification

## Governance

This constitution supersedes all other practices. Amendments require:
1. Documentation of the change
2. User approval
3. Migration plan for affected code

All code reviews MUST verify compliance with these principles. Complexity MUST be justified against visual fidelity requirements.

**Version**: 1.0.0 | **Ratified**: 2026-03-25 | **Last Amended**: 2026-03-25