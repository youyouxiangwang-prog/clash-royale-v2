export interface DecorationPlacement {
  spriteIndex: number;  // 0-106
  x: number;
  y: number;
  scale: number;        // 0.5 - 1.5
  flip?: boolean;        // horizontal flip
}

export interface ArenaConfig {
  width: number;
  height: number;
  riverY: number;        // y position of river center
  riverHeight: number;   // height of river band
  bridgePositions: {x: number, y: number}[];
}

export interface DecorationType {
  name: string;
  spriteRange: [number, number];
  defaultScale: number;
}

export const DECORATION_TYPES: Record<string, DecorationType> = {
  TREE: { name: "Tree", spriteRange: [0, 15], defaultScale: 1.0 },
  BUSH: { name: "Bush", spriteRange: [16, 40], defaultScale: 0.8 },
  ROCK: { name: "Rock", spriteRange: [41, 60], defaultScale: 0.7 },
  FLOWER: { name: "Flower", spriteRange: [61, 80], defaultScale: 0.5 },
  FENCE: { name: "Fence", spriteRange: [81, 100], defaultScale: 0.8 },
  BRIDGE: { name: "Bridge", spriteRange: [101, 106], defaultScale: 1.0 },
};

// Lane avoidance zones (units walk here)
export interface AvoidZone {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export function getDefaultAvoidZones(config: ArenaConfig): AvoidZone[] {
  const { width, height, riverY, riverHeight, bridgePositions } = config;
  
  return [
    // River zone
    { x1: 0, y1: riverY - riverHeight/2, x2: width, y2: riverY + riverHeight/2 },
    // Bridge zones (wider)
    { x1: bridgePositions[0].x - 50, y1: riverY - 60, x2: bridgePositions[0].x + 50, y2: riverY + 60 },
    { x1: bridgePositions[1].x - 50, y1: riverY - 60, x2: bridgePositions[1].x + 50, y2: riverY + 60 },
    // Horizontal lane (middle)
    { x1: 0, y1: height/2 - 30, x2: width, y2: height/2 + 30 },
  ];
}

export function isInAvoidZone(x: number, y: number, zones: AvoidZone[]): boolean {
  return zones.some(zone => x >= zone.x1 && x <= zone.x2 && y >= zone.y1 && y <= zone.y2);
}
