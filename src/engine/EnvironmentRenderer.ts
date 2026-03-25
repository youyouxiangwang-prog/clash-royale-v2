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
   * Places trees, bushes, rocks aesthetically
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
      
      // Check bounds
      if (x < 20 || x > width - 20 || y < 20 || y > height - 20) return false;
      
      return true;
    };
    
    // Place trees (0-15) - corners and edges
    const treeCount = 6;
    const treePositions = [
      // Top-left area
      { x: 80, y: 100 }, { x: 150, y: 80 },
      // Top-right area  
      { x: width - 80, y: 100 }, { x: width - 150, y: 80 },
      // Bottom-left area
      { x: 80, y: height - 100 }, { x: 150, y: height - 80 },
      // Bottom-right area
      { x: width - 80, y: height - 100 }, { x: width - 150, y: height - 80 },
    ];
    
    for (let i = 0; i < treeCount && i < treePositions.length; i++) {
      const pos = treePositions[i];
      const spriteIndex = i; // 0-5 for first few trees
      decorations.push({
        spriteIndex,
        x: pos.x,
        y: pos.y,
        scale: 0.8 + Math.random() * 0.4,
        flip: Math.random() > 0.5,
      });
    }
    
    // Place bushes (16-40) - near lanes
    const bushCount = 8;
    for (let i = 0; i < bushCount; i++) {
      let attempts = 0;
      while (attempts < 20) {
        // Place near lane edges
        const x = i < 4 
          ? 50 + Math.random() * 100 
          : width - 50 - Math.random() * 100;
        const yOffset = (i % 2 === 0) ? -80 : 80;
        const y = height / 2 + yOffset + Math.random() * 40;
        
        if (isValidPosition(x, y, 30)) {
          decorations.push({
            spriteIndex: 16 + (i % 10), // 16-25
            x,
            y,
            scale: 0.6 + Math.random() * 0.4,
            flip: Math.random() > 0.5,
          });
          break;
        }
        attempts++;
      }
    }
    
    // Place rocks (41-60) - scattered in grass
    const rockCount = 6;
    for (let i = 0; i < rockCount; i++) {
      let attempts = 0;
      while (attempts < 20) {
        const x = 100 + Math.random() * (width - 200);
        const y = 100 + Math.random() * (height - 200);
        
        if (isValidPosition(x, y, 25)) {
          decorations.push({
            spriteIndex: 41 + (i % 10), // 41-50
            x,
            y,
            scale: 0.5 + Math.random() * 0.3,
          });
          break;
        }
        attempts++;
      }
    }
    
    this.decorations = decorations;
    console.log(`EnvironmentRenderer: Generated ${decorations.length} decorations`);
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
