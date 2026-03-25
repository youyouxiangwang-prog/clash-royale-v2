import React, { useRef, useEffect, useState } from 'react';
import type { Tower as TowerType, Unit as UnitType } from '../../types';
import { drawTower } from './Tower';
import { drawUnit } from './Unit';

// Arena texture constants
const ARENA_TEXTURE_PATH = 'assets/game/arena_training_tex.png';
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

    // Draw towers using sprite
    towers.forEach((tower) => {
      drawTower(ctx, tower);
    });

    // Draw units using sprites
    units.forEach((unit) => {
      drawUnit(ctx, unit);
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
