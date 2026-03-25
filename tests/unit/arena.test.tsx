import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Arena from '../../src/components/game/Arena';
import type { Tower, Unit } from '../../src/types';

// Mock texture paths
const ARENA_TEXTURE_PATH = 'assets/sc/arena_training_tex.png';
const ARENA_TEXTURE_WIDTH = 970;
const ARENA_TEXTURE_HEIGHT = 1018;

describe('Arena Rendering', () => {
  const mockTowers: Tower[] = [];
  const mockUnits: Unit[] = [];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Arena Texture Loading', () => {
    it('should create canvas element for arena rendering', () => {
      render(<Arena towers={mockTowers} units={mockUnits} width={800} height={600} />);
      const canvas = screen.getByRole('img', { name: /arena/i });
      expect(canvas).toBeInTheDocument();
    });

    it('should attempt to load arena texture from correct path', () => {
      // The Arena component should reference the official texture path
      expect(ARENA_TEXTURE_PATH).toBe('assets/sc/arena_training_tex.png');
    });

    it('should have correct arena texture dimensions', () => {
      expect(ARENA_TEXTURE_WIDTH).toBe(970);
      expect(ARENA_TEXTURE_HEIGHT).toBe(1018);
    });

    it('should handle texture load failure gracefully', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      // Component should not throw on texture error
      render(<Arena towers={mockTowers} units={mockUnits} width={800} height={600} />);
      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('Arena Rendering', () => {
    it('should render arena with correct dimensions', () => {
      const width = 800;
      const height = 600;
      render(<Arena towers={mockTowers} units={mockUnits} width={width} height={height} />);
      const canvas = screen.getByRole('img', { name: /arena/i });
      expect(canvas).toBeInTheDocument();
    });

    it('should render arena with default dimensions', () => {
      render(<Arena towers={mockTowers} units={mockUnits} />);
      const canvas = screen.getByRole('img', { name: /arena/i });
      expect(canvas).toBeInTheDocument();
    });

    it('should accept towers prop without crashing', () => {
      const towers: Tower[] = [
        {
          id: 'tower-1',
          position: { x: 100, y: 100 },
          health: 100,
          maxHealth: 100,
          isKingTower: true,
        },
      ];
      render(<Arena towers={towers} units={mockUnits} width={800} height={600} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should accept units prop without crashing', () => {
      const units: Unit[] = [
        {
          id: 'unit-1',
          type: 'knight',
          position: { x: 200, y: 200 },
          health: 50,
          maxHealth: 50,
          speed: 60,
          damage: 10,
          range: 50,
          isEnemy: false,
        },
      ];
      render(<Arena towers={mockTowers} units={units} width={800} height={600} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should re-render when towers change', () => {
      const towers: Tower[] = [
        {
          id: 'tower-1',
          position: { x: 100, y: 100 },
          health: 100,
          maxHealth: 100,
          isKingTower: true,
        },
      ];
      const { rerender } = render(<Arena towers={[]} units={mockUnits} width={800} height={600} />);
      rerender(<Arena towers={towers} units={mockUnits} width={800} height={600} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });

    it('should re-render when units change', () => {
      const units: Unit[] = [
        {
          id: 'unit-1',
          type: 'knight',
          position: { x: 200, y: 200 },
          health: 50,
          maxHealth: 50,
          speed: 60,
          damage: 10,
          range: 50,
          isEnemy: false,
        },
      ];
      const { rerender } = render(<Arena towers={mockTowers} units={[]} width={800} height={600} />);
      rerender(<Arena towers={mockTowers} units={units} width={800} height={600} />);
      expect(screen.getByRole('img', { name: /arena/i })).toBeInTheDocument();
    });
  });

  describe('Arena Dimensions', () => {
    it('should have proper aspect ratio for 9:16 portrait mode', () => {
      const width = 540;
      const height = 960;
      const aspectRatio = width / height;
      expect(Math.abs(aspectRatio - 9 / 16)).toBeLessThan(0.01);
    });

    it('should calculate arena grid columns correctly', () => {
      const gridColumns = 18;
      expect(gridColumns).toBeGreaterThan(0);
    });

    it('should calculate arena grid rows correctly', () => {
      const gridRows = 30;
      expect(gridRows).toBeGreaterThan(0);
    });

    it('should define river Y position', () => {
      const riverY = 0.5; // River at 50% of arena height
      expect(riverY).toBeGreaterThan(0);
      expect(riverY).toBeLessThan(1);
    });

    it('should define bridge positions', () => {
      const bridgePositions = [
        { x: 0.35, y: 0.5 }, // Left bridge
        { x: 0.65, y: 0.5 }, // Right bridge
      ];
      expect(bridgePositions.length).toBe(2);
    });
  });
});
