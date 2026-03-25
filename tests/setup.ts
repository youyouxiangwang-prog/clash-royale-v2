import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock HTMLImageElement
class MockImage {
  src = '';
  onload: (() => void) | null = null;
  onerror: (() => void) | null = null;
  width = 0;
  height = 0;
  complete = false;

  constructor() {
    setTimeout(() => {
      this.complete = true;
      this.onload?.();
    }, 0);
  }
}

window.Image = MockImage as unknown as typeof HTMLImageElement;

// Mock canvas context
HTMLCanvasElement.prototype.getContext = function () {
  const ctx = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    strokeRect: vi.fn(),
    fillStyle: '',
    strokeStyle: '',
    lineWidth: 0,
    setLineDash: vi.fn(),
    createLinearGradient: vi.fn(() => ({
      addColorStop: vi.fn(),
    })),
    beginPath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    closePath: vi.fn(),
    arc: vi.fn(),
    fill: vi.fn(),
  };
  return ctx as unknown as CanvasRenderingContext2D;
};
