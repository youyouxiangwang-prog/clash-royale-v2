import React, { useRef, useEffect } from 'react';
import type { Tower as TowerType, Unit as UnitType } from '../../types';
import { drawTower, preloadTowerSprites } from './Tower';
import { drawUnit } from './Unit';
import { EnvironmentRenderer } from '../../engine/EnvironmentRenderer';
import type { ArenaConfig } from '../../engine/types/environment';

interface ArenaProps {
  towers: TowerType[];
  units: UnitType[];
  width?: number;
  height?: number;
}

const Arena: React.FC<ArenaProps> = ({ 
  towers, 
  units, 
  width = 506, 
  height = 832 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const envRendererRef = useRef<EnvironmentRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // River configuration: Y = 416, bridges at X = 126 and X = 380
  const riverY = 416;
  const riverHeight = 40;
  const bridgePositions = [
    { x: 126, y: riverY },
    { x: 380, y: riverY },
  ];

  // Initialize environment renderer (once)
  useEffect(() => {
    const config: ArenaConfig = {
      width,
      height,
      riverY,
      riverHeight,
      bridgePositions,
    };

    const envRenderer = new EnvironmentRenderer(config);
    envRendererRef.current = envRenderer;

    // Load assets and generate decorations
    envRenderer.loadAssets().then(() => {
      envRenderer.generateDefaultDecorations();
      console.log('Arena: Ready');
    });

    // Preload tower sprites
    preloadTowerSprites();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = async (time: number) => {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render environment layers
      if (envRendererRef.current) {
        await envRendererRef.current.render(ctx, deltaTime);
      }

      // Draw game objects on top
      towers.forEach((tower) => {
        drawTower(ctx, tower);
      });

      units.forEach((unit) => {
        drawUnit(ctx, unit);
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [towers, units, width, height]);

  return (
    <div className="arena-container" style={{ position: 'relative', width, height }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="arena-canvas"
        role="img"
        aria-label="Clash Royale Arena"
      />
    </div>
  );
};

export default Arena;
