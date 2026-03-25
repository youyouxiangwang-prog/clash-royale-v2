import React, { useRef, useEffect, useState } from 'react';
import type { Tower as TowerType, Unit as UnitType } from '../../types';
import { drawTower } from './Tower';
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
  width = 800, 
  height = 600 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const envRendererRef = useRef<EnvironmentRenderer | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  const [isEnvReady, setIsEnvReady] = useState(false);

  // Bridge positions (left and right bridges for portrait arena)
  const bridgePositions = [
    { x: width * 0.25, y: height / 2 },
    { x: width * 0.75, y: height / 2 },
  ];

  // River height should be proportional to arena size
  const riverHeight = Math.round(height * 0.05); // ~5% of height = ~42 for 832

  // Initialize environment renderer
  useEffect(() => {
    const config: ArenaConfig = {
      width,
      height,
      riverY: height / 2,
      riverHeight,
      bridgePositions,
    };

    const envRenderer = new EnvironmentRenderer(config);
    envRendererRef.current = envRenderer;

    // Load assets
    envRenderer.loadAssets()
      .then(() => {
        envRenderer.generateDefaultDecorations();
        setIsEnvReady(true);
        console.log('Arena: Environment ready');
      })
      .catch(err => {
        console.error('Arena: Failed to load environment assets', err);
        setIsEnvReady(true); // Continue anyway with fallback
      });

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [width, height]);

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      const deltaTime = (time - lastTimeRef.current) / 1000;
      lastTimeRef.current = time;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Render environment if ready
      if (envRendererRef.current && isEnvReady) {
        envRendererRef.current.render(ctx, deltaTime);
      } else {
        // Fallback: simple grass gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4a7c4e');
        gradient.addColorStop(1, '#3d6b41');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
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
  }, [towers, units, width, height, isEnvReady]);

  return (
    <div className="arena-container" style={{ position: 'relative', width, height }}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className="arena-canvas"
        role="img"
        aria-label="arena"
      />
    </div>
  );
};

export default Arena;
