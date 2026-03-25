import React, { useRef, useEffect, useState } from 'react';
import type { Tower as TowerType, Unit as UnitType } from '../../types';

// Arena texture constants
const ARENA_TEXTURE_PATH = 'assets/sc/arena_training_tex.png';
const ARENA_TEXTURE_WIDTH = 970;
const ARENA_TEXTURE_HEIGHT = 1018;

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
  const [textureLoaded, setTextureLoaded] = useState(false);
  const [textureError, setTextureError] = useState(false);
  const textureRef = useRef<HTMLImageElement | null>(null);

  // Load arena texture
  useEffect(() => {
    const img = new Image();
    img.src = ARENA_TEXTURE_PATH;
    img.onload = () => {
      textureRef.current = img;
      setTextureLoaded(true);
    };
    img.onerror = () => {
      setTextureError(true);
    };
  }, []);

  // Draw arena
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw background texture if loaded, otherwise draw gradient
    if (textureLoaded && textureRef.current) {
      // Draw texture scaled to fit canvas
      ctx.drawImage(textureRef.current, 0, 0, width, height);
    } else {
      // Draw ground (simple gradient)
      const groundGradient = ctx.createLinearGradient(0, 0, 0, height);
      groundGradient.addColorStop(0, '#4a7c4e');
      groundGradient.addColorStop(1, '#3d6b41');
      ctx.fillStyle = groundGradient;
      ctx.fillRect(0, 0, width, height);
    }

    // Draw lanes
    ctx.strokeStyle = '#3d5a3a';
    ctx.lineWidth = 2;
    ctx.setLineDash([10, 10]);
    
    // Horizontal lane (middle)
    ctx.beginPath();
    ctx.moveTo(0, height / 2);
    ctx.lineTo(width, height / 2);
    ctx.stroke();
    
    // Vertical lanes
    ctx.beginPath();
    ctx.moveTo(width / 3, 0);
    ctx.lineTo(width / 3, height);
    ctx.stroke();
    
    ctx.beginPath();
    ctx.moveTo((width * 2) / 3, 0);
    ctx.lineTo((width * 2) / 3, height);
    ctx.stroke();
    
    ctx.setLineDash([]);

    // Draw river (center)
    ctx.fillStyle = '#5c8dd4';
    ctx.fillRect(0, height / 2 - 10, width, 20);

    // Draw bridges
    ctx.fillStyle = '#8b7355';
    ctx.fillRect(width / 2 - 30, height / 2 - 40, 60, 80);

    // Draw towers
    towers.forEach((tower) => {
      const x = tower.position.x;
      const y = tower.position.y;
      const size = tower.isKingTower ? 50 : 35;

      // Tower base
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

      // Health bar
      const healthPercent = tower.health / tower.maxHealth;
      ctx.fillStyle = '#333';
      ctx.fillRect(x - size / 2, y - size - 15, size, 6);
      ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : healthPercent > 0.25 ? '#ff9800' : '#f44336';
      ctx.fillRect(x - size / 2, y - size - 15, size * healthPercent, 6);
    });

    // Draw units
    units.forEach((unit) => {
      const x = unit.position.x;
      const y = unit.position.y;
      const radius = 15;

      // Unit circle
      ctx.fillStyle = unit.isEnemy ? '#e74c3c' : '#3498db';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Unit border
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Health bar
      const healthPercent = unit.health / unit.maxHealth;
      ctx.fillStyle = '#333';
      ctx.fillRect(x - 12, y - 25, 24, 4);
      ctx.fillStyle = healthPercent > 0.5 ? '#4caf50' : '#f44336';
      ctx.fillRect(x - 12, y - 25, 24 * healthPercent, 4);
    });

  }, [towers, units, width, height, textureLoaded]);

  // Handle texture load failure gracefully
  useEffect(() => {
    if (textureError) {
      console.error('Failed to load arena texture');
    }
  }, [textureError]);

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
