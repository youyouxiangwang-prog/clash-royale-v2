// Animation Manager for Clash Royale V2
// Manages sprite sheet loading and animation state

import type { SpriteSheet, AnimationConfig, AnimationState } from '../types';

export class AnimationManager {
  private spriteSheets: Map<string, SpriteSheet> = new Map();
  private loadingPromises: Map<string, Promise<void>> = new Map();

  /**
   * Load a sprite sheet from the given directory
   */
  async loadSpriteSheet(id: string, directory: string, frameCount: number, frameWidth: number, frameHeight: number): Promise<SpriteSheet> {
    if (this.spriteSheets.has(id)) {
      return this.spriteSheets.get(id)!;
    }

    if (this.loadingPromises.has(id)) {
      await this.loadingPromises.get(id);
      return this.spriteSheets.get(id)!;
    }

    const spriteSheet: SpriteSheet = {
      id,
      name: id,
      directory,
      frameCount,
      frameWidth,
      frameHeight,
      animations: new Map(),
      loaded: false,
      frames: [],
    };

    const loadPromise = this.loadFrames(spriteSheet);
    this.loadingPromises.set(id, loadPromise);

    await loadPromise;

    this.spriteSheets.set(id, spriteSheet);
    this.loadingPromises.delete(id);

    return spriteSheet;
  }

  /**
   * Load all frames for a sprite sheet
   */
  private async loadFrames(spriteSheet: SpriteSheet): Promise<void> {
    const loadPromises: Promise<void>[] = [];

    for (let i = 0; i < spriteSheet.frameCount; i++) {
      loadPromises.push(this.loadFrame(spriteSheet, i));
    }

    await Promise.all(loadPromises);
    spriteSheet.loaded = true;
  }

  /**
   * Load a single frame
   */
  private loadFrame(spriteSheet: SpriteSheet, index: number): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      // Construct the frame path based on directory and index
      const framePath = `${spriteSheet.directory}frame_${index.toString().padStart(4, '0')}.png`;
      img.src = framePath;
      img.onload = () => {
        spriteSheet.frames[index] = img;
        resolve();
      };
      img.onerror = () => {
        // Create a placeholder frame
        const canvas = document.createElement('canvas');
        canvas.width = spriteSheet.frameWidth;
        canvas.height = spriteSheet.frameHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#888';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        const placeholderImg = new Image();
        placeholderImg.src = canvas.toDataURL();
        placeholderImg.onload = () => {
          spriteSheet.frames[index] = placeholderImg;
          resolve();
        };
        placeholderImg.onerror = () => resolve();
      };
    });
  }

  /**
   * Get a loaded sprite sheet
   */
  getSpriteSheet(id: string): SpriteSheet | undefined {
    return this.spriteSheets.get(id);
  }

  /**
   * Add an animation configuration to a sprite sheet
   */
  addAnimation(spriteSheetId: string, config: AnimationConfig): void {
    const spriteSheet = this.spriteSheets.get(spriteSheetId);
    if (spriteSheet) {
      spriteSheet.animations.set(config.name, config);
    }
  }

  /**
   * Create an animation state for a sprite sheet
   */
  createAnimationState(spriteSheetId: string, animationName: string): AnimationState | null {
    const spriteSheet = this.spriteSheets.get(spriteSheetId);
    if (!spriteSheet) return null;

    const config = spriteSheet.animations.get(animationName);
    if (!config) return null;

    return {
      currentAnimation: animationName,
      currentFrame: 0,
      frameTime: 0,
      playing: true,
      completed: false,
    };
  }

  /**
   * Update an animation state based on elapsed time
   */
  updateAnimation(state: AnimationState, config: AnimationConfig, deltaTime: number): AnimationState {
    if (!state.playing || state.completed) {
      return state;
    }

    const frameInterval = 1000 / config.fps;
    let newFrameTime = state.frameTime + deltaTime;
    let newFrame = state.currentFrame;
    let completed = state.completed;
    let playing = state.playing;

    // Advance frames based on elapsed time
    while (newFrameTime >= frameInterval) {
      newFrameTime -= frameInterval;
      
      if (config.loop) {
        // Loop animation
        newFrame = (newFrame + 1) % config.frames.length;
      } else {
        // Non-looping animation
        if (newFrame >= config.frames.length - 1) {
          // Reached the end
          newFrame = config.frames.length - 1;
          completed = true;
          playing = false;
          break;
        } else {
          newFrame = newFrame + 1;
        }
      }
    }

    return {
      ...state,
      currentFrame: newFrame,
      frameTime: newFrameTime,
      completed,
      playing,
    };
  }

  /**
   * Get the current frame index for an animation
   */
  getCurrentFrame(state: AnimationState, config: AnimationConfig): number {
    if (state.currentFrame >= 0 && state.currentFrame < config.frames.length) {
      return config.frames[state.currentFrame];
    }
    return 0;
  }

  /**
   * Start or restart an animation
   */
  playAnimation(state: AnimationState): AnimationState {
    return {
      ...state,
      playing: true,
      completed: false,
    };
  }

  /**
   * Pause an animation
   */
  pauseAnimation(state: AnimationState): AnimationState {
    return {
      ...state,
      playing: false,
    };
  }

  /**
   * Stop and reset an animation to the beginning
   */
  stopAnimation(state: AnimationState): AnimationState {
    return {
      ...state,
      playing: false,
      currentFrame: 0,
      frameTime: 0,
      completed: false,
    };
  }

  /**
   * Transition to a new animation
   */
  transitionTo(state: AnimationState, newAnimation: string): AnimationState {
    return {
      ...state,
      currentAnimation: newAnimation,
      currentFrame: 0,
      frameTime: 0,
      completed: false,
    };
  }
}

// Singleton instance
export const animationManager = new AnimationManager();
