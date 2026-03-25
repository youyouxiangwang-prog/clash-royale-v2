import {
  DecorationPlacement,
  ArenaConfig,
  getDefaultAvoidZones,
  isInAvoidZone,
} from './types/environment';

// Asset paths
const ARENA_BACKGROUND_PATH = 'assets/game/arena_background.png';
const ARENA_ANIMATION_PATH = 'assets/game/arena_animation/';
const DECOS_PATH = 'assets/game/environment/decos/level_decos_sprite_';

export class EnvironmentRenderer {
  // Configuration
  private config: ArenaConfig;
  
  // Assets
  private backgroundImage: HTMLImageElement | null = null;
  private animationFrames: HTMLImageElement[] = [];
  private decosSprites: Map<number, HTMLImageElement> = new Map();
  
  // Animation state
  private currentFrame: number = 0;
  private animationTime: number = 0;
  private isAssetsLoaded: boolean = false;
  
  // Decorations
  private decorations: DecorationPlacement[] = [];
  
  // River animation
  private riverTime: number = 0;
  
  constructor(config: ArenaConfig) {
    this.config = config;
  }
  
  /**
   * Load all environment assets
   */
  async loadAssets(): Promise<void> {
    const loadPromises: Promise<void>[] = [];
    
    // Load background image
    loadPromises.push(this.loadImage(ARENA_BACKGROUND_PATH).then(img => {
      this.backgroundImage = img;
    }));
    
    // Load animation frames (34 frames)
    for (let i = 0; i < 34; i++) {
      const frameIndex = i.toString().padStart(2, '0');
      const path = `${ARENA_ANIMATION_PATH}level_barbarian_arena_sprite_${frameIndex}.png`;
      loadPromises.push(this.loadImage(path).then(img => {
        this.animationFrames[i] = img;
      }));
    }
    
    // Load decoration sprites (107 sprites)
    for (let i = 0; i < 107; i++) {
      const spriteIndex = i.toString().padStart(3, '0');
      const path = `${DECOS_PATH}${spriteIndex}.png`;
      loadPromises.push(this.loadImage(path).then(img => {
        this.decosSprites.set(i, img);
      }));
    }
    
    await Promise.all(loadPromises);
    this.isAssetsLoaded = true;
    console.log('EnvironmentRenderer: All assets loaded');
  }
  
  /**
   * Load a single image
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  }
  
  /**
   * Check if assets are loaded
   */
  isReady(): boolean {
    return this.isAssetsLoaded;
  }
  
  /**
   * Generate default decoration placement
   * Places trees, bushes, rocks in a realistic Clash Royale style layout
   * Uses symmetric placement and avoids lanes/towers
   */
  generateDefaultDecorations(): void {
    const { width, height } = this.config;
    const avoidZones = getDefaultAvoidZones(this.config);
    const decorations: DecorationPlacement[] = [];
    
    // Helper to check if position is valid
    const isValidPosition = (x: number, y: number, margin: number = 40): boolean => {
      // Check avoid zones
      if (isInAvoidZone(x, y, avoidZones)) return false;
      
      // Check distance from other decorations
      for (const deco of decorations) {
        const dist = Math.sqrt((x - deco.x) ** 2 + (y - deco.y) ** 2);
        if (dist < margin) return false;
      }
      
      // Check bounds - keep decorations away from edges
      if (x < 30 || x > width - 30 || y < 30 || y > height - 30) return false;
      
      return true;
    };
    
    // Helper to add decoration with mirror symmetry
    const addSymmetricDecoration = (x: number, y: number, spriteIndex: number, scale: number) => {
      const mirrorX = width - x;
      
      if (isValidPosition(x, y, 35)) {
        decorations.push({
          spriteIndex,
          x,
          y,
          scale,
          flip: x > width / 2, // Face inward
        });
      }
      
      if (isValidPosition(mirrorX, y, 35)) {
        decorations.push({
          spriteIndex,
          x: mirrorX,
          y,
          scale,
          flip: mirrorX > width / 2,
        });
      }
    };
    
    // === TREES (0-15): Place in corners and along edges ===
    // Top-left corner cluster
    addSymmetricDecoration(60, 80, 0, 0.9);
    addSymmetricDecoration(100, 60, 1, 0.85);
    addSymmetricDecoration(40, 120, 2, 0.8);
    
    // Bottom-left corner cluster
    addSymmetricDecoration(60, height - 80, 3, 0.9);
    addSymmetricDecoration(100, height - 60, 4, 0.85);
    addSymmetricDecoration(40, height - 120, 5, 0.8);
    
    // Mid-edge trees (left and right)
    addSymmetricDecoration(50, height * 0.3, 6, 0.75);
    addSymmetricDecoration(50, height * 0.7, 7, 0.75);
    
    // === BUSHES (16-40): Place near lane edges and corners ===
    // Near top towers
    addSymmetricDecoration(120, 100, 16, 0.65);
    addSymmetricDecoration(180, 120, 17, 0.6);
    
    // Near bottom towers
    addSymmetricDecoration(120, height - 100, 18, 0.65);
    addSymmetricDecoration(180, height - 120, 19, 0.6);
    
    // Along river banks (but not in river)
    addSymmetricDecoration(80, height / 2 - 50, 20, 0.55);
    addSymmetricDecoration(80, height / 2 + 50, 21, 0.55);
    
    // Scattered bushes
    for (let i = 0; i < 4; i++) {
      const baseX = 100 + i * 40;
      const baseY = height * 0.25 + (i % 2) * height * 0.5;
      addSymmetricDecoration(baseX, baseY, 22 + i, 0.5 + Math.random() * 0.2);
    }
    
    // === ROCKS (41-60): Scatter in grass areas ===
    const rockPositions = [
      { x: 150, y: 180 }, { x: 200, y: 220 },
      { x: 100, y: height * 0.35 }, { x: 150, y: height * 0.4 },
      { x: 150, y: height - 180 }, { x: 200, y: height - 220 },
      { x: 100, y: height * 0.65 }, { x: 150, y: height * 0.6 },
    ];
    
    for (let i = 0; i < rockPositions.length; i++) {
      const pos = rockPositions[i];
      addSymmetricDecoration(pos.x, pos.y, 41 + (i % 10), 0.6 + Math.random() * 0.2);
    }
    
    // === FLOWERS/PLANTS (61-80): Small decorative elements ===
    const flowerPositions = [
      { x: 200, y: 150 }, { x: 250, y: 180 },
      { x: 200, y: height - 150 }, { x: 250, y: height - 180 },
    ];
    
    for (let i = 0; i < flowerPositions.length; i++) {
      const pos = flowerPositions[i];
      addSymmetricDecoration(pos.x, pos.y, 61 + i, 0.45);
    }
    
    this.decorations = decorations;
    console.log(`EnvironmentRenderer: Generated ${decorations.length} decorations (symmetric layout)`);
  }
  
  /**
   * Get current decorations
   */
  getDecorations(): DecorationPlacement[] {
    return this.decorations;
  }
  
  /**
   * Update animation state
   */
  update(deltaTime: number): void {
    if (!this.isAssetsLoaded) return;
    
    // Update animation frame (cycle through 34 frames at ~1 fps for subtle animation)
    this.animationTime += deltaTime;
    if (this.animationTime > 0.1) { // ~10fps frame rate for background animation
      this.animationTime = 0;
      this.currentFrame = (this.currentFrame + 1) % this.animationFrames.length;
    }
    
    // Update river animation
    this.riverTime += deltaTime;
  }
  
  /**
   * Render base arena background
   */
  renderBase(ctx: CanvasRenderingContext2D): void {
    const { width, height } = this.config;
    
    if (this.backgroundImage && this.isAssetsLoaded) {
      // Draw background scaled to fit canvas
      ctx.drawImage(this.backgroundImage, 0, 0, width, height);
    } else {
      // Fallback: grass gradient
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, '#4a7c4e');
      gradient.addColorStop(0.5, '#3d6b41');
      gradient.addColorStop(1, '#4a7c4e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }
  }
  
  /**
   * Render animated layer (water effects from frames)
   */
  renderAnimatedLayer(ctx: CanvasRenderingContext2D): void {
    const { width, riverY, riverHeight } = this.config;
    
    if (!this.isAssetsLoaded) return;
    
    // If we have animation frames, draw the current frame for the river area
    if (this.animationFrames[this.currentFrame]) {
      // Only draw the center portion (river area) from animation frame
      // The arena animation frames contain water ripple effects
      ctx.save();
      ctx.globalAlpha = 0.3; // Subtle overlay effect
      ctx.drawImage(
        this.animationFrames[this.currentFrame],
        0, riverY - riverHeight/2,
        width, riverHeight,
        0, riverY - riverHeight/2,
        width, riverHeight
      );
      ctx.restore();
    }
  }
  
  /**
   * Render decorative elements
   */
  renderDecorations(ctx: CanvasRenderingContext2D): void {
    if (!this.isAssetsLoaded) return;
    
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
   * Render river with procedural wave animation
   */
  renderRiver(ctx: CanvasRenderingContext2D): void {
    const { width, riverY, riverHeight } = this.config;
    
    // Base water color
    const riverTop = riverY - riverHeight / 2;
    
    // Draw base water
    ctx.fillStyle = '#3a6ad9';
    ctx.fillRect(0, riverTop, width, riverHeight);
    
    // Add darker edges
    const edgeGradient = ctx.createLinearGradient(0, riverTop, 0, riverTop + riverHeight);
    edgeGradient.addColorStop(0, 'rgba(0,0,0,0.3)');
    edgeGradient.addColorStop(0.2, 'rgba(0,0,0,0)');
    edgeGradient.addColorStop(0.8, 'rgba(0,0,0,0)');
    edgeGradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    ctx.fillStyle = edgeGradient;
    ctx.fillRect(0, riverTop, width, riverHeight);
    
    // Animated wave lines
    const waveCount = 8;
    for (let i = 0; i < waveCount; i++) {
      const yOffset = (this.riverTime * 40 + i * 30) % riverHeight;
      const waveY = riverTop + yOffset;
      
      if (waveY < riverTop || waveY > riverTop + riverHeight) continue;
      
      ctx.strokeStyle = `rgba(100, 181, 246, ${0.4 - i * 0.04})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      
      for (let x = 0; x < width; x += 8) {
        const wave = Math.sin((x + this.riverTime * 80) * 0.03) * 3;
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
   * Render bridges at specified positions
   */
  renderBridges(ctx: CanvasRenderingContext2D): void {
    const { bridgePositions } = this.config;
    
    if (!this.isAssetsLoaded) return;
    
    // Use bridge sprite (index 101) or fallback
    const bridgeSprite = this.decosSprites.get(101);
    
    for (const pos of bridgePositions) {
      if (bridgeSprite) {
        const scale = 0.8;
        const w = bridgeSprite.width * scale;
        const h = bridgeSprite.height * scale;
        ctx.drawImage(bridgeSprite, pos.x - w/2, pos.y - h/2, w, h);
      } else {
        // Fallback: wooden bridge
        const bridgeWidth = 80;
        const bridgeHeight = 50;
        
        // Bridge deck
        const deckGradient = ctx.createLinearGradient(
          pos.x - bridgeWidth/2, pos.y - bridgeHeight/2,
          pos.x + bridgeWidth/2, pos.y + bridgeHeight/2
        );
        deckGradient.addColorStop(0, '#8b6914');
        deckGradient.addColorStop(0.5, '#a67c00');
        deckGradient.addColorStop(1, '#8b6914');
        
        ctx.fillStyle = deckGradient;
        ctx.fillRect(pos.x - bridgeWidth/2, pos.y - bridgeHeight/2, bridgeWidth, bridgeHeight);
        
        // Wood planks
        ctx.strokeStyle = '#5c4510';
        ctx.lineWidth = 1;
        for (let i = 0; i < 5; i++) {
          const plankX = pos.x - bridgeWidth/2 + (i + 0.5) * (bridgeWidth / 5);
          ctx.beginPath();
          ctx.moveTo(plankX, pos.y - bridgeHeight/2);
          ctx.lineTo(plankX, pos.y + bridgeHeight/2);
          ctx.stroke();
        }
        
        // Rails
        ctx.fillStyle = '#c9a227';
        ctx.fillRect(pos.x - bridgeWidth/2 - 3, pos.y - bridgeHeight/2 - 5, bridgeWidth + 6, 4);
        ctx.fillRect(pos.x - bridgeWidth/2 - 3, pos.y + bridgeHeight/2 + 1, bridgeWidth + 6, 4);
      }
    }
  }
  
  /**
   * Render everything (convenience method)
   */
  render(ctx: CanvasRenderingContext2D, deltaTime: number): void {
    this.update(deltaTime);
    this.renderBase(ctx);
    this.renderAnimatedLayer(ctx);
    this.renderDecorations(ctx);
    this.renderRiver(ctx);
    this.renderBridges(ctx);
  }
}

export default EnvironmentRenderer;
