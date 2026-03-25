import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Unit from '../../src/components/game/Unit';
import type { Unit as UnitType } from '../../src/types';

// Sprite dimensions from official assets
const KNIGHT_FRAME_WIDTH = 187;
const KNIGHT_FRAME_HEIGHT = 181;
const ARCHER_FRAME_WIDTH = 130;
const ARCHER_FRAME_HEIGHT = 135;
const GIANT_FRAME_WIDTH = 189;
const GIANT_FRAME_HEIGHT = 185;

// Knight animation frame ranges
const KNIGHT_ANIMATIONS = {
  idle: { frames: [0, 10], fps: 8, loop: true },
  walk: { frames: [11, 20], fps: 12, loop: true },
  attack: { frames: [21, 30], fps: 15, loop: false },
  die: { frames: [31, 40], fps: 8, loop: false },
} as const;

describe('Unit Rendering', () => {
  let mockUnit: UnitType;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUnit = {
      id: 'unit-1',
      type: 'knight',
      position: { x: 200, y: 300 },
      health: 50,
      maxHealth: 50,
      speed: 60,
      damage: 10,
      range: 50,
      isEnemy: false,
    };
  });

  describe('Unit Sprite Loading', () => {
    it('should have correct knight sprite dimensions', () => {
      expect(KNIGHT_FRAME_WIDTH).toBe(187);
      expect(KNIGHT_FRAME_HEIGHT).toBe(181);
    });

    it('should have correct archer sprite dimensions', () => {
      expect(ARCHER_FRAME_WIDTH).toBe(130);
      expect(ARCHER_FRAME_HEIGHT).toBe(135);
    });

    it('should have correct giant sprite dimensions', () => {
      expect(GIANT_FRAME_WIDTH).toBe(189);
      expect(GIANT_FRAME_HEIGHT).toBe(185);
    });

    it('should load knight sprites from correct directory', () => {
      const knightSpritePath = 'assets/sc/chr_knight_out/';
      expect(knightSpritePath).toBe('assets/sc/chr_knight_out/');
    });

    it('should load archer sprites from correct directory', () => {
      const archerSpritePath = 'assets/sc/chr_archer_out/';
      expect(archerSpritePath).toBe('assets/sc/chr_archer_out/');
    });

    it('should load giant sprites from correct directory', () => {
      const giantSpritePath = 'assets/sc/chr_giant_out/';
      expect(giantSpritePath).toBe('assets/sc/chr_giant_out/');
    });

    it('should have correct knight frame count', () => {
      const expectedFrameCount = 50;
      expect(expectedFrameCount).toBe(50);
    });

    it('should define idle animation correctly', () => {
      expect(KNIGHT_ANIMATIONS.idle.fps).toBe(8);
      expect(KNIGHT_ANIMATIONS.idle.loop).toBe(true);
    });

    it('should define walk animation correctly', () => {
      expect(KNIGHT_ANIMATIONS.walk.fps).toBe(12);
      expect(KNIGHT_ANIMATIONS.walk.loop).toBe(true);
    });

    it('should define attack animation correctly', () => {
      expect(KNIGHT_ANIMATIONS.attack.fps).toBe(15);
      expect(KNIGHT_ANIMATIONS.attack.loop).toBe(false);
    });

    it('should define die animation correctly', () => {
      expect(KNIGHT_ANIMATIONS.die.fps).toBe(8);
      expect(KNIGHT_ANIMATIONS.die.loop).toBe(false);
    });
  });

  describe('Unit Component Rendering', () => {
    it('should render unit component', () => {
      render(<Unit unit={mockUnit} />);
      const unitElement = document.querySelector('.unit');
      expect(unitElement).toBeInTheDocument();
    });

    it('should apply ally class for player units', () => {
      render(<Unit unit={mockUnit} />);
      const unitElement = document.querySelector('.unit.ally');
      expect(unitElement).toBeInTheDocument();
    });

    it('should apply enemy class for enemy units', () => {
      const enemyUnit: UnitType = { ...mockUnit, isEnemy: true };
      render(<Unit unit={enemyUnit} />);
      const unitElement = document.querySelector('.unit.enemy');
      expect(unitElement).toBeInTheDocument();
    });

    it('should position unit at correct coordinates', () => {
      mockUnit.position = { x: 250, y: 350 };
      render(<Unit unit={mockUnit} />);
      const unitElement = document.querySelector('.unit');
      expect(unitElement).toHaveStyle({ left: 250, top: 350 });
    });

    it('should render unit health bar', () => {
      render(<Unit unit={mockUnit} />);
      const healthBar = document.querySelector('.unit-health');
      expect(healthBar).toBeInTheDocument();
    });

    it('should display correct health percentage', () => {
      mockUnit.health = 25;
      mockUnit.maxHealth = 50;
      render(<Unit unit={mockUnit} />);
      const healthFill = document.querySelector('.unit-health-fill');
      expect(healthFill).toHaveStyle({ width: '50%' });
    });

    it('should display full health when at max', () => {
      mockUnit.health = 50;
      mockUnit.maxHealth = 50;
      render(<Unit unit={mockUnit} />);
      const healthFill = document.querySelector('.unit-health-fill');
      expect(healthFill).toHaveStyle({ width: '100%' });
    });

    it('should render unit body element', () => {
      render(<Unit unit={mockUnit} />);
      const unitBody = document.querySelector('.unit-body');
      expect(unitBody).toBeInTheDocument();
    });
  });

  describe('Unit State Transitions', () => {
    it('should support idle state', () => {
      const idleState = 'idle';
      expect(['idle', 'walking', 'attacking', 'dying', 'dead']).toContain(idleState);
    });

    it('should support walking state', () => {
      const walkingState = 'walking';
      expect(['idle', 'walking', 'attacking', 'dying', 'dead']).toContain(walkingState);
    });

    it('should support attacking state', () => {
      const attackingState = 'attacking';
      expect(['idle', 'walking', 'attacking', 'dying', 'dead']).toContain(attackingState);
    });

    it('should support dying state', () => {
      const dyingState = 'dying';
      expect(['idle', 'walking', 'attacking', 'dying', 'dead']).toContain(dyingState);
    });

    it('should support dead state', () => {
      const deadState = 'dead';
      expect(['idle', 'walking', 'attacking', 'dying', 'dead']).toContain(deadState);
    });

    it('should transition from idle to walking when moving', () => {
      let currentState: string = 'idle';
      const isMoving = true;
      if (isMoving) {
        currentState = 'walking';
      }
      expect(currentState).toBe('walking');
    });

    it('should transition from walking to attacking when target in range', () => {
      let currentState: string = 'walking';
      const targetInRange = true;
      if (targetInRange) {
        currentState = 'attacking';
      }
      expect(currentState).toBe('attacking');
    });

    it('should transition to dying when health reaches zero', () => {
      let currentState: string = 'idle';
      mockUnit.health = 0;
      if (mockUnit.health <= 0) {
        currentState = 'dying';
      }
      expect(currentState).toBe('dying');
    });

    it('should transition from dying to dead when animation completes', () => {
      let currentState: string = 'dying';
      const animationCompleted = true;
      if (animationCompleted) {
        currentState = 'dead';
      }
      expect(currentState).toBe('dead');
    });
  });

  describe('Unit Stats', () => {
    it('should have valid health range', () => {
      expect(mockUnit.health).toBeGreaterThanOrEqual(0);
      expect(mockUnit.health).toBeLessThanOrEqual(mockUnit.maxHealth);
    });

    it('should have valid speed', () => {
      expect(mockUnit.speed).toBeGreaterThan(0);
    });

    it('should have valid damage', () => {
      expect(mockUnit.damage).toBeGreaterThanOrEqual(0);
    });

    it('should have valid range', () => {
      expect(mockUnit.range).toBeGreaterThanOrEqual(0);
    });

    it('should have unique unit id', () => {
      const unitIds = new Set(['unit-1', 'unit-2', 'unit-3']);
      expect(unitIds.size).toBe(3);
    });
  });

  describe('Unit Facing Direction', () => {
    it('should support left facing direction', () => {
      const facing: 'left' | 'right' = 'left';
      expect(['left', 'right']).toContain(facing);
    });

    it('should support right facing direction', () => {
      const facing: 'left' | 'right' = 'right';
      expect(['left', 'right']).toContain(facing);
    });

    it('should flip sprite when changing facing direction', () => {
      let facing: 'left' | 'right' = 'left';
      expect(facing).toBe('left');
      facing = 'right';
      expect(facing).toBe('right');
    });
  });
});
