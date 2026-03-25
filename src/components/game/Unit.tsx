import React, { useRef, useEffect, useState } from 'react';
import type { Unit as UnitType } from '../../types';

// Unit sprite paths
const UNIT_SPRITE_PATHS: Record<string, string> = {
  Knight: 'assets/game/units/knight.png',
  Archer: 'assets/game/units/archer.png',
  Giant: 'assets/game/units/giant.png',
};

const DEFAULT_UNIT_SPRITE = 'assets/game/units/knight.png';

// Image cache for unit sprites
const unitSpriteCache: Map<string, HTMLImageElement> = new Map();
let spriteLoadError = false;

interface UnitProps {
  unit: UnitType;
}

const Unit: React.FC<UnitProps> = ({ unit }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const spriteRef = useRef<HTMLImageElement | null>(null);

  // Get sprite path for unit type
  const spritePath = UNIT_SPRITE_PATHS[unit.type] || DEFAULT_UNIT_SPRITE;

  // Load unit sprite
  useEffect(() => {
    if (unitSpriteCache.has(unit.type)) {
      spriteRef.current = unitSpriteCache.get(unit.type)!;
      setSpriteLoaded(true);
      return;
    }

    const img = new Image();
    img.src = spritePath;
    img.onload = () => {
      unitSpriteCache.set(unit.type, img);
      spriteRef.current = img;
      setSpriteLoaded(true);
    };
    img.onerror = () => {
      spriteLoadError = true;
    };
  }, [unit.type, spritePath]);

  // Draw unit on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const radius = 15;
    const x = 30; // Center in 60x60 canvas
    const y = 30;

    // Clear canvas for this unit
    ctx.clearRect(0, 0, 60, 60);

    if (spriteLoaded && spriteRef.current) {
      // Draw sprite scaled to unit size
      ctx.drawImage(
        spriteRef.current,
        x - radius,
        y - radius,
        radius * 2,
        radius * 2
      );
    } else {
      // Fallback: Unit circle
      ctx.fillStyle = unit.isEnemy ? '#e74c3c' : '#3498db';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Unit border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

  }, [unit, spriteLoaded]);

  const healthPercent = (unit.health / unit.maxHealth) * 100;

  return (
    <div 
      className={`unit ${unit.isEnemy ? 'enemy' : 'ally'}`}
      style={{
        position: 'absolute',
        left: `${unit.position.x}px`,
        top: `${unit.position.y}px`,
      }}
    >
      <div className="unit-body">
        <canvas 
          ref={canvasRef} 
          width={60} 
          height={60}
          className="unit-canvas"
        />
      </div>
      <div className="unit-health">
        <div 
          className="unit-health-fill" 
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    </div>
  );
};

// Export a function for Arena to use when drawing units directly
export function drawUnit(ctx: CanvasRenderingContext2D, unit: UnitType): void {
  const radius = 15;
  const x = unit.position.x;
  const y = unit.position.y;

  const sprite = unitSpriteCache.get(unit.type);

  if (sprite) {
    // Draw sprite scaled to unit size
    ctx.drawImage(
      sprite,
      x - radius,
      y - radius,
      radius * 2,
      radius * 2
    );
  } else {
    // Fallback: Unit circle
    ctx.fillStyle = unit.isEnemy ? '#e74c3c' : '#3498db';
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();

    // Unit border
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  // Health bar
  const healthPercent = unit.health / unit.maxHealth;
  ctx.fillStyle = '#333';
  ctx.fillRect(x - 12, y - 25, 24, 4);
  ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : '#f44336';
  ctx.fillRect(x - 12, y - 25, 24 * healthPercent, 4);
}

// Preload all unit sprites
export function preloadUnitSprites(): Promise<void>[] {
  return Object.values(UNIT_SPRITE_PATHS).map((path) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.src = path;
      img.onload = () => {
        // Extract unit type from path and cache
        const type = Object.keys(UNIT_SPRITE_PATHS).find(
          (t) => UNIT_SPRITE_PATHS[t] === path
        );
        if (type) {
          unitSpriteCache.set(type, img);
        }
        resolve();
      };
      img.onerror = () => {
        reject(new Error(`Failed to load sprite: ${path}`));
      };
    });
  });
}

export default Unit;
