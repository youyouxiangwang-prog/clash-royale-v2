/**
 * EnvironmentRenderer - Layered Environment Rendering System
 * 
 * Renders the game arena background with proper layer ordering:
 * Layer 1: Arena Base (solid color fallback)
 * Layer 2: Static Arena Background (grass texture)
 * Layer 3: Decorative Elements (trees, bushes, rocks)
 * Layer 4: Animated Arena (water frame overlays)
 * Layer 5: River (procedural water with waves)
 * Layer 6: Bridges (sprite or procedural)
 */

import {
  DecorationPlacement,
  ArenaConfig,
  getDefaultAvoidZones,
  isInAvoidZone,
} from './types/environment';

// Asset paths
const ASSET_BASE = '/assets/game/';
const ARENA_BACKGROUND_PATH = ASSET_BASE + 'arena_background.png';
const ARENA_ANIMATION_PATH = ASSET_BASE + 'arena_animation/level_barbarian_arena_sprite_';
const DECOS_PATH = ASSET_BASE + 'environment/decos/level_decos_sprite_';

export class EnvironmentRenderer {
  // Configuration
  private config: ArenaConfig;
  
  // === LAYER 2: Background Image ===
  private backgroundImage: HTMLImageElement | null = null;
  
  // === LAYER 4: Animation Frames (water effects) ===
  private animationFrames: HTMLImageElement[] = [];
  private currentFrame: number = 0;
  private animationTime: number = 0;
  
  // === LAYER 3: Decorations ===
  private decosSprites: Map<number, HTMLImageElement> = new Map();
  private decorations: DecorationPlacement[] = [];
  
  // === LAYER 5: River Animation ===
  private riverTime: number = 0;
  
  // === State ===
  private assetsLoaded: boolean = false;
  
  constructor(config: ArenaConfig) {
    this.config = config;
  }
  
  /**
   * LAYER 1: Render solid color base (fallback)
   */
  renderLayer1_Base(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.config;
    ctx.fillStyle = '#3d6b41'; // Default grass green
    ctx.fillRect(0, 0, width, height);
  }
  
  /**
   * LAYER 2: Render static arena background
   */
  async renderLayer2_Background(ctx: CanvasRenderingContext2D): Promise<void> {
    const { width, height } = this.config;
    
    if (!this.backgroundImage) {
      // Try to load background if not loaded
      try {
        this.backgroundImage = await this.loadImage(ARENA_BACKGROUND_PATH);
      } catch {
        console.warn('Background not available, using gradient');
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, '#4a7c4e');
        gradient.addColorStop(0.5, '#3d6b41');
        gradient.addColorStop(1, '#4a7c4e');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
        return;
      }
    }
    
    if (this.backgroundImage) {
      ctx.drawImage(this.backgroundImage, 0, 0, width, height);
    }
  }
  
  /**
   * LAYER 3: Render decorative elements (trees, bushes, rocks)
   */
  async renderLayer3_Decorations(ctx: CanvasRenderingContext2D): Promise<void> {
    if (this.decorations.length === 0) return;
    
    for (const deco of this.decorations) {
      const sprite = this.decosSprites.get(deco.spriteIndex);
      if (!sprite) continue;
      
      ctx.save();
      
      const scaledWidth = sprite.width * deco.scale;
      const scaledHeight = sprite.height * deco.scale;
      const drawX = deco.x - scaledWidth / 2;
      const drawY = deco.y - scaledHeight;
      
      // Apply horizontal flip if needed
      if (deco.flip) {
        ctx.translate(deco.x, 0);
        ctx.scale(-1, 1);
        ctx.translate(-deco.x, 0);
      }
      
      ctx.drawImage(sprite, drawX, drawY, scaledWidth, scaledHeight);
      ctx.restore();
    }
  }
  
  /**
   * LAYER 4: Render animated arena (water frame overlay)
   */
  renderLayer4_AnimatedOverlay(ctx: CanvasRenderingContext2D): void {
    const { width, riverY, riverHeight } = this.config;
    
    // Only draw if we have animation frames
    if (!this.animationFrames[this.currentFrame]) return;
    
    // The animation frames are large arena sprites with water effects
    // We only want to show the river portion
    const frame = this.animationFrames[this.currentFrame];
    
    // Draw the frame but only for the river area
    ctx.save();
    ctx.globalAlpha = 0.4; // Subtle overlay
    
    // Source: full frame
    // Dest: only river band
    ctx.drawImage(
      frame,
      0, 0, frame.width, frame.height,  // Source rect (full frame)
      0, riverY - riverHeight / 2, width, riverHeight  // Dest rect (river area)
    );
    
    ctx.restore();
  }
  
  /**
   * LAYER 5: Render procedural river with waves
   */
  renderLayer5_River(ctx: CanvasRenderingContext2D): void {
    const { width, riverY, riverHeight } = this.config;
    const riverTop = riverY - riverHeight / 2;
    
    // Base water color
    ctx.fillStyle = '#3a6ad9';
    ctx.fillRect(0, riverTop, width, riverHeight);
    
    // Darker edges gradient
    const edgeGradient = ctx.createLinearGradient(0, riverTop, 0, riverTop + riverHeight);
    edgeGradient.addColorStop(0, 'rgba(0,0,0,0.25)');
    edgeGradient.addColorStop(0.2, 'rgba(0,0,0,0)');
    edgeGradient.addColorStop(0.8, 'rgba(0,0,0,0)');
    edgeGradient.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = edgeGradient;
    ctx.fillRect(0, riverTop, width, riverHeight);
    
    // Animated wave lines
    const waveCount = 6;
    for (let i = 0; i < waveCount; i++) {
      const yOffset = (this.riverTime * 30 + i * 25) % riverHeight;
      const waveY = riverTop + yOffset;
      
      if (waveY < riverTop || waveY > riverTop + riverHeight) continue;
      
      ctx.strokeStyle = `rgba(100, 181, 246, ${0.35 - i * 0.05})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x += 8) {
        const wave = Math.sin((x + this.riverTime * 60) * 0.025) * 2.5;
        const y = waveY + wave;
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    }
  }
  
  /**
   * LAYER 6: Render bridges
   */
  renderLayer6_Bridges(ctx: CanvasRenderingContext2D): void {
    const { bridgePositions } = this.config;
    
    // Try bridge sprite first (index 101)
    const bridgeSprite = this.decosSprites.get(101);
    
    for (const pos of bridgePositions) {
      if (bridgeSprite) {
        // Draw bridge sprite
        const scale = 1.0;
        const w = bridgeSprite.width * scale;
        const h = bridgeSprite.height * scale;
        ctx.drawImage(bridgeSprite, pos.x - w / 2, pos.y - h / 2, w, h);
      } else {
        // Fallback: procedural wooden bridge
        this.drawProceduralBridge(ctx, pos.x, pos.y);
      }
    }
  }
  
  /**
   * Draw a procedural bridge as fallback
   */
  private drawProceduralBridge(ctx: CanvasRenderingContext2D, x: number, y: number): void {
    const bridgeWidth = 70;
    const bridgeHeight = 40;
    
    // Bridge deck
    const deckGradient = ctx.createLinearGradient(
      x - bridgeWidth / 2, y - bridgeHeight / 2,
      x + bridgeWidth / 2, y + bridgeHeight / 2
    );
    deckGradient.addColorStop(0, '#8b6914');
    deckGradient.addColorStop(0.5, '#a67c00');
    deckGradient.addColorStop(1, '#8b6914');
    
    ctx.fillStyle = deckGradient;
    ctx.fillRect(x - bridgeWidth / 2, y - bridgeHeight / 2, bridgeWidth, bridgeHeight);
    
    // Wood planks
    ctx.strokeStyle = '#5c4510';
    ctx.lineWidth = 1;
    for (let i = 0; i < 5; i++) {
      const plankX = x - bridgeWidth / 2 + (i + 0.5) * (bridgeWidth / 5);
      ctx.beginPath();
      ctx.moveTo(plankX, y - bridgeHeight / 2);
      ctx.lineTo(plankX, y + bridgeHeight / 2);
      ctx.stroke();
    }
    
    // Rails
    ctx.fillStyle = '#c9a227';
    ctx.fillRect(x - bridgeWidth / 2 - 2, y - bridgeHeight / 2 - 4, bridgeWidth + 4, 3);
    ctx.fillRect(x - bridgeWidth / 2 - 2, y + bridgeHeight / 2 + 1, bridgeWidth + 4, 3);
  }
  
  /**
   * Load a single image
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load: ${src}`));
      img.src = src;
    });
  }
  
  /**
   * Load all assets (non-blocking)
   */
  async loadAssets(): Promise<void> {
    if (this.assetsLoaded) return;
    
    console.log('EnvironmentRenderer: Loading assets...');
    
    // Load background (critical)
    try {
      this.backgroundImage = await this.loadImage(ARENA_BACKGROUND_PATH);
      console.log('EnvironmentRenderer: Background loaded');
    } catch (e) {
      console.error('EnvironmentRenderer: Background failed');
    }
    
    // Load animation frames
    for (let i = 0; i < 34; i++) {
      const frameIndex = i.toString().padStart(2, '0');
      this.loadImage(`${ARENA_ANIMATION_PATH}${frameIndex}.png`).then(img => {
        this.animationFrames[i] = img;
      }).catch(() => {});
    }
    
    // Load decoration sprites (indices 0-106)
    for (let i = 0; i < 107; i++) {
      const spriteIndex = i.toString().padStart(3, '0');
      this.loadImage(`${DECOS_PATH}${spriteIndex}.png`).then(img => {
        this.decosSprites.set(i, img);
      }).catch(() => {});
    }
    
    this.assetsLoaded = true;
    console.log('EnvironmentRenderer: Assets loading in background');
  }
  
  /**
   * Generate default decoration placement
   */
  generateDefaultDecorations(): void {
    const { width, height } = this.config;
    const avoidZones = getDefaultAvoidZones(this.config);
    this.decorations = [];
    
    const isValidPosition = (x: number, y: number, margin: number = 35): boolean => {
      if (isInAvoidZone(x, y, avoidZones)) return false;
      for (const deco of this.decorations) {
        const dist = Math.sqrt((x - deco.x) ** 2 + (y - deco.y) ** 2);
        if (dist < margin) return false;
      }
      if (x < 30 || x > width - 30 || y < 30 || y > height - 30) return false;
      return true;
    };
    
    const addSymmetric = (x: number, y: number, spriteIndex: number, scale: number) => {
      const mirrorX = width - x;
      if (isValidPosition(x, y)) {
        this.decorations.push({ spriteIndex, x, y, scale, flip: x > width / 2 });
      }
      if (isValidPosition(mirrorX, y)) {
        this.decorations.push({ spriteIndex, x: mirrorX, y, scale, flip: mirrorX > width / 2 });
      }
    };
    
    // Trees in corners
    addSymmetric(45, 65, 0, 0.85);
    addSymmetric(80, 45, 1, 0.8);
    addSymmetric(35, 105, 2, 0.75);
    addSymmetric(45, height - 65, 3, 0.85);
    addSymmetric(80, height - 45, 4, 0.8);
    addSymmetric(35, height - 105, 5, 0.75);
    
    // Bushes near lanes
    addSymmetric(95, 85, 16, 0.6);
    addSymmetric(145, 105, 17, 0.55);
    addSymmetric(95, height - 85, 18, 0.6);
    addSymmetric(145, height - 105, 19, 0.55);
    
    // Rocks scattered
    addSymmetric(115, 155, 41, 0.55);
    addSymmetric(155, 195, 42, 0.5);
    addSymmetric(115, height - 155, 43, 0.55);
    addSymmetric(155, height - 195, 44, 0.5);
    
    console.log(`EnvironmentRenderer: ${this.decorations.length} decorations placed`);
  }
  
  /**
   * Update animation state
   */
  update(deltaTime: number): void {
    // Animate water frames
    this.animationTime += deltaTime;
    if (this.animationTime > 0.08) { // ~12fps
      this.animationTime = 0;
      this.currentFrame = (this.currentFrame + 1) % 34;
    }
    
    // Animate river
    this.riverTime += deltaTime;
  }
  
  /**
   * Render all layers in order
   */
  async render(ctx: CanvasRenderingContext2D, deltaTime: number): Promise<void> {
    this.update(deltaTime);
    
    // Layer 1: Base
    this.renderLayer1_Base(ctx);
    
    // Layer 2: Background
    await this.renderLayer2_Background(ctx);
    
    // Layer 3: Decorations
    await this.renderLayer3_Decorations(ctx);
    
    // Layer 4: Animated overlay
    this.renderLayer4_AnimatedOverlay(ctx);
    
    // Layer 5: River
    this.renderLayer5_River(ctx);
    
    // Layer 6: Bridges
    this.renderLayer6_Bridges(ctx);
  }
  
  isReady(): boolean {
    return this.assetsLoaded;
  }
}

export default EnvironmentRenderer;
