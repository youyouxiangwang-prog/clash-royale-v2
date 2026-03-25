import type { Tower as TowerType } from '../../types';

// Tower sprite constants
const TOWER_SPRITE_PATH = '/assets/game/tower.png';

// Global sprite cache - shared across all Tower instances
let towerSpriteCache: HTMLImageElement | null = null;
let spriteLoadAttempted: boolean = false;

/**
 * Preload the tower sprite at module initialization
 * This runs immediately when the module is imported
 */
function preloadTowerSprite(): void {
  if (spriteLoadAttempted) return;
  spriteLoadAttempted = true;
  
  console.log('Tower: Starting sprite preload from', TOWER_SPRITE_PATH);
  
  const img = new Image();
  img.onload = () => {
    console.log('Tower: Sprite preloaded successfully!');
    towerSpriteCache = img;
  };
  img.onerror = (err) => {
    console.error('Tower: Sprite preload failed', err);
  };
  img.src = TOWER_SPRITE_PATH;
}

// Initiate preload immediately
preloadTowerSprite();

/**
 * Draw a tower onto any canvas context
 * Uses sprite if available, otherwise falls back to geometry
 */
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
    // Fallback: procedural tower
    // Tower base
    ctx.fillStyle = tower.isKingTower ? '#8b4513' : '#a0522d';
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

  // Health bar
  const healthPercent = tower.health / tower.maxHealth;
  const barWidth = size;
  const barHeight = 5;
  const barY = y - size - 12;

  ctx.fillStyle = '#333';
  ctx.fillRect(x - barWidth / 2, barY, barWidth, barHeight);

  ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : healthPercent > 0.25 ? '#ff9800' : '#f44336';
  ctx.fillRect(x - barWidth / 2, barY, barWidth * healthPercent, barHeight);
}

// Legacy export for backwards compatibility if used as React component
export function preloadTowerSpritePromise(): Promise<void> {
  return new Promise((resolve) => {
    if (towerSpriteCache) {
      resolve();
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      towerSpriteCache = img;
      resolve();
    };
    img.onerror = () => {
      resolve(); // Don't reject, just continue without sprite
    };
    img.src = TOWER_SPRITE_PATH;
  });
}
