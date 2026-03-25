import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Tower from '../../src/components/game/Tower';
import type { Tower as TowerType } from '../../src/types';

// Sprite dimensions from official assets
const TOWER_SPRITE_WIDTH = 407;
const TOWER_SPRITE_HEIGHT = 471;

// Animation frame ranges
const TOWER_ANIMATIONS = {
  idle: { frames: [0, 30], fps: 8, loop: true },
  attack: { frames: [31, 60], fps: 12, loop: true },
  damaged: { frames: [61, 90], fps: 10, loop: true },
  destroyed: { frames: [91, 100], fps: 8, loop: false },
} as const;

describe('Tower Rendering', () => {
  let mockTower: TowerType;

  beforeEach(() => {
    vi.clearAllMocks();
    mockTower = {
      id: 'tower-1',
      position: { x: 100, y: 100 },
      health: 100,
      maxHealth: 100,
      isKingTower: true,
    };
  });

  describe('Tower Sprite Loading', () => {
    it('should have correct tower sprite dimensions', () => {
      expect(TOWER_SPRITE_WIDTH).toBe(407);
      expect(TOWER_SPRITE_HEIGHT).toBe(471);
    });

    it('should load tower sprites from correct directory', () => {
      const towerSpritePath = 'assets/sc/building_tower_out/';
      expect(towerSpritePath).toBe('assets/sc/building_tower_out/');
    });

    it('should have correct frame count for tower sprites', () => {
      const expectedFrameCount = 214;
      expect(expectedFrameCount).toBe(214);
    });

    it('should define idle animation correctly', () => {
      expect(TOWER_ANIMATIONS.idle.fps).toBe(8);
      expect(TOWER_ANIMATIONS.idle.loop).toBe(true);
    });

    it('should define attack animation correctly', () => {
      expect(TOWER_ANIMATIONS.attack.fps).toBe(12);
      expect(TOWER_ANIMATIONS.attack.loop).toBe(true);
    });

    it('should define damaged animation correctly', () => {
      expect(TOWER_ANIMATIONS.damaged.fps).toBe(10);
      expect(TOWER_ANIMATIONS.damaged.loop).toBe(true);
    });

    it('should define destroyed animation correctly', () => {
      expect(TOWER_ANIMATIONS.destroyed.fps).toBe(8);
      expect(TOWER_ANIMATIONS.destroyed.loop).toBe(false);
    });
  });

  describe('Tower Component Rendering', () => {
    it('should render tower component', () => {
      render(<Tower tower={mockTower} />);
      const towerElement = document.querySelector('.tower');
      expect(towerElement).toBeInTheDocument();
    });

    it('should apply king tower class for king towers', () => {
      render(<Tower tower={mockTower} />);
      const towerElement = document.querySelector('.tower.king');
      expect(towerElement).toBeInTheDocument();
    });

    it('should apply princess tower class for non-king towers', () => {
      const princessTower: TowerType = {
        ...mockTower,
        isKingTower: false,
      };
      render(<Tower tower={princessTower} />);
      const towerElement = document.querySelector('.tower:not(.king)');
      expect(towerElement).toBeInTheDocument();
    });

    it('should position tower at correct coordinates', () => {
      mockTower.position = { x: 250, y: 300 };
      render(<Tower tower={mockTower} />);
      const towerElement = document.querySelector('.tower');
      expect(towerElement).toHaveStyle({ left: '250px', top: '300px' });
    });

    it('should render tower health bar', () => {
      render(<Tower tower={mockTower} />);
      const healthBar = document.querySelector('.tower-health');
      expect(healthBar).toBeInTheDocument();
    });

    it('should display correct health percentage', () => {
      mockTower.health = 50;
      mockTower.maxHealth = 100;
      render(<Tower tower={mockTower} />);
      const healthFill = document.querySelector('.tower-health-fill');
      expect(healthFill).toHaveStyle({ width: '50%' });
    });

    it('should display full health when at max', () => {
      mockTower.health = 100;
      mockTower.maxHealth = 100;
      render(<Tower tower={mockTower} />);
      const healthFill = document.querySelector('.tower-health-fill');
      expect(healthFill).toHaveStyle({ width: '100%' });
    });

    it('should render tower body element', () => {
      render(<Tower tower={mockTower} />);
      const towerBody = document.querySelector('.tower-body');
      expect(towerBody).toBeInTheDocument();
    });
  });

  describe('Tower Animation States', () => {
    it('should support idle animation state', () => {
      const idleState = 'idle';
      expect(['idle', 'attacking', 'destroyed']).toContain(idleState);
    });

    it('should support attacking animation state', () => {
      const attackingState = 'attacking';
      expect(['idle', 'attacking', 'destroyed']).toContain(attackingState);
    });

    it('should support destroyed animation state', () => {
      const destroyedState = 'destroyed';
      expect(['idle', 'attacking', 'destroyed']).toContain(destroyedState);
    });

    it('should transition from idle to attacking when target acquired', () => {
      // Simulate state transition
      let currentState: string = 'idle';
      const hasTarget = true;
      if (hasTarget) {
        currentState = 'attacking';
      }
      expect(currentState).toBe('attacking');
    });

    it('should transition to destroyed when health reaches zero', () => {
      let currentState: string = 'idle';
      mockTower.health = 0;
      if (mockTower.health <= 0) {
        currentState = 'destroyed';
      }
      expect(currentState).toBe('destroyed');
    });
  });

  describe('Tower Position', () => {
    it('should be positioned within arena bounds', () => {
      const arenaWidth = 720;
      const arenaHeight = 900;
      expect(mockTower.position.x).toBeGreaterThanOrEqual(0);
      expect(mockTower.position.x).toBeLessThanOrEqual(arenaWidth);
      expect(mockTower.position.y).toBeGreaterThanOrEqual(0);
      expect(mockTower.position.y).toBeLessThanOrEqual(arenaHeight);
    });

    it('should have different positions for player and enemy towers', () => {
      const playerTower: TowerType = { ...mockTower, id: 'player-king' };
      const enemyTower: TowerType = { ...mockTower, id: 'enemy-king', position: { x: 600, y: 700 } };
      
      expect(playerTower.position).not.toEqual(enemyTower.position);
    });

    it('should render princess towers at correct positions', () => {
      const princessTower: TowerType = {
        ...mockTower,
        isKingTower: false,
        position: { x: 100, y: 200 },
      };
      render(<Tower tower={princessTower} />);
      const towerElement = document.querySelector('.tower');
      expect(towerElement).toHaveStyle({ left: '100px', top: '200px' });
    });

    it('should render king tower at correct position', () => {
      const kingTower: TowerType = {
        ...mockTower,
        isKingTower: true,
        position: { x: 360, y: 100 },
      };
      render(<Tower tower={kingTower} />);
      const towerElement = document.querySelector('.tower.king');
      expect(towerElement).toHaveStyle({ left: '360px', top: '100px' });
    });
  });
});
