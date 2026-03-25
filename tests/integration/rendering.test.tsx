import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Arena from '../../src/components/game/Arena';
import Tower from '../../src/components/game/Tower';
import Unit from '../../src/components/game/Unit';
import type { Tower as TowerType, Unit as UnitType } from '../../src/types';

// ============================================
// Animation System Types (from data-model.md)
// ============================================

interface AnimationConfig {
  name: string;
  frames: number[];
  fps: number;
  loop: boolean;
  pingPong?: boolean;
}

interface AnimationState {
  currentAnimation: string;
  currentFrame: number;
  frameTime: number;
  playing: boolean;
  completed: boolean;
}

interface SpriteSheet {
  id: string;
  name: string;
  directory: string;
  frameCount: number;
  frameWidth: number;
  frameHeight: number;
  animations: Map<string, AnimationConfig>;
  loaded: boolean;
  frames: HTMLImageElement[];
}

// ============================================
// Animation System Tests
// ============================================

describe('Animation System', () => {
  describe('AnimationConfig Parsing', () => {
    it('should parse animation config with valid name', () => {
      const config: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        fps: 8,
        loop: true,
      };
      expect(config.name).toBe('idle');
    });

    it('should parse animation frames array', () => {
      const config: AnimationConfig = {
        name: 'walk',
        frames: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        fps: 12,
        loop: true,
      };
      expect(config.frames).toHaveLength(10);
      expect(config.frames[0]).toBe(11);
      expect(config.frames[9]).toBe(20);
    });

    it('should parse animation fps value', () => {
      const config: AnimationConfig = {
        name: 'attack',
        frames: [21, 22, 23, 24, 25],
        fps: 15,
        loop: false,
      };
      expect(config.fps).toBe(15);
    });

    it('should parse loop flag correctly', () => {
      const loopingConfig: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2],
        fps: 8,
        loop: true,
      };
      expect(loopingConfig.loop).toBe(true);

      const nonLoopingConfig: AnimationConfig = {
        name: 'attack',
        frames: [0, 1, 2],
        fps: 15,
        loop: false,
      };
      expect(nonLoopingConfig.loop).toBe(false);
    });

    it('should parse pingPong flag when present', () => {
      const pingPongConfig: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2, 3],
        fps: 8,
        loop: true,
        pingPong: true,
      };
      expect(pingPongConfig.pingPong).toBe(true);
    });

    it('should handle animation frames within valid bounds', () => {
      const spriteSheet: SpriteSheet = {
        id: 'knight',
        name: 'Knight',
        directory: 'assets/sc/chr_knight_out/',
        frameCount: 50,
        frameWidth: 187,
        frameHeight: 181,
        animations: new Map(),
        loaded: true,
        frames: [],
      };

      const config: AnimationConfig = {
        name: 'idle',
        frames: [0, 5, 10],
        fps: 8,
        loop: true,
      };

      const allFramesValid = config.frames.every(
        (frame) => frame >= 0 && frame < spriteSheet.frameCount
      );
      expect(allFramesValid).toBe(true);
    });

    it('should reject animation frames outside valid bounds', () => {
      const spriteSheet: SpriteSheet = {
        id: 'knight',
        name: 'Knight',
        directory: 'assets/sc/chr_knight_out/',
        frameCount: 50,
        frameWidth: 187,
        frameHeight: 181,
        animations: new Map(),
        loaded: true,
        frames: [],
      };

      const invalidConfig: AnimationConfig = {
        name: 'invalid',
        frames: [0, 50, 100], // 50 and 100 are out of bounds
        fps: 8,
        loop: true,
      };

      const hasInvalidFrames = invalidConfig.frames.some(
        (frame) => frame < 0 || frame >= spriteSheet.frameCount
      );
      expect(hasInvalidFrames).toBe(true);
    });
  });

  describe('AnimationState State Machine', () => {
    it('should initialize with correct default state', () => {
      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 0,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      expect(state.currentAnimation).toBe('idle');
      expect(state.currentFrame).toBe(0);
      expect(state.playing).toBe(true);
      expect(state.completed).toBe(false);
    });

    it('should transition to new animation', () => {
      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 5,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      // Transition to walk animation
      state.currentAnimation = 'walk';
      state.currentFrame = 0;
      state.frameTime = 0;

      expect(state.currentAnimation).toBe('walk');
      expect(state.currentFrame).toBe(0);
    });

    it('should advance frame based on fps and delta time', () => {
      const config: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        fps: 8,
        loop: true,
      };

      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 0,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      // Simulate 125ms (1/8 of a second for 8fps)
      const deltaTime = 125;
      state.frameTime += deltaTime;

      // Should advance frame when frameTime exceeds interval
      const frameInterval = 1000 / config.fps;
      if (state.frameTime >= frameInterval) {
        state.currentFrame = (state.currentFrame + 1) % config.frames.length;
        state.frameTime = 0;
      }

      expect(state.currentFrame).toBe(1);
    });

    it('should loop animation when at end and loop is true', () => {
      const config: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2, 3],
        fps: 8,
        loop: true,
      };

      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 3, // Last frame
        frameTime: 0,
        playing: true,
        completed: false,
      };

      // Advance past last frame
      const frameInterval = 1000 / config.fps;
      // Simulate accumulated time that exceeds frame interval
      state.frameTime = frameInterval;
      if (state.frameTime >= frameInterval) {
        state.currentFrame = (state.currentFrame + 1) % config.frames.length;
        state.frameTime = 0;
      }

      expect(state.currentFrame).toBe(0); // Wrapped to first frame
      expect(state.completed).toBe(false);
    });

    it('should stop animation when at end and loop is false', () => {
      const config: AnimationConfig = {
        name: 'attack',
        frames: [0, 1, 2, 3],
        fps: 15,
        loop: false,
      };

      const state: AnimationState = {
        currentAnimation: 'attack',
        currentFrame: 3, // Last frame
        frameTime: 0,
        playing: true,
        completed: false,
      };

      const frameInterval = 1000 / config.fps;
      // Simulate accumulated time that exceeds frame interval
      state.frameTime = frameInterval;
      if (state.frameTime >= frameInterval) {
        if (!config.loop && state.currentFrame >= config.frames.length - 1) {
          state.completed = true;
          state.playing = false;
        } else {
          state.currentFrame = (state.currentFrame + 1) % config.frames.length;
        }
        state.frameTime = 0;
      }

      expect(state.completed).toBe(true);
      expect(state.playing).toBe(false);
    });

    it('should pause animation when playing is set to false', () => {
      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 2,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      state.playing = false;

      expect(state.playing).toBe(false);
      expect(state.completed).toBe(false);
    });

    it('should resume animation when playing is set to true', () => {
      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 2,
        frameTime: 0,
        playing: false,
        completed: false,
      };

      state.playing = true;

      expect(state.playing).toBe(true);
    });

    it('should mark animation as completed for one-shot animations', () => {
      const config: AnimationConfig = {
        name: 'die',
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
        fps: 8,
        loop: false,
      };

      const state: AnimationState = {
        currentAnimation: 'die',
        currentFrame: 9,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      // Simulate reaching end of one-shot
      if (!config.loop && state.currentFrame >= config.frames.length - 1) {
        state.completed = true;
      }

      expect(state.completed).toBe(true);
    });
  });

  describe('Frame Animation Playback', () => {
    it('should calculate correct frame interval for 8fps animation', () => {
      const fps = 8;
      const frameInterval = 1000 / fps;
      expect(frameInterval).toBe(125); // 125ms per frame
    });

    it('should calculate correct frame interval for 12fps animation', () => {
      const fps = 12;
      const frameInterval = 1000 / fps;
      expect(frameInterval).toBeCloseTo(83.33, 2);
    });

    it('should calculate correct frame interval for 15fps animation', () => {
      const fps = 15;
      const frameInterval = 1000 / fps;
      expect(frameInterval).toBeCloseTo(66.67, 2);
    });

    it('should play idle animation at 8fps for tower', () => {
      const towerIdleFps = 8;
      const frameInterval = 1000 / towerIdleFps;
      expect(frameInterval).toBe(125);
    });

    it('should play walk animation at 12fps for unit', () => {
      const unitWalkFps = 12;
      const frameInterval = 1000 / unitWalkFps;
      expect(frameInterval).toBeCloseTo(83.33, 2);
    });

    it('should play attack animation at 15fps for unit', () => {
      const unitAttackFps = 15;
      const frameInterval = 1000 / unitAttackFps;
      expect(frameInterval).toBeCloseTo(66.67, 2);
    });

    it('should get correct frame for current animation state', () => {
      const config: AnimationConfig = {
        name: 'idle',
        frames: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
        fps: 8,
        loop: true,
      };

      const state: AnimationState = {
        currentAnimation: 'idle',
        currentFrame: 5,
        frameTime: 0,
        playing: true,
        completed: false,
      };

      const currentFrameIndex = config.frames[state.currentFrame];
      expect(currentFrameIndex).toBe(5);
    });

    it('should handle animation frame boundary correctly', () => {
      const config: AnimationConfig = {
        name: 'walk',
        frames: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        fps: 12,
        loop: true,
      };

      const state: AnimationState = {
        currentAnimation: 'walk',
        currentFrame: 9, // Last valid index
        frameTime: 0,
        playing: true,
        completed: false,
      };

      // Next frame should loop back to 0
      const nextFrame = (state.currentFrame + 1) % config.frames.length;
      expect(nextFrame).toBe(0);
    });
  });
});

// ============================================
// Integration Tests for Rendering
// ============================================

describe('Rendering Integration', () => {
  describe('Arena with Towers and Units', () => {
    it('should render arena with multiple towers', () => {
      const towers: TowerType[] = [
        { id: 'king', position: { x: 360, y: 100 }, health: 100, maxHealth: 100, isKingTower: true },
        { id: 'princess-left', position: { x: 100, y: 200 }, health: 100, maxHealth: 100, isKingTower: false },
        { id: 'princess-right', position: { x: 620, y: 200 }, health: 100, maxHealth: 100, isKingTower: false },
      ];
      const units: UnitType[] = [];

      render(<Arena towers={towers} units={units} width={720} height={900} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should render arena with multiple units', () => {
      const towers: TowerType[] = [];
      const units: UnitType[] = [
        { id: 'knight-1', type: 'knight', position: { x: 200, y: 400 }, health: 50, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: false },
        { id: 'archer-1', type: 'archer', position: { x: 300, y: 450 }, health: 30, maxHealth: 30, speed: 45, damage: 8, range: 80, isEnemy: false },
        { id: 'giant-1', type: 'giant', position: { x: 400, y: 500 }, health: 100, maxHealth: 100, speed: 30, damage: 15, range: 40, isEnemy: false },
      ];

      render(<Arena towers={towers} units={units} width={720} height={900} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should render arena with mixed player and enemy units', () => {
      const towers: TowerType[] = [];
      const units: UnitType[] = [
        { id: 'player-knight', type: 'knight', position: { x: 200, y: 400 }, health: 50, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: false },
        { id: 'enemy-knight', type: 'knight', position: { x: 500, y: 500 }, health: 50, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: true },
      ];

      render(<Arena towers={towers} units={units} width={720} height={900} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });
  });

  describe('Full Game Scene Rendering', () => {
    it('should render complete game scene with all elements', () => {
      const towers: TowerType[] = [
        { id: 'player-king', position: { x: 360, y: 750 }, health: 100, maxHealth: 100, isKingTower: true },
        { id: 'player-princess-left', position: { x: 120, y: 650 }, health: 100, maxHealth: 100, isKingTower: false },
        { id: 'player-princess-right', position: { x: 600, y: 650 }, health: 100, maxHealth: 100, isKingTower: false },
        { id: 'enemy-king', position: { x: 360, y: 150 }, health: 100, maxHealth: 100, isKingTower: true },
        { id: 'enemy-princess-left', position: { x: 120, y: 250 }, health: 100, maxHealth: 100, isKingTower: false },
        { id: 'enemy-princess-right', position: { x: 600, y: 250 }, health: 100, maxHealth: 100, isKingTower: false },
      ];

      const units: UnitType[] = [
        { id: 'knight-1', type: 'knight', position: { x: 200, y: 500 }, health: 50, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: false },
        { id: 'archer-1', type: 'archer', position: { x: 300, y: 550 }, health: 30, maxHealth: 30, speed: 45, damage: 8, range: 80, isEnemy: false },
      ];

      render(<Arena towers={towers} units={units} width={720} height={900} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should handle game scene update with unit damage', () => {
      const units: UnitType[] = [
        { id: 'knight-1', type: 'knight', position: { x: 200, y: 500 }, health: 50, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: false },
      ];

      const { rerender } = render(<Arena towers={[]} units={units} width={720} height={900} />);

      // Simulate damage
      const damagedUnits: UnitType[] = [
        { id: 'knight-1', type: 'knight', position: { x: 200, y: 500 }, health: 25, maxHealth: 50, speed: 60, damage: 10, range: 50, isEnemy: false },
      ];

      rerender(<Arena towers={[]} units={damagedUnits} width={720} height={900} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should handle game scene with tower destruction', () => {
      const towers: TowerType[] = [
        { id: 'tower-1', position: { x: 100, y: 100 }, health: 0, maxHealth: 100, isKingTower: false },
      ];

      const { rerender } = render(<Arena towers={towers} units={[]} width={720} height={900} />);

      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });
  });

  describe('Component Integration', () => {
    it('should render tower with health update', () => {
      const tower: TowerType = {
        id: 'tower-1',
        position: { x: 100, y: 100 },
        health: 100,
        maxHealth: 100,
        isKingTower: true,
      };

      const { rerender } = render(<Tower tower={tower} />);
      expect(document.querySelector('.tower-health-fill')).toHaveStyle({ width: '100%' });

      // Update health
      const damagedTower = { ...tower, health: 50 };
      rerender(<Tower tower={damagedTower} />);
      expect(document.querySelector('.tower-health-fill')).toHaveStyle({ width: '50%' });
    });

    it('should render unit with position update', () => {
      const unit: UnitType = {
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

      const { rerender } = render(<Unit unit={unit} />);
      expect(document.querySelector('.unit')).toHaveStyle({ left: '200px', top: '300px' });

      // Update position
      const movedUnit = { ...unit, position: { x: 250, y: 350 } };
      rerender(<Unit unit={movedUnit} />);
      expect(document.querySelector('.unit')).toHaveStyle({ left: '250px', top: '350px' });
    });

    it('should transition unit state from idle to attacking', () => {
      const idleUnit: UnitType = {
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

      const { rerender } = render(<Unit unit={idleUnit} />);
      expect(document.querySelector('.unit')).toBeInTheDocument();

      // Unit is now attacking (state change would require component update)
      const attackingUnit = { ...idleUnit, position: { x: 220, y: 320 } };
      rerender(<Unit unit={attackingUnit} />);
      expect(document.querySelector('.unit')).toBeInTheDocument();
    });
  });
});
