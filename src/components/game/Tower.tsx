/**
 * Tower Component - Tower sprite rendering with princess overlay
 * 
 * Features:
 * - Enemy towers: draw sprite normally
 * - Player towers: draw sprite with horizontal flip
 * - Princess overlay on top of tower sprite
 */

import type { Tower as TowerType } from '../../types';

// Sprite paths
const SPRITE_PATHS = {
  king: '/assets/game/tower-sprites/enemy-king-1.png',
  princess: '/assets/game/tower-sprites/enemy-princess-1.png',
};

// Global sprite cache
const spriteCache: Map<string, HTMLImageElement> = new Map();
let spritesLoaded: boolean = false;
let loadingPromise: Promise<void> | null = null;

/**
 * Preload all tower sprites
 */
function preloadSprites(): Promise<void> {
  if (spritesLoaded) return Promise.resolve();
  if (loadingPromise) return loadingPromise;
  
  loadingPromise = Promise.all([
    loadSprite('king', SPRITE_PATHS.king),
    loadSprite('princess', SPRITE_PATHS.princess),
  ]).then(() => {
    spritesLoaded = true;
    console.log('Tower sprites loaded');
  });
  
  return loadingPromise;
}

function loadSprite(key: string, src: string): Promise<void> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      spriteCache.set(key, img);
      resolve();
    };
    img.onerror = () => {
      console.error(`Failed to load sprite: ${src}`);
      resolve(); // Don't block
    };
    img.src = src;
  });
}

// Start preloading immediately
preloadSprites();

/**
 * Draw a tower with princess overlay
 */
export function drawTower(
  ctx: CanvasRenderingContext2D,
  tower: TowerType
): void {
  const x = tower.position.x;
  const y = tower.position.y;
  const isEnemy = tower.team === 'enemy';
  const isKing = tower.isKingTower;
  
  // Get base size for tower
  const baseSize = isKing ? 60 : 45;
  
  // Draw tower base (king tower sprite)
  const kingSprite = spriteCache.get('king');
  if (kingSprite) {
    ctx.save();
    
    // Horizontal flip for player towers
    if (!isEnemy) {
      ctx.translate(x, 0);
      ctx.scale(-1, 1);
      ctx.translate(-x, 0);
    }
    
    // Draw king tower sprite centered
    ctx.drawImage(
      kingSprite,
      x - baseSize / 2,
      y - baseSize,
      baseSize,
      baseSize
    );
    
    ctx.restore();
  } else {
    // Fallback: geometric tower
    drawFallbackTower(ctx, x, y, baseSize, isKing);
  }
  
  // Draw princess overlay on top of tower
  drawPrincessOverlay(ctx, tower);
  
  // Draw health bar
  drawHealthBar(ctx, x, y - baseSize - 15, baseSize);
}

/**
 * Draw princess overlay on tower
 */
function drawPrincessOverlay(ctx: CanvasRenderingContext2D, tower: TowerType): void {
  const x = tower.position.x;
  const y = tower.position.y;
  const isEnemy = tower.team === 'enemy';
  const isKing = tower.isKingTower;
  
  // Princess sprite size
  const princessSize = isKing ? 35 : 28;
  
  // Princess is positioned on top of tower, slightly offset upward
  const princessY = y - (isKing ? 85 : 65);
  
  const princessSprite = spriteCache.get('princess');
  if (princessSprite) {
    ctx.save();
    
    // Horizontal flip for player towers
    if (!isEnemy) {
      ctx.translate(x, 0);
      ctx.scale(-1, 1);
      ctx.translate(-x, 0);
    }
    
    // Draw princess sprite centered on top
    ctx.drawImage(
      princessSprite,
      x - princessSize / 2,
      princessY,
      princessSize,
      princessSize
    );
    
    ctx.restore();
  }
}

/**
 * Draw fallback geometric tower
 */
function drawFallbackTower(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  size: number,
  isKing: boolean
): void {
  // Tower base
  ctx.fillStyle = isKing ? '#8b4513' : '#a0522d';
  ctx.fillRect(x - size / 2, y - size / 2, size, size);
  
  // Tower top (triangle)
  ctx.fillStyle = '#cd853f';
  ctx.beginPath();
  ctx.moveTo(x - size / 2, y - size / 2);
  ctx.lineTo(x, y - size);
  ctx.lineTo(x + size / 2, y - size / 2);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draw health bar above tower
 */
function drawHealthBar(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number
): void {
  // Background
  ctx.fillStyle = '#333';
  ctx.fillRect(x - width / 2, y, width, 5);
  
  // Health fill (would need tower.health/tower.maxHealth)
  ctx.fillStyle = '#4caf50';
  ctx.fillRect(x - width / 2, y, width, 5);
}

/**
 * Preload sprites promise for external use
 */
export function preloadTowerSprites(): Promise<void> {
  return preloadSprites();
}
