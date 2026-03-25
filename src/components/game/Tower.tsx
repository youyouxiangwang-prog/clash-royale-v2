import React, { useRef, useEffect, useState } from 'react';
import type { Tower as TowerType } from '../../types';

// Tower sprite constants
const TOWER_SPRITE_PATH = '/assets/game/tower.png';

interface TowerProps {
  tower: TowerType;
}

// Image cache for tower sprite - load immediately when module loads
let towerSpriteCache: HTMLImageElement | null = null;
let spriteLoadingPromise: Promise<void> | null = null;

function ensureSpriteLoaded(): Promise<void> {
  if (towerSpriteCache) return Promise.resolve();
  if (spriteLoadingPromise) return spriteLoadingPromise;
  
  spriteLoadingPromise = new Promise((resolve, reject) => {
    console.log('Tower: Loading sprite from', TOWER_SPRITE_PATH);
    const img = new Image();
    img.onload = () => {
      console.log('Tower: Sprite loaded!');
      towerSpriteCache = img;
      resolve();
    };
    img.onerror = (e) => {
      console.error('Tower: Sprite FAILED to load', e);
      reject(new Error('Failed to load tower sprite'));
    };
    img.src = TOWER_SPRITE_PATH;
  });
  
  return spriteLoadingPromise;
}

// Preload sprite immediately
ensureSpriteLoaded();

const Tower: React.FC<TowerProps> = ({ tower }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spriteLoaded, setSpriteLoaded] = useState(false);
  const spriteRef = useRef<HTMLImageElement | null>(null);

  // Load tower sprite
  useEffect(() => {
    ensureSpriteLoaded().then(() => {
      spriteRef.current = towerSpriteCache;
      setSpriteLoaded(true);
    }).catch(() => {
      // Continue with fallback
      setSpriteLoaded(false);
    });
  }, []);

  // Draw tower on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = tower.isKingTower ? 50 : 35;
    const x = 50; // Center in 100x100 canvas
    const y = 50;

    // Clear canvas for this tower
    ctx.clearRect(0, 0, 100, 100);

    if (spriteLoaded && spriteRef.current) {
      // Draw sprite scaled to tower size, centered
      ctx.drawImage(
        spriteRef.current,
        x - size / 2,
        y - size,
        size,
        size
      );
    } else {
      // Fallback: Tower base
      ctx.fillStyle = tower.isKingTower ? '#8b4513' : '#a0522d';
      ctx.fillRect(x - size / 2, y - size / 2, size, size);

      // Tower top
      ctx.fillStyle = '#cd853f';
      ctx.beginPath();
      ctx.moveTo(x - size / 2, y - size / 2);
      ctx.lineTo(x, y - size);
      ctx.lineTo(x + size / 2, y - size / 2);
      ctx.closePath();
      ctx.fill();
    }

  }, [tower, spriteLoaded]);

  const healthPercent = (tower.health / tower.maxHealth) * 100;

  return (
    <div 
      className={`tower ${tower.isKingTower ? 'king' : 'princess'}`}
      style={{
        position: 'absolute',
        left: `${tower.position.x}px`,
        top: `${tower.position.y}px`,
      }}
    >
      <div className="tower-body">
        <canvas 
          ref={canvasRef} 
          width={100} 
          height={100}
          className="tower-canvas"
        />
      </div>
      <div className="tower-health">
        <div 
          className="tower-health-fill" 
          style={{ width: `${healthPercent}%` }}
        />
      </div>
    </div>
  );
};

// Export a function for Arena to use when drawing towers directly
export function drawTower(ctx: CanvasRenderingContext2D, tower: TowerType): void {
  const size = tower.isKingTower ? 50 : 35;
  const x = tower.position.x;
  const y = tower.position.y;

  if (towerSpriteCache) {
    // Draw sprite scaled to tower size
    ctx.drawImage(
      towerSpriteCache,
      x - size / 2,
      y - size,
      size,
      size
    );
  } else {
    // Fallback: Tower base
    ctx.fillStyle = tower.isKingTower ? '#8b4513' : '#a0522d';
    ctx.fillRect(x - size / 2, y - size / 2, size, size);

    // Tower top
    ctx.fillStyle = '#cd853f';
    ctx.beginPath();
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x, y - size);
    ctx.lineTo(x + size / 2, y - size / 2);
    ctx.closePath();
    ctx.fill();
  }

  // Health bar
  const healthPercent = tower.health / tower.maxHealth;
  ctx.fillStyle = '#333';
  ctx.fillRect(x - size / 2, y - size - 15, size, 6);
  ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : healthPercent > 0.25 ? '#ff9800' : '#f44336';
  ctx.fillRect(x - size / 2, y - size - 15, size * healthPercent, 6);
}

// Preload tower sprite
export function preloadTowerSprite(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (towerSpriteCache) {
      resolve();
      return;
    }
    const img = new Image();
    img.src = TOWER_SPRITE_PATH;
    img.onload = () => {
      towerSpriteCache = img;
      resolve();
    };
    img.onerror = () => {
      reject(new Error('Failed to load tower sprite'));
    };
  });
}

export default Tower;
