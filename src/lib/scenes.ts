/**
 * Ambient Scenes System
 * A new paradigm for customization - combining focal images, particles, and mood
 */

import { ParticleVariant } from './themes';

export type SceneMood = 'focus' | 'relax' | 'create' | 'energize';

export interface SceneImage {
  id: string;
  url: string;
  thumbnailUrl?: string;
  blurHash?: string;
  attribution?: {
    photographerName: string;
    photographerUsername: string;
    photographerUrl: string;
    unsplashUrl: string;
  };
  dominantColor?: string;
}

export interface AmbientScene {
  id: string;
  name: string;
  description: string;
  mood: SceneMood;
  image: SceneImage;
  particles: {
    variant: ParticleVariant;
    count: number;
    color: string;
    secondaryColor?: string;
  };
  colorAccent: string;
  overlayOpacity: number;
  imageStyle: 'card' | 'floating' | 'framed' | 'minimal';
  ambientGlow: boolean;
  isCustom?: boolean;
}

export interface SceneSettings {
  enabled: boolean;
  activeSceneId: string | null;
  customScenes: AmbientScene[];
  widgetLayout: WidgetConfig[];
  showDailyInspiration: boolean;
  focusModeEnabled: boolean;
}

export interface WidgetConfig {
  id: string;
  type: WidgetType;
  position: { x: number; y: number };
  size: 'small' | 'medium' | 'large';
  visible: boolean;
  settings?: Record<string, unknown>;
}

export type WidgetType =
  | 'clock'
  | 'weather'
  | 'inspiration'
  | 'mood-tracker'
  | 'focus-timer'
  | 'scene-card';

// ============================================================================
// PRE-BUILT SCENES
// ============================================================================

export const prebuiltScenes: AmbientScene[] = [
  {
    id: 'mountain-focus',
    name: 'Mountain Focus',
    description: 'Majestic peaks for deep concentration',
    mood: 'focus',
    image: {
      id: 'mountain-1',
      url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
      attribution: {
        photographerName: 'Samuel Ferrara',
        photographerUsername: 'samferrara',
        photographerUrl: 'https://unsplash.com/@samferrara',
        unsplashUrl: 'https://unsplash.com/photos/1527pjeb6jg',
      },
      dominantColor: '#4a6fa5',
    },
    particles: {
      variant: 'snow',
      count: 15,
      color: 'hsl(210, 30%, 90%)',
    },
    colorAccent: '210 50% 60%',
    overlayOpacity: 20,
    imageStyle: 'card',
    ambientGlow: true,
  },
  {
    id: 'forest-calm',
    name: 'Forest Sanctuary',
    description: 'Peaceful woodland for relaxation',
    mood: 'relax',
    image: {
      id: 'forest-1',
      url: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=400',
      attribution: {
        photographerName: 'Sebastian Unrau',
        photographerUsername: 'sebastian_unrau',
        photographerUrl: 'https://unsplash.com/@sebastian_unrau',
        unsplashUrl: 'https://unsplash.com/photos/sp-p7uuT0tw',
      },
      dominantColor: '#2d5a4a',
    },
    particles: {
      variant: 'leaves',
      count: 20,
      color: 'hsl(140, 40%, 45%)',
      secondaryColor: 'hsl(95, 35%, 55%)',
    },
    colorAccent: '152 45% 40%',
    overlayOpacity: 15,
    imageStyle: 'floating',
    ambientGlow: true,
  },
  {
    id: 'ocean-waves',
    name: 'Ocean Breeze',
    description: 'Calming waves for peaceful moments',
    mood: 'relax',
    image: {
      id: 'ocean-1',
      url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=400',
      attribution: {
        photographerName: 'Frank McKenna',
        photographerUsername: 'frankiefoto',
        photographerUrl: 'https://unsplash.com/@frankiefoto',
        unsplashUrl: 'https://unsplash.com/photos/tjX_sniNzgQ',
      },
      dominantColor: '#1e90b0',
    },
    particles: {
      variant: 'bubbles',
      count: 25,
      color: 'hsl(195, 70%, 65%)',
      secondaryColor: 'hsl(180, 60%, 55%)',
    },
    colorAccent: '195 75% 55%',
    overlayOpacity: 18,
    imageStyle: 'card',
    ambientGlow: true,
  },
  {
    id: 'sunset-creative',
    name: 'Golden Hour',
    description: 'Inspiring sunset for creative work',
    mood: 'create',
    image: {
      id: 'sunset-1',
      url: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1495616811223-4d98c6e9c869?w=400',
      attribution: {
        photographerName: 'Luca Bravo',
        photographerUsername: 'lucabravo',
        photographerUrl: 'https://unsplash.com/@lucabravo',
        unsplashUrl: 'https://unsplash.com/photos/ESkw2ayO2As',
      },
      dominantColor: '#e67e22',
    },
    particles: {
      variant: 'fireflies',
      count: 12,
      color: 'hsl(35, 95%, 55%)',
      secondaryColor: 'hsl(20, 90%, 50%)',
    },
    colorAccent: '30 90% 55%',
    overlayOpacity: 12,
    imageStyle: 'floating',
    ambientGlow: true,
  },
  {
    id: 'aurora-wonder',
    name: 'Northern Lights',
    description: 'Magical aurora for inspiration',
    mood: 'create',
    image: {
      id: 'aurora-1',
      url: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400',
      attribution: {
        photographerName: 'Johny Goerend',
        photographerUsername: 'johnygoerend',
        photographerUrl: 'https://unsplash.com/@johnygoerend',
        unsplashUrl: 'https://unsplash.com/photos/Oz2ZQ2j8We8',
      },
      dominantColor: '#6b5b95',
    },
    particles: {
      variant: 'aurora',
      count: 6,
      color: 'hsl(280, 70%, 60%)',
      secondaryColor: 'hsl(160, 70%, 50%)',
    },
    colorAccent: '270 65% 55%',
    overlayOpacity: 10,
    imageStyle: 'framed',
    ambientGlow: true,
  },
  {
    id: 'city-energy',
    name: 'Urban Pulse',
    description: 'City lights for energized focus',
    mood: 'energize',
    image: {
      id: 'city-1',
      url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?w=400',
      attribution: {
        photographerName: 'Jezael Melgoza',
        photographerUsername: 'jezael',
        photographerUrl: 'https://unsplash.com/@jezael',
        unsplashUrl: 'https://unsplash.com/photos/layMbSJ3YOE',
      },
      dominantColor: '#1a1a2e',
    },
    particles: {
      variant: 'sparks',
      count: 18,
      color: 'hsl(45, 100%, 60%)',
      secondaryColor: 'hsl(200, 100%, 60%)',
    },
    colorAccent: '45 95% 55%',
    overlayOpacity: 25,
    imageStyle: 'card',
    ambientGlow: true,
  },
  {
    id: 'cosmic-dream',
    name: 'Cosmic Dream',
    description: 'Stars and galaxies for wonder',
    mood: 'create',
    image: {
      id: 'cosmic-1',
      url: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=400',
      attribution: {
        photographerName: 'NASA',
        photographerUsername: 'nasa',
        photographerUrl: 'https://unsplash.com/@nasa',
        unsplashUrl: 'https://unsplash.com/photos/rTZW4f02zY8',
      },
      dominantColor: '#1a1a3e',
    },
    particles: {
      variant: 'stars',
      count: 50,
      color: 'hsl(0, 0%, 100%)',
      secondaryColor: 'hsl(270, 100%, 70%)',
    },
    colorAccent: '270 80% 60%',
    overlayOpacity: 8,
    imageStyle: 'framed',
    ambientGlow: true,
  },
  {
    id: 'zen-minimal',
    name: 'Zen Garden',
    description: 'Minimalist peace for clarity',
    mood: 'focus',
    image: {
      id: 'zen-1',
      url: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1200',
      thumbnailUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400',
      attribution: {
        photographerName: 'Jared Rice',
        photographerUsername: 'jareddrice',
        photographerUrl: 'https://unsplash.com/@jareddrice',
        unsplashUrl: 'https://unsplash.com/photos/NTyBbu66_SI',
      },
      dominantColor: '#d4c5a9',
    },
    particles: {
      variant: 'orbs',
      count: 4,
      color: 'hsl(40, 30%, 75%)',
    },
    colorAccent: '40 25% 65%',
    overlayOpacity: 5,
    imageStyle: 'minimal',
    ambientGlow: false,
  },
];

// ============================================================================
// DAILY INSPIRATIONS
// ============================================================================

export interface DailyInspiration {
  id: string;
  quote: string;
  author: string;
  image: SceneImage;
  mood: SceneMood;
}

export const inspirationalQuotes: Omit<DailyInspiration, 'id' | 'image'>[] = [
  { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs", mood: 'create' },
  { quote: "In the middle of difficulty lies opportunity.", author: "Albert Einstein", mood: 'focus' },
  { quote: "Peace comes from within. Do not seek it without.", author: "Buddha", mood: 'relax' },
  { quote: "Energy and persistence conquer all things.", author: "Benjamin Franklin", mood: 'energize' },
  { quote: "The mind is everything. What you think you become.", author: "Buddha", mood: 'focus' },
  { quote: "Creativity takes courage.", author: "Henri Matisse", mood: 'create' },
  { quote: "Almost everything will work again if you unplug it for a few minutes.", author: "Anne Lamott", mood: 'relax' },
  { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt", mood: 'energize' },
  { quote: "Simplicity is the ultimate sophistication.", author: "Leonardo da Vinci", mood: 'focus' },
  { quote: "Every moment is a fresh beginning.", author: "T.S. Eliot", mood: 'create' },
  { quote: "Nature does not hurry, yet everything is accomplished.", author: "Lao Tzu", mood: 'relax' },
  { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt", mood: 'energize' },
];

// ============================================================================
// MOOD CONFIGURATIONS
// ============================================================================

export const moodConfig: Record<SceneMood, {
  label: string;
  description: string;
  icon: string;
  gradient: string;
  accentColor: string;
}> = {
  focus: {
    label: 'Focus',
    description: 'Deep concentration and clarity',
    icon: 'Target',
    gradient: 'from-blue-500/20 to-indigo-500/20',
    accentColor: '220 70% 55%',
  },
  relax: {
    label: 'Relax',
    description: 'Calm and peaceful atmosphere',
    icon: 'Leaf',
    gradient: 'from-green-500/20 to-teal-500/20',
    accentColor: '160 50% 45%',
  },
  create: {
    label: 'Create',
    description: 'Inspiration and imagination',
    icon: 'Sparkles',
    gradient: 'from-purple-500/20 to-pink-500/20',
    accentColor: '280 65% 55%',
  },
  energize: {
    label: 'Energize',
    description: 'Motivation and drive',
    icon: 'Zap',
    gradient: 'from-orange-500/20 to-yellow-500/20',
    accentColor: '35 90% 55%',
  },
};

// ============================================================================
// DEFAULT SETTINGS
// ============================================================================

export const defaultSceneSettings: SceneSettings = {
  enabled: false,
  activeSceneId: null,
  customScenes: [],
  widgetLayout: [
    { id: 'clock-1', type: 'clock', position: { x: 20, y: 20 }, size: 'medium', visible: true },
    { id: 'inspiration-1', type: 'inspiration', position: { x: 50, y: 50 }, size: 'large', visible: true },
  ],
  showDailyInspiration: true,
  focusModeEnabled: false,
};

// ============================================================================
// UTILITIES
// ============================================================================

export const getSceneById = (id: string, customScenes: AmbientScene[] = []): AmbientScene | undefined => {
  return [...prebuiltScenes, ...customScenes].find(scene => scene.id === id);
};

export const getScenesByMood = (mood: SceneMood, customScenes: AmbientScene[] = []): AmbientScene[] => {
  return [...prebuiltScenes, ...customScenes].filter(scene => scene.mood === mood);
};

export const getDailyQuote = (): Omit<DailyInspiration, 'id' | 'image'> => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24)
  );
  return inspirationalQuotes[dayOfYear % inspirationalQuotes.length];
};
