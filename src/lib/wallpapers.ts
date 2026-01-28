/**
 * Wallpaper System - Award-Winning Cinematic Customization
 * Featuring Hollywood movie-inspired moods, cinematic gradients, and stunning visuals
 */

export type WallpaperType = 'gradient' | 'solid' | 'mesh' | 'image' | 'dynamic' | 'pattern' | 'cinematic';

export type GradientDirection =
  | 'to-t' | 'to-tr' | 'to-r' | 'to-br'
  | 'to-b' | 'to-bl' | 'to-l' | 'to-tl'
  | 'radial' | 'conic';

export type MoodCategory =
  | 'serene' | 'vibrant' | 'minimal' | 'cosmic'
  | 'nature' | 'sunset' | 'ocean' | 'aurora' | 'midnight'
  | 'cinematic' | 'romantic' | 'mysterious' | 'epic' | 'dreamy';

// ============================================================================
// WALLPAPER TYPES
// ============================================================================

export interface GradientStop {
  color: string;
  position: number; // 0-100
}

export interface GradientWallpaper {
  type: 'gradient';
  id: string;
  name: string;
  direction: GradientDirection;
  stops: GradientStop[];
  mood?: MoodCategory;
}

export interface MeshGradientWallpaper {
  type: 'mesh';
  id: string;
  name: string;
  colors: string[]; // 4-6 colors for mesh
  mood?: MoodCategory;
}

export interface SolidWallpaper {
  type: 'solid';
  id: string;
  name: string;
  color: string;
  mood?: MoodCategory;
}

export interface PatternWallpaper {
  type: 'pattern';
  id: string;
  name: string;
  pattern: 'dots' | 'grid' | 'waves' | 'noise' | 'grain' | 'geometric' | 'topography' | 'circuit' | 'hexagon';
  baseColor: string;
  patternColor: string;
  opacity: number;
  mood?: MoodCategory;
}

export interface DynamicWallpaper {
  type: 'dynamic';
  id: string;
  name: string;
  style: 'aurora' | 'waves' | 'particles' | 'morph' | 'glow' | 'rain' | 'matrix' | 'holographic' | 'nebula';
  colors: string[];
  speed: 'slow' | 'medium' | 'fast';
  mood?: MoodCategory;
}

export interface ImageWallpaper {
  type: 'image';
  id: string;
  name: string;
  url: string;
  thumbnailUrl?: string;
  blurHash?: string;
  source: 'unsplash' | 'upload' | 'curated';
  attribution?: {
    photographerName: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  mood?: MoodCategory;
}

export type Wallpaper =
  | GradientWallpaper
  | MeshGradientWallpaper
  | SolidWallpaper
  | PatternWallpaper
  | DynamicWallpaper
  | ImageWallpaper;

// ============================================================================
// MOOD PRESETS - Curated cinematic experiences
// ============================================================================

export interface MoodPreset {
  id: string;
  name: string;
  description: string;
  category: MoodCategory;
  wallpaper: Wallpaper;
  overlayOpacity: number;
  blur: number;
  particleStyle?: 'subtle' | 'normal' | 'vibrant' | 'none' | 'cinematic';
  accentColor?: string;
  emoji: string;
}

// ============================================================================
// CINEMATIC GRADIENTS - Hollywood Movie Inspired
// ============================================================================

export const cinematicGradients: GradientWallpaper[] = [
  // Blade Runner - Neon Noir
  {
    type: 'gradient',
    id: 'blade-runner-neon',
    name: 'Blade Runner Neon',
    direction: 'to-br',
    stops: [
      { color: '#0d1b2a', position: 0 },
      { color: '#1b263b', position: 25 },
      { color: '#2d1b4e', position: 50 },
      { color: '#d90429', position: 75 },
      { color: '#00d4ff', position: 100 },
    ],
    mood: 'cinematic',
  },
  {
    type: 'gradient',
    id: 'blade-runner-rain',
    name: 'Blade Runner Rain',
    direction: 'to-b',
    stops: [
      { color: '#000000', position: 0 },
      { color: '#0a1628', position: 30 },
      { color: '#1a0a2e', position: 60 },
      { color: '#ff0054', position: 100 },
    ],
    mood: 'cinematic',
  },
  // The Matrix
  {
    type: 'gradient',
    id: 'matrix-code',
    name: 'Matrix Code',
    direction: 'to-b',
    stops: [
      { color: '#000000', position: 0 },
      { color: '#001a00', position: 30 },
      { color: '#003300', position: 60 },
      { color: '#00ff00', position: 100 },
    ],
    mood: 'cinematic',
  },
  // Interstellar
  {
    type: 'gradient',
    id: 'interstellar-wormhole',
    name: 'Interstellar Wormhole',
    direction: 'radial',
    stops: [
      { color: '#f5e6d3', position: 0 },
      { color: '#d4a574', position: 25 },
      { color: '#3d2914', position: 50 },
      { color: '#1a1a2e', position: 75 },
      { color: '#0a0a0a', position: 100 },
    ],
    mood: 'epic',
  },
  {
    type: 'gradient',
    id: 'interstellar-dust',
    name: 'Interstellar Dust',
    direction: 'to-br',
    stops: [
      { color: '#0d0d0d', position: 0 },
      { color: '#1a1a2e', position: 40 },
      { color: '#8b7355', position: 70 },
      { color: '#d4a574', position: 100 },
    ],
    mood: 'epic',
  },
  // Tron Legacy
  {
    type: 'gradient',
    id: 'tron-grid',
    name: 'Tron Grid',
    direction: 'to-b',
    stops: [
      { color: '#000000', position: 0 },
      { color: '#0a0a0a', position: 40 },
      { color: '#001a33', position: 70 },
      { color: '#00d4ff', position: 100 },
    ],
    mood: 'cinematic',
  },
  {
    type: 'gradient',
    id: 'tron-orange',
    name: 'Tron Uprising',
    direction: 'to-br',
    stops: [
      { color: '#000000', position: 0 },
      { color: '#1a0a00', position: 40 },
      { color: '#331a00', position: 70 },
      { color: '#ff6b00', position: 100 },
    ],
    mood: 'cinematic',
  },
  // Dune
  {
    type: 'gradient',
    id: 'dune-desert',
    name: 'Dune Desert',
    direction: 'to-t',
    stops: [
      { color: '#1a120a', position: 0 },
      { color: '#3d2914', position: 30 },
      { color: '#8b6914', position: 60 },
      { color: '#d4a574', position: 80 },
      { color: '#f5e6d3', position: 100 },
    ],
    mood: 'epic',
  },
  {
    type: 'gradient',
    id: 'dune-spice',
    name: 'Dune Spice',
    direction: 'radial',
    stops: [
      { color: '#ff6b00', position: 0 },
      { color: '#cc5500', position: 30 },
      { color: '#663300', position: 60 },
      { color: '#1a0d00', position: 100 },
    ],
    mood: 'epic',
  },
  // Avatar
  {
    type: 'gradient',
    id: 'pandora-glow',
    name: 'Pandora Glow',
    direction: 'to-br',
    stops: [
      { color: '#0a1929', position: 0 },
      { color: '#0d3b4a', position: 30 },
      { color: '#00bcd4', position: 60 },
      { color: '#9c27b0', position: 100 },
    ],
    mood: 'dreamy',
  },
  {
    type: 'gradient',
    id: 'avatar-forest',
    name: 'Pandora Forest',
    direction: 'to-b',
    stops: [
      { color: '#001a1a', position: 0 },
      { color: '#003333', position: 30 },
      { color: '#006666', position: 55 },
      { color: '#00cccc', position: 75 },
      { color: '#cc00ff', position: 100 },
    ],
    mood: 'dreamy',
  },
  // Inception
  {
    type: 'gradient',
    id: 'inception-dream',
    name: 'Inception Dream',
    direction: 'to-br',
    stops: [
      { color: '#1a1a2e', position: 0 },
      { color: '#16213e', position: 30 },
      { color: '#0f3460', position: 55 },
      { color: '#4a69bd', position: 75 },
      { color: '#e58e26', position: 100 },
    ],
    mood: 'dreamy',
  },
  {
    type: 'gradient',
    id: 'inception-limbo',
    name: 'Inception Limbo',
    direction: 'radial',
    stops: [
      { color: '#f5e6d3', position: 0 },
      { color: '#d4a574', position: 30 },
      { color: '#666666', position: 60 },
      { color: '#333333', position: 100 },
    ],
    mood: 'dreamy',
  },
  // Mad Max
  {
    type: 'gradient',
    id: 'fury-road',
    name: 'Fury Road',
    direction: 'to-t',
    stops: [
      { color: '#1a0a00', position: 0 },
      { color: '#3d1a00', position: 25 },
      { color: '#802200', position: 45 },
      { color: '#ff6600', position: 65 },
      { color: '#ffcc00', position: 85 },
      { color: '#ffffff', position: 100 },
    ],
    mood: 'epic',
  },
  // Grand Budapest Hotel
  {
    type: 'gradient',
    id: 'budapest-pink',
    name: 'Budapest Pink',
    direction: 'to-br',
    stops: [
      { color: '#f8c8c8', position: 0 },
      { color: '#e8a4a4', position: 40 },
      { color: '#d4a574', position: 70 },
      { color: '#f5e6d3', position: 100 },
    ],
    mood: 'romantic',
  },
  {
    type: 'gradient',
    id: 'wes-anderson',
    name: 'Wes Anderson',
    direction: 'to-r',
    stops: [
      { color: '#f4a7b9', position: 0 },
      { color: '#f7d9c4', position: 25 },
      { color: '#98d1d1', position: 50 },
      { color: '#f9e07f', position: 75 },
      { color: '#dda0dd', position: 100 },
    ],
    mood: 'romantic',
  },
  // La La Land
  {
    type: 'gradient',
    id: 'la-la-twilight',
    name: 'La La Twilight',
    direction: 'to-t',
    stops: [
      { color: '#1a1a2e', position: 0 },
      { color: '#4a3478', position: 30 },
      { color: '#7b68ee', position: 55 },
      { color: '#ffc107', position: 75 },
      { color: '#ff8c00', position: 100 },
    ],
    mood: 'romantic',
  },
  // Joker
  {
    type: 'gradient',
    id: 'joker-stairs',
    name: 'Joker Stairs',
    direction: 'to-br',
    stops: [
      { color: '#0a1f0a', position: 0 },
      { color: '#1a3d1a', position: 30 },
      { color: '#2e8b2e', position: 55 },
      { color: '#9b59b6', position: 80 },
      { color: '#663399', position: 100 },
    ],
    mood: 'mysterious',
  },
  // No Country for Old Men
  {
    type: 'gradient',
    id: 'texas-desert',
    name: 'Texas Desert',
    direction: 'to-t',
    stops: [
      { color: '#1a1510', position: 0 },
      { color: '#3d3020', position: 30 },
      { color: '#8b7355', position: 60 },
      { color: '#d4c4a8', position: 85 },
      { color: '#f5f0e6', position: 100 },
    ],
    mood: 'minimal',
  },
  // 2001 Space Odyssey
  {
    type: 'gradient',
    id: 'space-odyssey',
    name: 'Space Odyssey',
    direction: 'radial',
    stops: [
      { color: '#ff0000', position: 0 },
      { color: '#990000', position: 20 },
      { color: '#330000', position: 40 },
      { color: '#000000', position: 100 },
    ],
    mood: 'epic',
  },
  // Drive
  {
    type: 'gradient',
    id: 'drive-neon',
    name: 'Drive Neon',
    direction: 'to-br',
    stops: [
      { color: '#0d0d0d', position: 0 },
      { color: '#1a0a1a', position: 30 },
      { color: '#330033', position: 55 },
      { color: '#ff1493', position: 80 },
      { color: '#ff69b4', position: 100 },
    ],
    mood: 'cinematic',
  },
  // Amelie
  {
    type: 'gradient',
    id: 'amelie-paris',
    name: 'Amelie Paris',
    direction: 'to-br',
    stops: [
      { color: '#1a3d1a', position: 0 },
      { color: '#2d5a27', position: 30 },
      { color: '#b8860b', position: 60 },
      { color: '#daa520', position: 80 },
      { color: '#ffd700', position: 100 },
    ],
    mood: 'romantic',
  },
  // Gravity
  {
    type: 'gradient',
    id: 'gravity-earth',
    name: 'Gravity Earth',
    direction: 'radial',
    stops: [
      { color: '#1e90ff', position: 0 },
      { color: '#4169e1', position: 25 },
      { color: '#0d0d0d', position: 50 },
      { color: '#000000', position: 100 },
    ],
    mood: 'epic',
  },
  // Her
  {
    type: 'gradient',
    id: 'her-warmth',
    name: 'Her Warmth',
    direction: 'to-br',
    stops: [
      { color: '#fff0e6', position: 0 },
      { color: '#ffd4b8', position: 30 },
      { color: '#ff9966', position: 60 },
      { color: '#ff6633', position: 100 },
    ],
    mood: 'romantic',
  },
  // Arrival
  {
    type: 'gradient',
    id: 'arrival-fog',
    name: 'Arrival Fog',
    direction: 'to-b',
    stops: [
      { color: '#f5f5f5', position: 0 },
      { color: '#cccccc', position: 30 },
      { color: '#808080', position: 60 },
      { color: '#333333', position: 100 },
    ],
    mood: 'mysterious',
  },
];

// ============================================================================
// CURATED GRADIENTS - Award-winning color combinations
// ============================================================================

export const curatedGradients: GradientWallpaper[] = [
  // Serene Collection
  {
    type: 'gradient',
    id: 'soft-dawn',
    name: 'Soft Dawn',
    direction: 'to-br',
    stops: [
      { color: '#fef3c7', position: 0 },
      { color: '#fde68a', position: 30 },
      { color: '#fcd34d', position: 60 },
      { color: '#f59e0b', position: 100 },
    ],
    mood: 'serene',
  },
  {
    type: 'gradient',
    id: 'lavender-dream',
    name: 'Lavender Dream',
    direction: 'to-br',
    stops: [
      { color: '#e9d5ff', position: 0 },
      { color: '#d8b4fe', position: 40 },
      { color: '#c084fc', position: 70 },
      { color: '#a855f7', position: 100 },
    ],
    mood: 'serene',
  },
  {
    type: 'gradient',
    id: 'morning-mist',
    name: 'Morning Mist',
    direction: 'to-b',
    stops: [
      { color: '#f0f9ff', position: 0 },
      { color: '#e0f2fe', position: 40 },
      { color: '#bae6fd', position: 70 },
      { color: '#7dd3fc', position: 100 },
    ],
    mood: 'serene',
  },
  {
    type: 'gradient',
    id: 'rose-quartz',
    name: 'Rose Quartz',
    direction: 'to-br',
    stops: [
      { color: '#fdf2f8', position: 0 },
      { color: '#fce7f3', position: 30 },
      { color: '#fbcfe8', position: 60 },
      { color: '#f9a8d4', position: 100 },
    ],
    mood: 'serene',
  },

  // Vibrant Collection
  {
    type: 'gradient',
    id: 'electric-violet',
    name: 'Electric Violet',
    direction: 'to-r',
    stops: [
      { color: '#7c3aed', position: 0 },
      { color: '#a855f7', position: 30 },
      { color: '#ec4899', position: 70 },
      { color: '#f43f5e', position: 100 },
    ],
    mood: 'vibrant',
  },
  {
    type: 'gradient',
    id: 'neon-nights',
    name: 'Neon Nights',
    direction: 'to-br',
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#1e1b4b', position: 30 },
      { color: '#5b21b6', position: 60 },
      { color: '#7c3aed', position: 80 },
      { color: '#a855f7', position: 100 },
    ],
    mood: 'vibrant',
  },
  {
    type: 'gradient',
    id: 'tropical-fusion',
    name: 'Tropical Fusion',
    direction: 'to-tr',
    stops: [
      { color: '#f97316', position: 0 },
      { color: '#fb923c', position: 30 },
      { color: '#fbbf24', position: 60 },
      { color: '#84cc16', position: 100 },
    ],
    mood: 'vibrant',
  },
  {
    type: 'gradient',
    id: 'cotton-candy',
    name: 'Cotton Candy',
    direction: 'to-r',
    stops: [
      { color: '#ff6b9d', position: 0 },
      { color: '#c44cff', position: 50 },
      { color: '#6666ff', position: 100 },
    ],
    mood: 'vibrant',
  },

  // Minimal Collection
  {
    type: 'gradient',
    id: 'subtle-gray',
    name: 'Subtle Gray',
    direction: 'to-b',
    stops: [
      { color: '#fafafa', position: 0 },
      { color: '#f4f4f5', position: 50 },
      { color: '#e4e4e7', position: 100 },
    ],
    mood: 'minimal',
  },
  {
    type: 'gradient',
    id: 'warm-paper',
    name: 'Warm Paper',
    direction: 'to-br',
    stops: [
      { color: '#fefce8', position: 0 },
      { color: '#fef9c3', position: 50 },
      { color: '#fef08a', position: 100 },
    ],
    mood: 'minimal',
  },
  {
    type: 'gradient',
    id: 'cool-slate',
    name: 'Cool Slate',
    direction: 'to-b',
    stops: [
      { color: '#f8fafc', position: 0 },
      { color: '#f1f5f9', position: 50 },
      { color: '#e2e8f0', position: 100 },
    ],
    mood: 'minimal',
  },
  {
    type: 'gradient',
    id: 'pure-white',
    name: 'Pure White',
    direction: 'radial',
    stops: [
      { color: '#ffffff', position: 0 },
      { color: '#fafafa', position: 50 },
      { color: '#f5f5f5', position: 100 },
    ],
    mood: 'minimal',
  },

  // Cosmic Collection
  {
    type: 'gradient',
    id: 'deep-space',
    name: 'Deep Space',
    direction: 'radial',
    stops: [
      { color: '#1e1b4b', position: 0 },
      { color: '#0f0a2e', position: 40 },
      { color: '#0a0618', position: 70 },
      { color: '#030014', position: 100 },
    ],
    mood: 'cosmic',
  },
  {
    type: 'gradient',
    id: 'nebula',
    name: 'Nebula',
    direction: 'to-br',
    stops: [
      { color: '#0c0a20', position: 0 },
      { color: '#1a1040', position: 25 },
      { color: '#3b0764', position: 50 },
      { color: '#701a75', position: 75 },
      { color: '#be185d', position: 100 },
    ],
    mood: 'cosmic',
  },
  {
    type: 'gradient',
    id: 'starfield',
    name: 'Starfield',
    direction: 'radial',
    stops: [
      { color: '#1e3a5f', position: 0 },
      { color: '#0f172a', position: 50 },
      { color: '#020617', position: 100 },
    ],
    mood: 'cosmic',
  },
  {
    type: 'gradient',
    id: 'galaxy-swirl',
    name: 'Galaxy Swirl',
    direction: 'conic',
    stops: [
      { color: '#1e1b4b', position: 0 },
      { color: '#5b21b6', position: 25 },
      { color: '#ec4899', position: 50 },
      { color: '#06b6d4', position: 75 },
      { color: '#1e1b4b', position: 100 },
    ],
    mood: 'cosmic',
  },

  // Nature Collection
  {
    type: 'gradient',
    id: 'forest-canopy',
    name: 'Forest Canopy',
    direction: 'to-b',
    stops: [
      { color: '#166534', position: 0 },
      { color: '#14532d', position: 40 },
      { color: '#052e16', position: 70 },
      { color: '#022c22', position: 100 },
    ],
    mood: 'nature',
  },
  {
    type: 'gradient',
    id: 'spring-meadow',
    name: 'Spring Meadow',
    direction: 'to-br',
    stops: [
      { color: '#d9f99d', position: 0 },
      { color: '#a3e635', position: 40 },
      { color: '#84cc16', position: 70 },
      { color: '#65a30d', position: 100 },
    ],
    mood: 'nature',
  },
  {
    type: 'gradient',
    id: 'moss-stone',
    name: 'Moss Stone',
    direction: 'to-b',
    stops: [
      { color: '#365314', position: 0 },
      { color: '#3f6212', position: 50 },
      { color: '#4d7c0f', position: 100 },
    ],
    mood: 'nature',
  },

  // Sunset Collection
  {
    type: 'gradient',
    id: 'golden-hour',
    name: 'Golden Hour',
    direction: 'to-t',
    stops: [
      { color: '#7c2d12', position: 0 },
      { color: '#c2410c', position: 25 },
      { color: '#ea580c', position: 50 },
      { color: '#fb923c', position: 75 },
      { color: '#fdba74', position: 100 },
    ],
    mood: 'sunset',
  },
  {
    type: 'gradient',
    id: 'desert-dusk',
    name: 'Desert Dusk',
    direction: 'to-t',
    stops: [
      { color: '#1c1917', position: 0 },
      { color: '#44403c', position: 30 },
      { color: '#78716c', position: 50 },
      { color: '#f97316', position: 75 },
      { color: '#fbbf24', position: 100 },
    ],
    mood: 'sunset',
  },
  {
    type: 'gradient',
    id: 'twilight',
    name: 'Twilight',
    direction: 'to-t',
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#312e81', position: 30 },
      { color: '#6366f1', position: 55 },
      { color: '#f472b6', position: 75 },
      { color: '#fda4af', position: 90 },
      { color: '#fef3c7', position: 100 },
    ],
    mood: 'sunset',
  },
  {
    type: 'gradient',
    id: 'california-sunset',
    name: 'California Sunset',
    direction: 'to-t',
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#581c87', position: 20 },
      { color: '#dc2626', position: 40 },
      { color: '#f97316', position: 60 },
      { color: '#fbbf24', position: 80 },
      { color: '#fef3c7', position: 100 },
    ],
    mood: 'sunset',
  },

  // Ocean Collection
  {
    type: 'gradient',
    id: 'deep-ocean',
    name: 'Deep Ocean',
    direction: 'to-b',
    stops: [
      { color: '#164e63', position: 0 },
      { color: '#155e75', position: 40 },
      { color: '#0e7490', position: 70 },
      { color: '#0891b2', position: 100 },
    ],
    mood: 'ocean',
  },
  {
    type: 'gradient',
    id: 'coral-reef',
    name: 'Coral Reef',
    direction: 'to-br',
    stops: [
      { color: '#0d9488', position: 0 },
      { color: '#14b8a6', position: 40 },
      { color: '#2dd4bf', position: 70 },
      { color: '#5eead4', position: 100 },
    ],
    mood: 'ocean',
  },
  {
    type: 'gradient',
    id: 'arctic-ice',
    name: 'Arctic Ice',
    direction: 'radial',
    stops: [
      { color: '#ecfeff', position: 0 },
      { color: '#cffafe', position: 30 },
      { color: '#a5f3fc', position: 60 },
      { color: '#67e8f9', position: 100 },
    ],
    mood: 'ocean',
  },

  // Aurora Collection
  {
    type: 'gradient',
    id: 'northern-lights',
    name: 'Northern Lights',
    direction: 'to-tr',
    stops: [
      { color: '#0f172a', position: 0 },
      { color: '#134e4a', position: 30 },
      { color: '#0d9488', position: 50 },
      { color: '#2dd4bf', position: 70 },
      { color: '#a7f3d0', position: 100 },
    ],
    mood: 'aurora',
  },
  {
    type: 'gradient',
    id: 'borealis',
    name: 'Borealis',
    direction: 'to-r',
    stops: [
      { color: '#312e81', position: 0 },
      { color: '#4f46e5', position: 25 },
      { color: '#06b6d4', position: 50 },
      { color: '#10b981', position: 75 },
      { color: '#84cc16', position: 100 },
    ],
    mood: 'aurora',
  },

  // Midnight Collection
  {
    type: 'gradient',
    id: 'midnight-blue',
    name: 'Midnight Blue',
    direction: 'to-b',
    stops: [
      { color: '#020617', position: 0 },
      { color: '#0f172a', position: 50 },
      { color: '#1e293b', position: 100 },
    ],
    mood: 'midnight',
  },
  {
    type: 'gradient',
    id: 'obsidian',
    name: 'Obsidian',
    direction: 'radial',
    stops: [
      { color: '#18181b', position: 0 },
      { color: '#0f0f11', position: 50 },
      { color: '#09090b', position: 100 },
    ],
    mood: 'midnight',
  },
  {
    type: 'gradient',
    id: 'dark-matter',
    name: 'Dark Matter',
    direction: 'to-br',
    stops: [
      { color: '#0a0a0a', position: 0 },
      { color: '#171717', position: 40 },
      { color: '#262626', position: 70 },
      { color: '#171717', position: 100 },
    ],
    mood: 'midnight',
  },
  {
    type: 'gradient',
    id: 'void',
    name: 'Void',
    direction: 'radial',
    stops: [
      { color: '#000000', position: 0 },
      { color: '#030303', position: 50 },
      { color: '#0a0a0a', position: 100 },
    ],
    mood: 'midnight',
  },
];

// ============================================================================
// CURATED MESH GRADIENTS - Ultra-modern look
// ============================================================================

export const curatedMeshGradients: MeshGradientWallpaper[] = [
  {
    type: 'mesh',
    id: 'mesh-candy',
    name: 'Candy Mesh',
    colors: ['#ff9a9e', '#fad0c4', '#ffecd2', '#fcb69f'],
    mood: 'vibrant',
  },
  {
    type: 'mesh',
    id: 'mesh-ocean',
    name: 'Ocean Mesh',
    colors: ['#667eea', '#764ba2', '#6B8DD6', '#8E37D7'],
    mood: 'cosmic',
  },
  {
    type: 'mesh',
    id: 'mesh-forest',
    name: 'Forest Mesh',
    colors: ['#134e5e', '#71b280', '#2d5a27', '#5da13c'],
    mood: 'nature',
  },
  {
    type: 'mesh',
    id: 'mesh-sunset',
    name: 'Sunset Mesh',
    colors: ['#ff6b6b', '#feca57', '#ff9ff3', '#48dbfb'],
    mood: 'sunset',
  },
  {
    type: 'mesh',
    id: 'mesh-aurora',
    name: 'Aurora Mesh',
    colors: ['#00d2ff', '#3a7bd5', '#f857a6', '#ff5858'],
    mood: 'aurora',
  },
  {
    type: 'mesh',
    id: 'mesh-minimal',
    name: 'Minimal Mesh',
    colors: ['#f5f7fa', '#c3cfe2', '#e8eef5', '#dfe6ef'],
    mood: 'minimal',
  },
  {
    type: 'mesh',
    id: 'mesh-dark',
    name: 'Dark Mesh',
    colors: ['#0f0c29', '#302b63', '#24243e', '#1a1a2e'],
    mood: 'midnight',
  },
  {
    type: 'mesh',
    id: 'mesh-dreamy',
    name: 'Dreamy Mesh',
    colors: ['#a8edea', '#fed6e3', '#d299c2', '#fef9d7'],
    mood: 'serene',
  },
  // New cinematic mesh gradients
  {
    type: 'mesh',
    id: 'mesh-blade-runner',
    name: 'Blade Runner Mesh',
    colors: ['#0d1b2a', '#ff0054', '#00d4ff', '#1b263b'],
    mood: 'cinematic',
  },
  {
    type: 'mesh',
    id: 'mesh-matrix',
    name: 'Matrix Mesh',
    colors: ['#000000', '#003300', '#00ff00', '#001a00'],
    mood: 'cinematic',
  },
  {
    type: 'mesh',
    id: 'mesh-tron',
    name: 'Tron Mesh',
    colors: ['#000000', '#00d4ff', '#ff6b00', '#001a33'],
    mood: 'cinematic',
  },
  {
    type: 'mesh',
    id: 'mesh-dune',
    name: 'Dune Mesh',
    colors: ['#1a120a', '#d4a574', '#8b6914', '#f5e6d3'],
    mood: 'epic',
  },
];

// ============================================================================
// CURATED SOLID COLORS - Sophisticated palettes (Expanded)
// ============================================================================

export const curatedSolidColors: SolidWallpaper[] = [
  // Pure Black & White
  { type: 'solid', id: 'solid-black', name: 'Pure Black', color: '#000000', mood: 'midnight' },
  { type: 'solid', id: 'solid-white', name: 'Pure White', color: '#ffffff', mood: 'minimal' },

  // Neutrals
  { type: 'solid', id: 'solid-snow', name: 'Snow', color: '#f8fafc', mood: 'minimal' },
  { type: 'solid', id: 'solid-paper', name: 'Paper', color: '#fafaf9', mood: 'minimal' },
  { type: 'solid', id: 'solid-stone', name: 'Stone', color: '#78716c', mood: 'minimal' },
  { type: 'solid', id: 'solid-slate', name: 'Slate', color: '#475569', mood: 'minimal' },
  { type: 'solid', id: 'solid-graphite', name: 'Graphite', color: '#374151', mood: 'midnight' },
  { type: 'solid', id: 'solid-charcoal', name: 'Charcoal', color: '#1e293b', mood: 'midnight' },
  { type: 'solid', id: 'solid-obsidian', name: 'Obsidian', color: '#0f172a', mood: 'midnight' },
  { type: 'solid', id: 'solid-void', name: 'Void', color: '#030712', mood: 'midnight' },

  // Blues
  { type: 'solid', id: 'solid-baby-blue', name: 'Baby Blue', color: '#bfdbfe', mood: 'serene' },
  { type: 'solid', id: 'solid-sky', name: 'Sky', color: '#7dd3fc', mood: 'serene' },
  { type: 'solid', id: 'solid-azure', name: 'Azure', color: '#3b82f6', mood: 'vibrant' },
  { type: 'solid', id: 'solid-royal', name: 'Royal Blue', color: '#2563eb', mood: 'vibrant' },
  { type: 'solid', id: 'solid-navy', name: 'Navy', color: '#1e3a8a', mood: 'cosmic' },
  { type: 'solid', id: 'solid-ocean', name: 'Ocean', color: '#0891b2', mood: 'ocean' },
  { type: 'solid', id: 'solid-teal', name: 'Teal', color: '#0d9488', mood: 'ocean' },
  { type: 'solid', id: 'solid-cyan', name: 'Cyan', color: '#06b6d4', mood: 'vibrant' },

  // Greens
  { type: 'solid', id: 'solid-mint', name: 'Mint', color: '#a7f3d0', mood: 'serene' },
  { type: 'solid', id: 'solid-emerald', name: 'Emerald', color: '#10b981', mood: 'nature' },
  { type: 'solid', id: 'solid-forest', name: 'Forest', color: '#166534', mood: 'nature' },
  { type: 'solid', id: 'solid-sage', name: 'Sage', color: '#84cc16', mood: 'nature' },
  { type: 'solid', id: 'solid-olive', name: 'Olive', color: '#4d7c0f', mood: 'nature' },
  { type: 'solid', id: 'solid-matrix-green', name: 'Matrix Green', color: '#00ff00', mood: 'cinematic' },

  // Purples
  { type: 'solid', id: 'solid-lavender', name: 'Lavender', color: '#c4b5fd', mood: 'serene' },
  { type: 'solid', id: 'solid-violet', name: 'Violet', color: '#8b5cf6', mood: 'vibrant' },
  { type: 'solid', id: 'solid-purple', name: 'Purple', color: '#7c3aed', mood: 'cosmic' },
  { type: 'solid', id: 'solid-grape', name: 'Grape', color: '#5b21b6', mood: 'cosmic' },
  { type: 'solid', id: 'solid-plum', name: 'Plum', color: '#9333ea', mood: 'vibrant' },
  { type: 'solid', id: 'solid-indigo', name: 'Indigo', color: '#4f46e5', mood: 'cosmic' },

  // Pinks & Reds
  { type: 'solid', id: 'solid-blush', name: 'Blush', color: '#fce7f3', mood: 'serene' },
  { type: 'solid', id: 'solid-rose', name: 'Rose', color: '#fda4af', mood: 'romantic' },
  { type: 'solid', id: 'solid-pink', name: 'Pink', color: '#ec4899', mood: 'vibrant' },
  { type: 'solid', id: 'solid-hot-pink', name: 'Hot Pink', color: '#f472b6', mood: 'vibrant' },
  { type: 'solid', id: 'solid-coral', name: 'Coral', color: '#fb7185', mood: 'sunset' },
  { type: 'solid', id: 'solid-crimson', name: 'Crimson', color: '#dc2626', mood: 'vibrant' },
  { type: 'solid', id: 'solid-ruby', name: 'Ruby', color: '#be123c', mood: 'vibrant' },
  { type: 'solid', id: 'solid-neon-red', name: 'Neon Red', color: '#ff0054', mood: 'cinematic' },

  // Oranges & Yellows
  { type: 'solid', id: 'solid-peach', name: 'Peach', color: '#fdba74', mood: 'sunset' },
  { type: 'solid', id: 'solid-tangerine', name: 'Tangerine', color: '#f97316', mood: 'vibrant' },
  { type: 'solid', id: 'solid-orange', name: 'Orange', color: '#ea580c', mood: 'vibrant' },
  { type: 'solid', id: 'solid-amber', name: 'Amber', color: '#f59e0b', mood: 'sunset' },
  { type: 'solid', id: 'solid-gold', name: 'Gold', color: '#eab308', mood: 'vibrant' },
  { type: 'solid', id: 'solid-cream', name: 'Cream', color: '#fef3c7', mood: 'serene' },
  { type: 'solid', id: 'solid-yellow', name: 'Yellow', color: '#fbbf24', mood: 'vibrant' },
  { type: 'solid', id: 'solid-sunshine', name: 'Sunshine', color: '#facc15', mood: 'vibrant' },

  // Browns & Earthy
  { type: 'solid', id: 'solid-sand', name: 'Sand', color: '#d4a574', mood: 'nature' },
  { type: 'solid', id: 'solid-caramel', name: 'Caramel', color: '#b45309', mood: 'nature' },
  { type: 'solid', id: 'solid-chocolate', name: 'Chocolate', color: '#78350f', mood: 'nature' },
  { type: 'solid', id: 'solid-espresso', name: 'Espresso', color: '#451a03', mood: 'midnight' },

  // Cinematic Colors
  { type: 'solid', id: 'solid-tron-blue', name: 'Tron Blue', color: '#00d4ff', mood: 'cinematic' },
  { type: 'solid', id: 'solid-tron-orange', name: 'Tron Orange', color: '#ff6b00', mood: 'cinematic' },
  { type: 'solid', id: 'solid-blade-runner', name: 'Blade Runner Pink', color: '#d90429', mood: 'cinematic' },
];

// ============================================================================
// CURATED PATTERNS (Expanded)
// ============================================================================

export const curatedPatterns: PatternWallpaper[] = [
  {
    type: 'pattern',
    id: 'pattern-dots-light',
    name: 'Subtle Dots',
    pattern: 'dots',
    baseColor: '#fafafa',
    patternColor: '#e4e4e7',
    opacity: 0.5,
    mood: 'minimal',
  },
  {
    type: 'pattern',
    id: 'pattern-dots-dark',
    name: 'Dark Dots',
    pattern: 'dots',
    baseColor: '#18181b',
    patternColor: '#3f3f46',
    opacity: 0.3,
    mood: 'midnight',
  },
  {
    type: 'pattern',
    id: 'pattern-grid-light',
    name: 'Light Grid',
    pattern: 'grid',
    baseColor: '#ffffff',
    patternColor: '#e2e8f0',
    opacity: 0.6,
    mood: 'minimal',
  },
  {
    type: 'pattern',
    id: 'pattern-grid-dark',
    name: 'Dark Grid',
    pattern: 'grid',
    baseColor: '#0f172a',
    patternColor: '#334155',
    opacity: 0.4,
    mood: 'midnight',
  },
  {
    type: 'pattern',
    id: 'pattern-noise',
    name: 'Film Grain',
    pattern: 'noise',
    baseColor: '#1c1917',
    patternColor: '#44403c',
    opacity: 0.15,
    mood: 'midnight',
  },
  {
    type: 'pattern',
    id: 'pattern-topo',
    name: 'Topography',
    pattern: 'topography',
    baseColor: '#f0fdf4',
    patternColor: '#86efac',
    opacity: 0.3,
    mood: 'nature',
  },
  {
    type: 'pattern',
    id: 'pattern-waves',
    name: 'Ocean Waves',
    pattern: 'waves',
    baseColor: '#0c4a6e',
    patternColor: '#0ea5e9',
    opacity: 0.2,
    mood: 'ocean',
  },
  {
    type: 'pattern',
    id: 'pattern-geometric',
    name: 'Geometric',
    pattern: 'geometric',
    baseColor: '#faf5ff',
    patternColor: '#c084fc',
    opacity: 0.15,
    mood: 'cosmic',
  },
  // New cinematic patterns
  {
    type: 'pattern',
    id: 'pattern-circuit',
    name: 'Circuit Board',
    pattern: 'circuit',
    baseColor: '#000000',
    patternColor: '#00ff00',
    opacity: 0.2,
    mood: 'cinematic',
  },
  {
    type: 'pattern',
    id: 'pattern-hexagon',
    name: 'Hexagon',
    pattern: 'hexagon',
    baseColor: '#0a0a0a',
    patternColor: '#00d4ff',
    opacity: 0.25,
    mood: 'cinematic',
  },
  {
    type: 'pattern',
    id: 'pattern-grid-tron',
    name: 'Tron Grid',
    pattern: 'grid',
    baseColor: '#000000',
    patternColor: '#00d4ff',
    opacity: 0.5,
    mood: 'cinematic',
  },
];

// ============================================================================
// DYNAMIC WALLPAPERS (Expanded)
// ============================================================================

export const curatedDynamicWallpapers: DynamicWallpaper[] = [
  {
    type: 'dynamic',
    id: 'dynamic-aurora',
    name: 'Living Aurora',
    style: 'aurora',
    colors: ['#3b82f6', '#10b981', '#8b5cf6', '#06b6d4'],
    speed: 'slow',
    mood: 'aurora',
  },
  {
    type: 'dynamic',
    id: 'dynamic-waves',
    name: 'Gentle Waves',
    style: 'waves',
    colors: ['#0891b2', '#06b6d4', '#22d3ee', '#67e8f9'],
    speed: 'slow',
    mood: 'ocean',
  },
  {
    type: 'dynamic',
    id: 'dynamic-particles',
    name: 'Stardust',
    style: 'particles',
    colors: ['#f8fafc', '#e2e8f0', '#fef3c7', '#fde68a'],
    speed: 'slow',
    mood: 'cosmic',
  },
  {
    type: 'dynamic',
    id: 'dynamic-morph',
    name: 'Morphing Colors',
    style: 'morph',
    colors: ['#ec4899', '#8b5cf6', '#3b82f6', '#06b6d4'],
    speed: 'medium',
    mood: 'vibrant',
  },
  {
    type: 'dynamic',
    id: 'dynamic-glow',
    name: 'Soft Glow',
    style: 'glow',
    colors: ['#fef3c7', '#fde68a', '#fcd34d'],
    speed: 'slow',
    mood: 'serene',
  },
  // Cinematic dynamic wallpapers
  {
    type: 'dynamic',
    id: 'dynamic-rain',
    name: 'Blade Runner Rain',
    style: 'rain',
    colors: ['#00d4ff', '#ff0054', '#1b263b'],
    speed: 'medium',
    mood: 'cinematic',
  },
  {
    type: 'dynamic',
    id: 'dynamic-matrix',
    name: 'Matrix Rain',
    style: 'matrix',
    colors: ['#00ff00', '#003300', '#000000'],
    speed: 'fast',
    mood: 'cinematic',
  },
  {
    type: 'dynamic',
    id: 'dynamic-holographic',
    name: 'Holographic',
    style: 'holographic',
    colors: ['#00d4ff', '#ff6b00', '#ff0054', '#00ff00'],
    speed: 'medium',
    mood: 'cinematic',
  },
  {
    type: 'dynamic',
    id: 'dynamic-nebula',
    name: 'Nebula Flow',
    style: 'nebula',
    colors: ['#5b21b6', '#be185d', '#06b6d4', '#1e1b4b'],
    speed: 'slow',
    mood: 'cosmic',
  },
];

// ============================================================================
// CINEMATIC MOOD PRESETS - Hollywood Movie Experiences
// ============================================================================

export const cinematicMoodPresets: MoodPreset[] = [
  {
    id: 'mood-blade-runner',
    name: 'Blade Runner',
    description: 'Neon-noir dystopian future with rain-soaked streets',
    category: 'cinematic',
    emoji: '🌧️',
    wallpaper: cinematicGradients.find(g => g.id === 'blade-runner-neon')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'cinematic',
    accentColor: '#ff0054',
  },
  {
    id: 'mood-matrix',
    name: 'The Matrix',
    description: 'Digital rain in the simulated reality',
    category: 'cinematic',
    emoji: '💊',
    wallpaper: cinematicGradients.find(g => g.id === 'matrix-code')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'cinematic',
    accentColor: '#00ff00',
  },
  {
    id: 'mood-interstellar',
    name: 'Interstellar',
    description: 'Journey through the vastness of space and time',
    category: 'epic',
    emoji: '🕳️',
    wallpaper: cinematicGradients.find(g => g.id === 'interstellar-wormhole')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'vibrant',
    accentColor: '#d4a574',
  },
  {
    id: 'mood-tron',
    name: 'Tron Legacy',
    description: 'Digital frontier with electric blue grids',
    category: 'cinematic',
    emoji: '🔷',
    wallpaper: cinematicGradients.find(g => g.id === 'tron-grid')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'cinematic',
    accentColor: '#00d4ff',
  },
  {
    id: 'mood-dune',
    name: 'Dune',
    description: 'Vast desert landscapes and spice dreams',
    category: 'epic',
    emoji: '🏜️',
    wallpaper: cinematicGradients.find(g => g.id === 'dune-desert')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#d4a574',
  },
  {
    id: 'mood-avatar',
    name: 'Avatar Pandora',
    description: 'Bioluminescent alien forests',
    category: 'dreamy',
    emoji: '🌿',
    wallpaper: cinematicGradients.find(g => g.id === 'pandora-glow')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'vibrant',
    accentColor: '#00bcd4',
  },
  {
    id: 'mood-inception',
    name: 'Inception',
    description: 'Dreamscape architecture and surreal depths',
    category: 'dreamy',
    emoji: '🌀',
    wallpaper: cinematicGradients.find(g => g.id === 'inception-dream')!,
    overlayOpacity: 20,
    blur: 0,
    particleStyle: 'normal',
    accentColor: '#4a69bd',
  },
  {
    id: 'mood-mad-max',
    name: 'Mad Max',
    description: 'Apocalyptic fury road with chrome and fire',
    category: 'epic',
    emoji: '🔥',
    wallpaper: cinematicGradients.find(g => g.id === 'fury-road')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'vibrant',
    accentColor: '#ff6600',
  },
  {
    id: 'mood-budapest',
    name: 'Grand Budapest',
    description: 'Wes Anderson pastels and symmetry',
    category: 'romantic',
    emoji: '🎀',
    wallpaper: cinematicGradients.find(g => g.id === 'budapest-pink')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#e8a4a4',
  },
  {
    id: 'mood-la-la-land',
    name: 'La La Land',
    description: 'Romantic golden hour magic',
    category: 'romantic',
    emoji: '🌟',
    wallpaper: cinematicGradients.find(g => g.id === 'la-la-twilight')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'normal',
    accentColor: '#ffc107',
  },
  {
    id: 'mood-joker',
    name: 'Joker',
    description: 'Psychological chaos and dark comedy',
    category: 'mysterious',
    emoji: '🃏',
    wallpaper: cinematicGradients.find(g => g.id === 'joker-stairs')!,
    overlayOpacity: 20,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#2e8b2e',
  },
  {
    id: 'mood-drive',
    name: 'Drive',
    description: 'Neon-soaked LA nights',
    category: 'cinematic',
    emoji: '🚗',
    wallpaper: cinematicGradients.find(g => g.id === 'drive-neon')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'cinematic',
    accentColor: '#ff1493',
  },
  {
    id: 'mood-her',
    name: 'Her',
    description: 'Warm, intimate digital connection',
    category: 'romantic',
    emoji: '💕',
    wallpaper: cinematicGradients.find(g => g.id === 'her-warmth')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#ff6633',
  },
  {
    id: 'mood-arrival',
    name: 'Arrival',
    description: 'Mysterious first contact',
    category: 'mysterious',
    emoji: '👽',
    wallpaper: cinematicGradients.find(g => g.id === 'arrival-fog')!,
    overlayOpacity: 10,
    blur: 5,
    particleStyle: 'subtle',
    accentColor: '#808080',
  },
  {
    id: 'mood-2001',
    name: 'Space Odyssey',
    description: 'The monolith awaits',
    category: 'epic',
    emoji: '🚀',
    wallpaper: cinematicGradients.find(g => g.id === 'space-odyssey')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#ff0000',
  },
];

// ============================================================================
// STANDARD MOOD PRESETS - Complete experiences
// ============================================================================

export const moodPresets: MoodPreset[] = [
  {
    id: 'mood-focus',
    name: 'Deep Focus',
    description: 'Minimal distractions, maximum concentration',
    category: 'minimal',
    emoji: '🎯',
    wallpaper: curatedGradients.find(g => g.id === 'subtle-gray')!,
    overlayOpacity: 0,
    blur: 0,
    particleStyle: 'none',
  },
  {
    id: 'mood-cozy',
    name: 'Cozy Evening',
    description: 'Warm and inviting atmosphere',
    category: 'sunset',
    emoji: '🕯️',
    wallpaper: curatedGradients.find(g => g.id === 'golden-hour')!,
    overlayOpacity: 30,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#f59e0b',
  },
  {
    id: 'mood-dreamy',
    name: 'Dreamy',
    description: 'Soft, ethereal vibes',
    category: 'serene',
    emoji: '☁️',
    wallpaper: curatedMeshGradients.find(g => g.id === 'mesh-dreamy')!,
    overlayOpacity: 20,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#c084fc',
  },
  {
    id: 'mood-cosmic',
    name: 'Cosmic Explorer',
    description: 'Journey through the stars',
    category: 'cosmic',
    emoji: '🌌',
    wallpaper: curatedGradients.find(g => g.id === 'nebula')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'vibrant',
    accentColor: '#a855f7',
  },
  {
    id: 'mood-nature',
    name: 'Forest Retreat',
    description: 'Peaceful woodland sanctuary',
    category: 'nature',
    emoji: '🌲',
    wallpaper: curatedGradients.find(g => g.id === 'forest-canopy')!,
    overlayOpacity: 20,
    blur: 0,
    particleStyle: 'normal',
    accentColor: '#10b981',
  },
  {
    id: 'mood-ocean',
    name: 'Ocean Calm',
    description: 'Soothing waves and sea breeze',
    category: 'ocean',
    emoji: '🌊',
    wallpaper: curatedGradients.find(g => g.id === 'deep-ocean')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#0891b2',
  },
  {
    id: 'mood-vibrant',
    name: 'Creative Energy',
    description: 'Bold colors for bold ideas',
    category: 'vibrant',
    emoji: '⚡',
    wallpaper: curatedGradients.find(g => g.id === 'electric-violet')!,
    overlayOpacity: 20,
    blur: 0,
    particleStyle: 'vibrant',
    accentColor: '#ec4899',
  },
  {
    id: 'mood-midnight',
    name: 'Midnight Mode',
    description: 'Easy on the eyes, elegant in the dark',
    category: 'midnight',
    emoji: '🌙',
    wallpaper: curatedGradients.find(g => g.id === 'obsidian')!,
    overlayOpacity: 0,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#64748b',
  },
  {
    id: 'mood-aurora',
    name: 'Northern Lights',
    description: 'Dancing colors in the night sky',
    category: 'aurora',
    emoji: '✨',
    wallpaper: curatedDynamicWallpapers.find(g => g.id === 'dynamic-aurora')!,
    overlayOpacity: 10,
    blur: 0,
    particleStyle: 'normal',
    accentColor: '#2dd4bf',
  },
  {
    id: 'mood-romantic',
    name: 'Romantic Sunset',
    description: 'Golden hour magic',
    category: 'romantic',
    emoji: '💕',
    wallpaper: curatedGradients.find(g => g.id === 'california-sunset')!,
    overlayOpacity: 15,
    blur: 0,
    particleStyle: 'subtle',
    accentColor: '#f97316',
  },
  // Add all cinematic presets
  ...cinematicMoodPresets,
];

// ============================================================================
// MOOD CATEGORIES WITH METADATA
// ============================================================================

export const moodCategories: { id: MoodCategory; name: string; emoji: string; description: string }[] = [
  { id: 'serene', name: 'Serene', emoji: '🌸', description: 'Soft, calming colors' },
  { id: 'vibrant', name: 'Vibrant', emoji: '🎨', description: 'Bold, energetic palettes' },
  { id: 'minimal', name: 'Minimal', emoji: '◽', description: 'Clean, distraction-free' },
  { id: 'cosmic', name: 'Cosmic', emoji: '🌌', description: 'Deep space vibes' },
  { id: 'nature', name: 'Nature', emoji: '🌿', description: 'Earthy, organic tones' },
  { id: 'sunset', name: 'Sunset', emoji: '🌅', description: 'Warm golden hours' },
  { id: 'ocean', name: 'Ocean', emoji: '🌊', description: 'Cool aquatic hues' },
  { id: 'aurora', name: 'Aurora', emoji: '✨', description: 'Magical light shows' },
  { id: 'midnight', name: 'Midnight', emoji: '🌙', description: 'Dark, elegant themes' },
  { id: 'cinematic', name: 'Cinematic', emoji: '🎬', description: 'Hollywood movie magic' },
  { id: 'romantic', name: 'Romantic', emoji: '💕', description: 'Warm, intimate vibes' },
  { id: 'mysterious', name: 'Mysterious', emoji: '🔮', description: 'Intriguing atmospheres' },
  { id: 'epic', name: 'Epic', emoji: '⚔️', description: 'Grand, sweeping visuals' },
  { id: 'dreamy', name: 'Dreamy', emoji: '☁️', description: 'Surreal, ethereal worlds' },
];

// ============================================================================
// UTILITIES
// ============================================================================

export const getGradientCSS = (gradient: GradientWallpaper): string => {
  const stops = gradient.stops
    .map(s => `${s.color} ${s.position}%`)
    .join(', ');

  switch (gradient.direction) {
    case 'to-t': return `linear-gradient(to top, ${stops})`;
    case 'to-tr': return `linear-gradient(to top right, ${stops})`;
    case 'to-r': return `linear-gradient(to right, ${stops})`;
    case 'to-br': return `linear-gradient(to bottom right, ${stops})`;
    case 'to-b': return `linear-gradient(to bottom, ${stops})`;
    case 'to-bl': return `linear-gradient(to bottom left, ${stops})`;
    case 'to-l': return `linear-gradient(to left, ${stops})`;
    case 'to-tl': return `linear-gradient(to top left, ${stops})`;
    case 'radial': return `radial-gradient(ellipse at center, ${stops})`;
    case 'conic': return `conic-gradient(from 0deg at 50% 50%, ${stops})`;
    default: return `linear-gradient(to bottom, ${stops})`;
  }
};

export const getMeshGradientCSS = (mesh: MeshGradientWallpaper): string => {
  const [c1, c2, c3, c4] = mesh.colors;
  return `
    radial-gradient(at 40% 20%, ${c1} 0px, transparent 50%),
    radial-gradient(at 80% 0%, ${c2} 0px, transparent 50%),
    radial-gradient(at 0% 50%, ${c3} 0px, transparent 50%),
    radial-gradient(at 80% 50%, ${c4} 0px, transparent 50%),
    radial-gradient(at 0% 100%, ${c1} 0px, transparent 50%),
    radial-gradient(at 80% 100%, ${c2} 0px, transparent 50%),
    radial-gradient(at 0% 0%, ${c3} 0px, transparent 50%)
  `;
};

export const getPatternCSS = (pattern: PatternWallpaper): { background: string; backgroundSize?: string } => {
  switch (pattern.pattern) {
    case 'dots':
      return {
        background: `
          ${pattern.baseColor}
          radial-gradient(${pattern.patternColor} 1px, transparent 1px)
        `,
        backgroundSize: '20px 20px',
      };
    case 'grid':
      return {
        background: `
          ${pattern.baseColor}
          linear-gradient(${pattern.patternColor}${Math.round(pattern.opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
          linear-gradient(90deg, ${pattern.patternColor}${Math.round(pattern.opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
      };
    case 'noise':
      return {
        background: `${pattern.baseColor}`,
      };
    case 'circuit':
      return {
        background: `${pattern.baseColor}`,
        backgroundSize: '60px 60px',
      };
    case 'hexagon':
      return {
        background: `${pattern.baseColor}`,
        backgroundSize: '50px 50px',
      };
    default:
      return { background: pattern.baseColor };
  }
};

export const getAllWallpapers = (): Wallpaper[] => [
  ...cinematicGradients,
  ...curatedGradients,
  ...curatedMeshGradients,
  ...curatedSolidColors,
  ...curatedPatterns,
  ...curatedDynamicWallpapers,
];

export const getWallpapersByMood = (mood: MoodCategory): Wallpaper[] => {
  return getAllWallpapers().filter(w => w.mood === mood);
};

export const getWallpaperById = (id: string): Wallpaper | undefined => {
  return getAllWallpapers().find(w => w.id === id);
};

export const getCinematicWallpapers = (): Wallpaper[] => {
  return getAllWallpapers().filter(w =>
    w.mood === 'cinematic' || w.mood === 'epic' || w.mood === 'dreamy' || w.mood === 'mysterious'
  );
};

export const getCinematicMoods = (): MoodPreset[] => {
  return moodPresets.filter(m =>
    m.category === 'cinematic' || m.category === 'epic' || m.category === 'dreamy' || m.category === 'mysterious' || m.category === 'romantic'
  );
};
