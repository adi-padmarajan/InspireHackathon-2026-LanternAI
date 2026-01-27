/**
 * Wallpaper System - Award-Winning Customization
 * Cinematic backgrounds with gradients, colors, patterns, and images
 */

export type WallpaperType = 'gradient' | 'solid' | 'mesh' | 'image' | 'dynamic' | 'pattern';

export type GradientDirection =
  | 'to-t' | 'to-tr' | 'to-r' | 'to-br'
  | 'to-b' | 'to-bl' | 'to-l' | 'to-tl'
  | 'radial' | 'conic';

export type MoodCategory =
  | 'serene' | 'vibrant' | 'minimal' | 'cosmic'
  | 'nature' | 'sunset' | 'ocean' | 'aurora' | 'midnight';

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
  pattern: 'dots' | 'grid' | 'waves' | 'noise' | 'grain' | 'geometric' | 'topography';
  baseColor: string;
  patternColor: string;
  opacity: number;
  mood?: MoodCategory;
}

export interface DynamicWallpaper {
  type: 'dynamic';
  id: string;
  name: string;
  style: 'aurora' | 'waves' | 'particles' | 'morph' | 'glow';
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
// MOOD PRESETS - Curated experiences
// ============================================================================

export interface MoodPreset {
  id: string;
  name: string;
  description: string;
  category: MoodCategory;
  wallpaper: Wallpaper;
  overlayOpacity: number;
  blur: number;
  particleStyle?: 'subtle' | 'normal' | 'vibrant' | 'none';
  accentColor?: string;
  emoji: string;
}

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
];

// ============================================================================
// CURATED SOLID COLORS - Sophisticated palettes
// ============================================================================

export const curatedSolidColors: SolidWallpaper[] = [
  // Neutrals
  { type: 'solid', id: 'solid-white', name: 'Pure White', color: '#ffffff', mood: 'minimal' },
  { type: 'solid', id: 'solid-snow', name: 'Snow', color: '#f8fafc', mood: 'minimal' },
  { type: 'solid', id: 'solid-slate', name: 'Slate', color: '#475569', mood: 'minimal' },
  { type: 'solid', id: 'solid-charcoal', name: 'Charcoal', color: '#1e293b', mood: 'midnight' },
  { type: 'solid', id: 'solid-obsidian', name: 'Obsidian', color: '#0f172a', mood: 'midnight' },
  { type: 'solid', id: 'solid-void', name: 'Void', color: '#030712', mood: 'midnight' },

  // Blues
  { type: 'solid', id: 'solid-sky', name: 'Sky', color: '#7dd3fc', mood: 'serene' },
  { type: 'solid', id: 'solid-azure', name: 'Azure', color: '#3b82f6', mood: 'vibrant' },
  { type: 'solid', id: 'solid-navy', name: 'Navy', color: '#1e3a8a', mood: 'cosmic' },
  { type: 'solid', id: 'solid-ocean', name: 'Ocean', color: '#0891b2', mood: 'ocean' },

  // Greens
  { type: 'solid', id: 'solid-mint', name: 'Mint', color: '#a7f3d0', mood: 'serene' },
  { type: 'solid', id: 'solid-emerald', name: 'Emerald', color: '#10b981', mood: 'nature' },
  { type: 'solid', id: 'solid-forest', name: 'Forest', color: '#166534', mood: 'nature' },
  { type: 'solid', id: 'solid-sage', name: 'Sage', color: '#84cc16', mood: 'nature' },

  // Purples
  { type: 'solid', id: 'solid-lavender', name: 'Lavender', color: '#c4b5fd', mood: 'serene' },
  { type: 'solid', id: 'solid-violet', name: 'Violet', color: '#8b5cf6', mood: 'vibrant' },
  { type: 'solid', id: 'solid-royal', name: 'Royal', color: '#7c3aed', mood: 'cosmic' },
  { type: 'solid', id: 'solid-grape', name: 'Grape', color: '#5b21b6', mood: 'cosmic' },

  // Pinks & Reds
  { type: 'solid', id: 'solid-rose', name: 'Rose', color: '#fda4af', mood: 'serene' },
  { type: 'solid', id: 'solid-pink', name: 'Pink', color: '#ec4899', mood: 'vibrant' },
  { type: 'solid', id: 'solid-coral', name: 'Coral', color: '#fb7185', mood: 'sunset' },
  { type: 'solid', id: 'solid-crimson', name: 'Crimson', color: '#dc2626', mood: 'vibrant' },

  // Oranges & Yellows
  { type: 'solid', id: 'solid-peach', name: 'Peach', color: '#fdba74', mood: 'sunset' },
  { type: 'solid', id: 'solid-tangerine', name: 'Tangerine', color: '#f97316', mood: 'vibrant' },
  { type: 'solid', id: 'solid-amber', name: 'Amber', color: '#f59e0b', mood: 'sunset' },
  { type: 'solid', id: 'solid-gold', name: 'Gold', color: '#eab308', mood: 'vibrant' },
  { type: 'solid', id: 'solid-cream', name: 'Cream', color: '#fef3c7', mood: 'serene' },
];

// ============================================================================
// CURATED PATTERNS
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
];

// ============================================================================
// DYNAMIC WALLPAPERS
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
];

// ============================================================================
// MOOD PRESETS - Complete experiences
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
    default:
      return { background: pattern.baseColor };
  }
};

export const getAllWallpapers = (): Wallpaper[] => [
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
