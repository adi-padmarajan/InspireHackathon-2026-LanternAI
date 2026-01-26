// Theme System for Lantern - 15 Unique Themes
// Award-winning customization with cinematic transitions

export type ThemeCategory = 'default' | 'nature' | 'sports' | 'superheroes' | 'lifestyle';
export type ParticleVariant = 'fireflies' | 'orbs' | 'bubbles' | 'stars' | 'snow' | 'leaves' | 'sparks' | 'aurora';
export type SpringPreset = 'gentle' | 'bouncy' | 'snappy' | 'dreamy';
export type AnimationIntensity = 'none' | 'subtle' | 'normal' | 'energetic';
export type BackgroundStyle = 'particles' | 'orbs' | 'minimal' | 'dynamic';

export interface ThemeColors {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  accent: string;
  accentForeground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  input: string;
  ring: string;
  // Theme-specific
  glowColor: string;
  glowColorSoft: string;
  particleColor: string;
  orbColor1: string;
  orbColor2: string;
}

export interface ThemeParticleConfig {
  variant: ParticleVariant;
  count: number;
  baseColor: string;
  secondaryColor?: string;
  speed: 'slow' | 'medium' | 'fast';
  size: 'small' | 'medium' | 'large';
}

export interface ThemeAnimationConfig {
  springPreset: SpringPreset;
  glowIntensity: number;
  floatAmplitude: number;
}

export interface Theme {
  id: string;
  name: string;
  category: ThemeCategory;
  description: string;
  icon: string;
  colors: {
    light: ThemeColors;
    dark: ThemeColors;
  };
  particles: ThemeParticleConfig;
  animation: ThemeAnimationConfig;
  preview: {
    gradient: string;
    accentColors: string[];
  };
}

export interface ThemeSettings {
  themeId: string;
  colorMode: 'light' | 'dark' | 'system';
  animationIntensity: AnimationIntensity;
  backgroundStyle: BackgroundStyle;
  customAccentColor: string | null;
}

// ============================================================================
// DEFAULT THEME - LANTERN (Current warm amber companion)
// ============================================================================
export const lanternTheme: Theme = {
  id: 'lantern',
  name: 'Lantern',
  category: 'default',
  description: 'Warm, comforting glow like a guiding light through university life',
  icon: 'Flame',
  colors: {
    light: {
      background: '240 4% 95%',
      foreground: '240 5% 10%',
      card: '0 0% 98%',
      cardForeground: '240 5% 10%',
      primary: '258 89% 66%',
      primaryForeground: '250 100% 97%',
      secondary: '240 5% 33%',
      secondaryForeground: '0 0% 98%',
      accent: '269 100% 98%',
      accentForeground: '270 91% 65%',
      muted: '240 4% 83%',
      mutedForeground: '240 5% 35%',
      border: '240 4% 83%',
      input: '240 4% 83%',
      ring: '258 89% 66%',
      glowColor: '38 95% 55%',
      glowColorSoft: '38 90% 75%',
      particleColor: '38 95% 55%',
      orbColor1: '38 95% 55%',
      orbColor2: '258 89% 66%',
    },
    dark: {
      background: '240 5% 10%',
      foreground: '0 0% 98%',
      card: '240 4% 14%',
      cardForeground: '0 0% 98%',
      primary: '255 91% 76%',
      primaryForeground: '261 72% 22%',
      secondary: '240 3% 46%',
      secondaryForeground: '0 0% 98%',
      accent: '273 86% 20%',
      accentForeground: '269 100% 95%',
      muted: '240 4% 20%',
      mutedForeground: '240 4% 65%',
      border: '240 4% 20%',
      input: '240 4% 20%',
      ring: '255 91% 76%',
      glowColor: '38 95% 55%',
      glowColorSoft: '38 90% 65%',
      particleColor: '38 95% 60%',
      orbColor1: '38 95% 55%',
      orbColor2: '255 91% 76%',
    },
  },
  particles: {
    variant: 'fireflies',
    count: 15,
    baseColor: 'hsl(38 95% 55%)',
    speed: 'slow',
    size: 'small',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.7,
    floatAmplitude: 10,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(38 95% 55%) 0%, hsl(258 89% 66%) 100%)',
    accentColors: ['#F59E0B', '#A855F7', '#2D5A4A'],
  },
};

// ============================================================================
// NATURE THEMES
// ============================================================================

export const forestTheme: Theme = {
  id: 'forest',
  name: 'Forest',
  category: 'nature',
  description: 'Deep woodland tranquility and ancient tree wisdom',
  icon: 'TreePine',
  colors: {
    light: {
      background: '150 20% 96%',
      foreground: '150 30% 10%',
      card: '150 15% 98%',
      cardForeground: '150 30% 10%',
      primary: '152 45% 35%',
      primaryForeground: '150 20% 98%',
      secondary: '95 30% 45%',
      secondaryForeground: '95 10% 98%',
      accent: '152 35% 92%',
      accentForeground: '152 45% 30%',
      muted: '150 15% 88%',
      mutedForeground: '150 20% 40%',
      border: '150 15% 85%',
      input: '150 15% 85%',
      ring: '152 45% 35%',
      glowColor: '152 50% 45%',
      glowColorSoft: '152 40% 65%',
      particleColor: '95 40% 50%',
      orbColor1: '152 45% 35%',
      orbColor2: '95 30% 45%',
    },
    dark: {
      background: '150 25% 8%',
      foreground: '150 15% 95%',
      card: '150 20% 12%',
      cardForeground: '150 15% 95%',
      primary: '152 55% 45%',
      primaryForeground: '150 25% 10%',
      secondary: '95 35% 40%',
      secondaryForeground: '95 10% 95%',
      accent: '152 40% 18%',
      accentForeground: '152 50% 70%',
      muted: '150 20% 18%',
      mutedForeground: '150 15% 60%',
      border: '150 20% 18%',
      input: '150 20% 18%',
      ring: '152 55% 45%',
      glowColor: '152 60% 40%',
      glowColorSoft: '152 50% 55%',
      particleColor: '95 45% 45%',
      orbColor1: '152 55% 45%',
      orbColor2: '95 35% 40%',
    },
  },
  particles: {
    variant: 'leaves',
    count: 20,
    baseColor: 'hsl(95 40% 50%)',
    secondaryColor: 'hsl(152 45% 35%)',
    speed: 'slow',
    size: 'medium',
  },
  animation: {
    springPreset: 'dreamy',
    glowIntensity: 0.5,
    floatAmplitude: 15,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(152 45% 35%) 0%, hsl(95 30% 45%) 100%)',
    accentColors: ['#2D5A4A', '#6B8E23', '#8FBC8F'],
  },
};

export const oceanTheme: Theme = {
  id: 'ocean',
  name: 'Ocean',
  category: 'nature',
  description: 'Calming waves and deep sea serenity',
  icon: 'Waves',
  colors: {
    light: {
      background: '200 30% 96%',
      foreground: '210 50% 10%',
      card: '200 25% 98%',
      cardForeground: '210 50% 10%',
      primary: '200 80% 50%',
      primaryForeground: '200 20% 98%',
      secondary: '180 60% 45%',
      secondaryForeground: '180 10% 98%',
      accent: '200 70% 92%',
      accentForeground: '200 80% 40%',
      muted: '200 20% 88%',
      mutedForeground: '200 30% 40%',
      border: '200 20% 85%',
      input: '200 20% 85%',
      ring: '200 80% 50%',
      glowColor: '195 90% 55%',
      glowColorSoft: '195 80% 70%',
      particleColor: '200 70% 60%',
      orbColor1: '200 80% 50%',
      orbColor2: '180 60% 45%',
    },
    dark: {
      background: '210 50% 8%',
      foreground: '200 20% 95%',
      card: '210 45% 12%',
      cardForeground: '200 20% 95%',
      primary: '200 85% 55%',
      primaryForeground: '210 50% 10%',
      secondary: '180 65% 40%',
      secondaryForeground: '180 10% 95%',
      accent: '200 60% 18%',
      accentForeground: '200 80% 70%',
      muted: '210 40% 18%',
      mutedForeground: '200 20% 60%',
      border: '210 40% 18%',
      input: '210 40% 18%',
      ring: '200 85% 55%',
      glowColor: '195 80% 45%',
      glowColorSoft: '195 70% 55%',
      particleColor: '200 75% 55%',
      orbColor1: '200 85% 55%',
      orbColor2: '180 65% 40%',
    },
  },
  particles: {
    variant: 'bubbles',
    count: 25,
    baseColor: 'hsl(200 70% 60%)',
    secondaryColor: 'hsl(180 60% 50%)',
    speed: 'slow',
    size: 'small',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.6,
    floatAmplitude: 12,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(200 80% 50%) 0%, hsl(180 60% 45%) 100%)',
    accentColors: ['#0EA5E9', '#14B8A6', '#06B6D4'],
  },
};

export const auroraTheme: Theme = {
  id: 'aurora',
  name: 'Aurora',
  category: 'nature',
  description: 'Dancing northern lights across the sky',
  icon: 'Sparkles',
  colors: {
    light: {
      background: '260 20% 96%',
      foreground: '260 30% 10%',
      card: '260 15% 98%',
      cardForeground: '260 30% 10%',
      primary: '280 70% 60%',
      primaryForeground: '280 20% 98%',
      secondary: '160 70% 50%',
      secondaryForeground: '160 10% 98%',
      accent: '280 60% 92%',
      accentForeground: '280 70% 50%',
      muted: '260 15% 88%',
      mutedForeground: '260 20% 40%',
      border: '260 15% 85%',
      input: '260 15% 85%',
      ring: '280 70% 60%',
      glowColor: '270 80% 65%',
      glowColorSoft: '270 70% 80%',
      particleColor: '280 70% 60%',
      orbColor1: '280 70% 60%',
      orbColor2: '160 70% 50%',
    },
    dark: {
      background: '240 30% 6%',
      foreground: '260 15% 95%',
      card: '240 25% 10%',
      cardForeground: '260 15% 95%',
      primary: '280 75% 65%',
      primaryForeground: '240 30% 10%',
      secondary: '160 75% 45%',
      secondaryForeground: '160 10% 95%',
      accent: '280 50% 18%',
      accentForeground: '280 75% 75%',
      muted: '240 25% 16%',
      mutedForeground: '260 15% 60%',
      border: '240 25% 16%',
      input: '240 25% 16%',
      ring: '280 75% 65%',
      glowColor: '270 85% 60%',
      glowColorSoft: '270 75% 70%',
      particleColor: '280 75% 65%',
      orbColor1: '280 75% 65%',
      orbColor2: '160 75% 45%',
    },
  },
  particles: {
    variant: 'aurora',
    count: 8,
    baseColor: 'hsl(280 70% 60%)',
    secondaryColor: 'hsl(160 70% 50%)',
    speed: 'slow',
    size: 'large',
  },
  animation: {
    springPreset: 'dreamy',
    glowIntensity: 0.8,
    floatAmplitude: 20,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(280 70% 60%) 0%, hsl(160 70% 50%) 50%, hsl(200 80% 60%) 100%)',
    accentColors: ['#A855F7', '#10B981', '#06B6D4'],
  },
};

export const sunsetTheme: Theme = {
  id: 'sunset',
  name: 'Sunset',
  category: 'nature',
  description: 'Golden hour warmth painting the sky',
  icon: 'Sunrise',
  colors: {
    light: {
      background: '30 30% 96%',
      foreground: '25 40% 10%',
      card: '30 25% 98%',
      cardForeground: '25 40% 10%',
      primary: '25 95% 55%',
      primaryForeground: '25 20% 98%',
      secondary: '350 80% 60%',
      secondaryForeground: '350 10% 98%',
      accent: '25 85% 92%',
      accentForeground: '25 95% 45%',
      muted: '30 20% 88%',
      mutedForeground: '30 25% 40%',
      border: '30 20% 85%',
      input: '30 20% 85%',
      ring: '25 95% 55%',
      glowColor: '30 100% 50%',
      glowColorSoft: '30 90% 70%',
      particleColor: '30 100% 55%',
      orbColor1: '25 95% 55%',
      orbColor2: '350 80% 60%',
    },
    dark: {
      background: '25 35% 8%',
      foreground: '30 20% 95%',
      card: '25 30% 12%',
      cardForeground: '30 20% 95%',
      primary: '25 95% 60%',
      primaryForeground: '25 35% 10%',
      secondary: '350 85% 55%',
      secondaryForeground: '350 10% 95%',
      accent: '25 70% 18%',
      accentForeground: '25 95% 70%',
      muted: '25 30% 18%',
      mutedForeground: '30 20% 60%',
      border: '25 30% 18%',
      input: '25 30% 18%',
      ring: '25 95% 60%',
      glowColor: '30 100% 45%',
      glowColorSoft: '30 90% 55%',
      particleColor: '30 100% 50%',
      orbColor1: '25 95% 60%',
      orbColor2: '350 85% 55%',
    },
  },
  particles: {
    variant: 'sparks',
    count: 12,
    baseColor: 'hsl(30 100% 55%)',
    secondaryColor: 'hsl(350 80% 60%)',
    speed: 'medium',
    size: 'small',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.75,
    floatAmplitude: 8,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(25 95% 55%) 0%, hsl(350 80% 60%) 50%, hsl(280 60% 50%) 100%)',
    accentColors: ['#F97316', '#EC4899', '#8B5CF6'],
  },
};

export const cherryBlossomTheme: Theme = {
  id: 'cherry-blossom',
  name: 'Cherry Blossom',
  category: 'nature',
  description: 'Delicate spring petals floating gently',
  icon: 'Flower2',
  colors: {
    light: {
      background: '350 30% 97%',
      foreground: '350 30% 10%',
      card: '350 25% 99%',
      cardForeground: '350 30% 10%',
      primary: '350 75% 70%',
      primaryForeground: '350 20% 15%',
      secondary: '340 60% 80%',
      secondaryForeground: '340 40% 20%',
      accent: '350 65% 94%',
      accentForeground: '350 75% 55%',
      muted: '350 20% 90%',
      mutedForeground: '350 20% 45%',
      border: '350 20% 88%',
      input: '350 20% 88%',
      ring: '350 75% 70%',
      glowColor: '350 80% 75%',
      glowColorSoft: '350 70% 85%',
      particleColor: '350 75% 80%',
      orbColor1: '350 75% 70%',
      orbColor2: '340 60% 80%',
    },
    dark: {
      background: '350 25% 8%',
      foreground: '350 15% 95%',
      card: '350 20% 12%',
      cardForeground: '350 15% 95%',
      primary: '350 80% 65%',
      primaryForeground: '350 25% 10%',
      secondary: '340 65% 70%',
      secondaryForeground: '340 10% 95%',
      accent: '350 55% 18%',
      accentForeground: '350 80% 75%',
      muted: '350 20% 18%',
      mutedForeground: '350 15% 60%',
      border: '350 20% 18%',
      input: '350 20% 18%',
      ring: '350 80% 65%',
      glowColor: '350 85% 60%',
      glowColorSoft: '350 75% 70%',
      particleColor: '350 80% 70%',
      orbColor1: '350 80% 65%',
      orbColor2: '340 65% 70%',
    },
  },
  particles: {
    variant: 'leaves',
    count: 30,
    baseColor: 'hsl(350 75% 80%)',
    secondaryColor: 'hsl(0 0% 100%)',
    speed: 'slow',
    size: 'medium',
  },
  animation: {
    springPreset: 'dreamy',
    glowIntensity: 0.4,
    floatAmplitude: 18,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(350 75% 70%) 0%, hsl(340 60% 80%) 100%)',
    accentColors: ['#F472B6', '#FBCFE8', '#FDF2F8'],
  },
};

// ============================================================================
// SPORTS THEMES
// ============================================================================

export const basketballTheme: Theme = {
  id: 'basketball',
  name: 'Basketball',
  category: 'sports',
  description: 'Court energy and game time excitement',
  icon: 'Circle',
  colors: {
    light: {
      background: '30 20% 96%',
      foreground: '0 0% 10%',
      card: '30 15% 98%',
      cardForeground: '0 0% 10%',
      primary: '25 95% 50%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 15%',
      secondaryForeground: '0 0% 98%',
      accent: '25 85% 92%',
      accentForeground: '25 95% 40%',
      muted: '30 15% 88%',
      mutedForeground: '0 0% 40%',
      border: '30 15% 85%',
      input: '30 15% 85%',
      ring: '25 95% 50%',
      glowColor: '25 100% 55%',
      glowColorSoft: '25 90% 70%',
      particleColor: '25 95% 55%',
      orbColor1: '25 95% 50%',
      orbColor2: '0 0% 20%',
    },
    dark: {
      background: '0 0% 6%',
      foreground: '30 15% 95%',
      card: '0 0% 10%',
      cardForeground: '30 15% 95%',
      primary: '25 95% 55%',
      primaryForeground: '0 0% 5%',
      secondary: '0 0% 25%',
      secondaryForeground: '0 0% 95%',
      accent: '25 70% 18%',
      accentForeground: '25 95% 70%',
      muted: '0 0% 16%',
      mutedForeground: '30 10% 60%',
      border: '0 0% 16%',
      input: '0 0% 16%',
      ring: '25 95% 55%',
      glowColor: '25 100% 50%',
      glowColorSoft: '25 90% 60%',
      particleColor: '25 95% 55%',
      orbColor1: '25 95% 55%',
      orbColor2: '0 0% 30%',
    },
  },
  particles: {
    variant: 'sparks',
    count: 10,
    baseColor: 'hsl(25 95% 55%)',
    speed: 'fast',
    size: 'small',
  },
  animation: {
    springPreset: 'bouncy',
    glowIntensity: 0.8,
    floatAmplitude: 8,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(25 95% 50%) 0%, hsl(0 0% 15%) 100%)',
    accentColors: ['#EA580C', '#1C1917', '#D4A574'],
  },
};

export const soccerTheme: Theme = {
  id: 'soccer',
  name: 'Soccer',
  category: 'sports',
  description: 'Fresh grass and stadium atmosphere',
  icon: 'Goal',
  colors: {
    light: {
      background: '120 20% 96%',
      foreground: '120 30% 10%',
      card: '120 15% 98%',
      cardForeground: '120 30% 10%',
      primary: '120 60% 40%',
      primaryForeground: '0 0% 100%',
      secondary: '0 0% 98%',
      secondaryForeground: '0 0% 10%',
      accent: '120 50% 92%',
      accentForeground: '120 60% 30%',
      muted: '120 15% 88%',
      mutedForeground: '120 20% 40%',
      border: '120 15% 85%',
      input: '120 15% 85%',
      ring: '120 60% 40%',
      glowColor: '120 70% 45%',
      glowColorSoft: '120 60% 65%',
      particleColor: '120 65% 50%',
      orbColor1: '120 60% 40%',
      orbColor2: '0 0% 95%',
    },
    dark: {
      background: '120 25% 6%',
      foreground: '120 15% 95%',
      card: '120 20% 10%',
      cardForeground: '120 15% 95%',
      primary: '120 65% 45%',
      primaryForeground: '120 25% 8%',
      secondary: '0 0% 90%',
      secondaryForeground: '0 0% 10%',
      accent: '120 45% 16%',
      accentForeground: '120 65% 60%',
      muted: '120 20% 16%',
      mutedForeground: '120 15% 55%',
      border: '120 20% 16%',
      input: '120 20% 16%',
      ring: '120 65% 45%',
      glowColor: '120 75% 40%',
      glowColorSoft: '120 65% 50%',
      particleColor: '120 70% 45%',
      orbColor1: '120 65% 45%',
      orbColor2: '0 0% 85%',
    },
  },
  particles: {
    variant: 'leaves',
    count: 15,
    baseColor: 'hsl(120 65% 50%)',
    secondaryColor: 'hsl(120 40% 35%)',
    speed: 'medium',
    size: 'small',
  },
  animation: {
    springPreset: 'bouncy',
    glowIntensity: 0.6,
    floatAmplitude: 10,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(120 60% 40%) 0%, hsl(120 40% 25%) 100%)',
    accentColors: ['#16A34A', '#15803D', '#F0FDF4'],
  },
};

export const hockeyTheme: Theme = {
  id: 'hockey',
  name: 'Hockey',
  category: 'sports',
  description: 'Ice cool intensity and arena lights',
  icon: 'Snowflake',
  colors: {
    light: {
      background: '200 30% 97%',
      foreground: '200 40% 10%',
      card: '200 25% 99%',
      cardForeground: '200 40% 10%',
      primary: '200 90% 50%',
      primaryForeground: '200 25% 98%',
      secondary: '0 80% 50%',
      secondaryForeground: '0 10% 98%',
      accent: '200 80% 94%',
      accentForeground: '200 90% 40%',
      muted: '200 20% 90%',
      mutedForeground: '200 25% 40%',
      border: '200 20% 88%',
      input: '200 20% 88%',
      ring: '200 90% 50%',
      glowColor: '200 85% 60%',
      glowColorSoft: '200 75% 80%',
      particleColor: '200 30% 95%',
      orbColor1: '200 90% 50%',
      orbColor2: '0 80% 50%',
    },
    dark: {
      background: '200 35% 6%',
      foreground: '200 15% 95%',
      card: '200 30% 10%',
      cardForeground: '200 15% 95%',
      primary: '200 90% 55%',
      primaryForeground: '200 35% 8%',
      secondary: '0 85% 55%',
      secondaryForeground: '0 10% 95%',
      accent: '200 60% 16%',
      accentForeground: '200 90% 70%',
      muted: '200 25% 16%',
      mutedForeground: '200 15% 55%',
      border: '200 25% 16%',
      input: '200 25% 16%',
      ring: '200 90% 55%',
      glowColor: '200 85% 50%',
      glowColorSoft: '200 75% 60%',
      particleColor: '200 30% 90%',
      orbColor1: '200 90% 55%',
      orbColor2: '0 85% 55%',
    },
  },
  particles: {
    variant: 'snow',
    count: 40,
    baseColor: 'hsl(200 30% 95%)',
    speed: 'medium',
    size: 'small',
  },
  animation: {
    springPreset: 'snappy',
    glowIntensity: 0.7,
    floatAmplitude: 6,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(200 90% 50%) 0%, hsl(200 30% 95%) 100%)',
    accentColors: ['#0EA5E9', '#EF4444', '#F8FAFC'],
  },
};

// ============================================================================
// SUPERHERO THEMES
// ============================================================================

export const cosmicTheme: Theme = {
  id: 'cosmic',
  name: 'Cosmic',
  category: 'superheroes',
  description: 'Galactic power and stellar energy',
  icon: 'Orbit',
  colors: {
    light: {
      background: '260 25% 96%',
      foreground: '260 40% 10%',
      card: '260 20% 98%',
      cardForeground: '260 40% 10%',
      primary: '280 90% 60%',
      primaryForeground: '280 20% 98%',
      secondary: '200 100% 60%',
      secondaryForeground: '200 20% 10%',
      accent: '280 80% 92%',
      accentForeground: '280 90% 50%',
      muted: '260 18% 88%',
      mutedForeground: '260 25% 40%',
      border: '260 18% 85%',
      input: '260 18% 85%',
      ring: '280 90% 60%',
      glowColor: '270 100% 65%',
      glowColorSoft: '270 90% 80%',
      particleColor: '0 0% 100%',
      orbColor1: '280 90% 60%',
      orbColor2: '200 100% 60%',
    },
    dark: {
      background: '260 40% 5%',
      foreground: '260 15% 95%',
      card: '260 35% 8%',
      cardForeground: '260 15% 95%',
      primary: '280 90% 65%',
      primaryForeground: '260 40% 8%',
      secondary: '200 100% 55%',
      secondaryForeground: '200 15% 95%',
      accent: '280 60% 16%',
      accentForeground: '280 90% 75%',
      muted: '260 30% 14%',
      mutedForeground: '260 15% 55%',
      border: '260 30% 14%',
      input: '260 30% 14%',
      ring: '280 90% 65%',
      glowColor: '270 100% 60%',
      glowColorSoft: '270 90% 70%',
      particleColor: '0 0% 100%',
      orbColor1: '280 90% 65%',
      orbColor2: '200 100% 55%',
    },
  },
  particles: {
    variant: 'stars',
    count: 50,
    baseColor: 'hsl(0 0% 100%)',
    secondaryColor: 'hsl(270 100% 70%)',
    speed: 'slow',
    size: 'small',
  },
  animation: {
    springPreset: 'dreamy',
    glowIntensity: 0.9,
    floatAmplitude: 12,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(280 90% 60%) 0%, hsl(260 40% 8%) 50%, hsl(200 100% 60%) 100%)',
    accentColors: ['#A855F7', '#3B82F6', '#F8FAFC'],
  },
};

export const heroTheme: Theme = {
  id: 'hero',
  name: 'Hero',
  category: 'superheroes',
  description: 'Bold heroic energy and classic strength',
  icon: 'Shield',
  colors: {
    light: {
      background: '220 25% 96%',
      foreground: '220 40% 10%',
      card: '220 20% 98%',
      cardForeground: '220 40% 10%',
      primary: '220 90% 50%',
      primaryForeground: '220 20% 98%',
      secondary: '0 85% 55%',
      secondaryForeground: '0 10% 98%',
      accent: '220 80% 92%',
      accentForeground: '220 90% 40%',
      muted: '220 18% 88%',
      mutedForeground: '220 25% 40%',
      border: '220 18% 85%',
      input: '220 18% 85%',
      ring: '220 90% 50%',
      glowColor: '220 95% 55%',
      glowColorSoft: '220 85% 75%',
      particleColor: '220 90% 55%',
      orbColor1: '220 90% 50%',
      orbColor2: '0 85% 55%',
    },
    dark: {
      background: '220 35% 6%',
      foreground: '220 15% 95%',
      card: '220 30% 10%',
      cardForeground: '220 15% 95%',
      primary: '220 90% 55%',
      primaryForeground: '220 35% 8%',
      secondary: '0 90% 50%',
      secondaryForeground: '0 10% 95%',
      accent: '220 60% 16%',
      accentForeground: '220 90% 70%',
      muted: '220 28% 14%',
      mutedForeground: '220 15% 55%',
      border: '220 28% 14%',
      input: '220 28% 14%',
      ring: '220 90% 55%',
      glowColor: '220 95% 50%',
      glowColorSoft: '220 85% 60%',
      particleColor: '220 90% 55%',
      orbColor1: '220 90% 55%',
      orbColor2: '0 90% 50%',
    },
  },
  particles: {
    variant: 'sparks',
    count: 15,
    baseColor: 'hsl(220 90% 55%)',
    secondaryColor: 'hsl(45 95% 55%)',
    speed: 'medium',
    size: 'small',
  },
  animation: {
    springPreset: 'bouncy',
    glowIntensity: 0.85,
    floatAmplitude: 6,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(220 90% 50%) 0%, hsl(0 85% 55%) 100%)',
    accentColors: ['#2563EB', '#DC2626', '#FBBF24'],
  },
};

export const nightGuardianTheme: Theme = {
  id: 'night-guardian',
  name: 'Night Guardian',
  category: 'superheroes',
  description: 'Dark vigilante mystique and shadows',
  icon: 'Moon',
  colors: {
    light: {
      background: '240 15% 94%',
      foreground: '240 30% 10%',
      card: '240 10% 96%',
      cardForeground: '240 30% 10%',
      primary: '240 15% 25%',
      primaryForeground: '45 90% 50%',
      secondary: '45 90% 50%',
      secondaryForeground: '240 20% 10%',
      accent: '240 15% 88%',
      accentForeground: '240 15% 20%',
      muted: '240 12% 86%',
      mutedForeground: '240 15% 45%',
      border: '240 12% 82%',
      input: '240 12% 82%',
      ring: '45 90% 50%',
      glowColor: '45 85% 45%',
      glowColorSoft: '45 75% 65%',
      particleColor: '45 90% 50%',
      orbColor1: '45 90% 50%',
      orbColor2: '240 15% 25%',
    },
    dark: {
      background: '240 20% 4%',
      foreground: '240 10% 95%',
      card: '240 18% 7%',
      cardForeground: '240 10% 95%',
      primary: '45 90% 50%',
      primaryForeground: '240 20% 6%',
      secondary: '240 15% 20%',
      secondaryForeground: '240 10% 90%',
      accent: '240 15% 12%',
      accentForeground: '45 90% 55%',
      muted: '240 16% 12%',
      mutedForeground: '240 10% 50%',
      border: '240 16% 12%',
      input: '240 16% 12%',
      ring: '45 90% 50%',
      glowColor: '45 85% 40%',
      glowColorSoft: '45 75% 50%',
      particleColor: '45 90% 50%',
      orbColor1: '45 90% 50%',
      orbColor2: '240 15% 15%',
    },
  },
  particles: {
    variant: 'fireflies',
    count: 8,
    baseColor: 'hsl(45 90% 50%)',
    speed: 'slow',
    size: 'small',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.6,
    floatAmplitude: 5,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(240 20% 8%) 0%, hsl(45 90% 50%) 100%)',
    accentColors: ['#1E1B2E', '#EAB308', '#374151'],
  },
};

// ============================================================================
// LIFESTYLE THEMES
// ============================================================================

export const cyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk',
  category: 'lifestyle',
  description: 'Neon-soaked digital future',
  icon: 'Zap',
  colors: {
    light: {
      background: '280 20% 96%',
      foreground: '280 40% 10%',
      card: '280 15% 98%',
      cardForeground: '280 40% 10%',
      primary: '320 100% 60%',
      primaryForeground: '320 20% 10%',
      secondary: '180 100% 50%',
      secondaryForeground: '180 20% 10%',
      accent: '320 90% 92%',
      accentForeground: '320 100% 50%',
      muted: '280 15% 88%',
      mutedForeground: '280 20% 40%',
      border: '280 15% 85%',
      input: '280 15% 85%',
      ring: '320 100% 60%',
      glowColor: '320 100% 65%',
      glowColorSoft: '320 90% 80%',
      particleColor: '320 100% 60%',
      orbColor1: '320 100% 60%',
      orbColor2: '180 100% 50%',
    },
    dark: {
      background: '260 30% 5%',
      foreground: '280 15% 95%',
      card: '260 25% 8%',
      cardForeground: '280 15% 95%',
      primary: '320 100% 60%',
      primaryForeground: '260 30% 8%',
      secondary: '180 100% 50%',
      secondaryForeground: '180 15% 10%',
      accent: '320 70% 16%',
      accentForeground: '320 100% 70%',
      muted: '260 25% 14%',
      mutedForeground: '280 15% 55%',
      border: '260 25% 14%',
      input: '260 25% 14%',
      ring: '320 100% 60%',
      glowColor: '320 100% 55%',
      glowColorSoft: '320 90% 65%',
      particleColor: '320 100% 60%',
      orbColor1: '320 100% 60%',
      orbColor2: '180 100% 50%',
    },
  },
  particles: {
    variant: 'sparks',
    count: 20,
    baseColor: 'hsl(320 100% 60%)',
    secondaryColor: 'hsl(180 100% 50%)',
    speed: 'fast',
    size: 'small',
  },
  animation: {
    springPreset: 'snappy',
    glowIntensity: 1.0,
    floatAmplitude: 3,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(320 100% 60%) 0%, hsl(260 30% 8%) 50%, hsl(180 100% 50%) 100%)',
    accentColors: ['#EC4899', '#06B6D4', '#A855F7'],
  },
};

export const minimalTheme: Theme = {
  id: 'minimal',
  name: 'Minimal',
  category: 'lifestyle',
  description: 'Clean, focused simplicity',
  icon: 'Minus',
  colors: {
    light: {
      background: '0 0% 98%',
      foreground: '0 0% 10%',
      card: '0 0% 100%',
      cardForeground: '0 0% 10%',
      primary: '0 0% 15%',
      primaryForeground: '0 0% 98%',
      secondary: '0 0% 45%',
      secondaryForeground: '0 0% 98%',
      accent: '0 0% 94%',
      accentForeground: '0 0% 15%',
      muted: '0 0% 92%',
      mutedForeground: '0 0% 45%',
      border: '0 0% 88%',
      input: '0 0% 88%',
      ring: '0 0% 15%',
      glowColor: '0 0% 50%',
      glowColorSoft: '0 0% 70%',
      particleColor: '0 0% 80%',
      orbColor1: '0 0% 60%',
      orbColor2: '0 0% 40%',
    },
    dark: {
      background: '0 0% 6%',
      foreground: '0 0% 95%',
      card: '0 0% 9%',
      cardForeground: '0 0% 95%',
      primary: '0 0% 90%',
      primaryForeground: '0 0% 8%',
      secondary: '0 0% 55%',
      secondaryForeground: '0 0% 95%',
      accent: '0 0% 14%',
      accentForeground: '0 0% 85%',
      muted: '0 0% 14%',
      mutedForeground: '0 0% 55%',
      border: '0 0% 14%',
      input: '0 0% 14%',
      ring: '0 0% 90%',
      glowColor: '0 0% 45%',
      glowColorSoft: '0 0% 55%',
      particleColor: '0 0% 70%',
      orbColor1: '0 0% 50%',
      orbColor2: '0 0% 30%',
    },
  },
  particles: {
    variant: 'orbs',
    count: 3,
    baseColor: 'hsl(0 0% 80%)',
    speed: 'slow',
    size: 'large',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.2,
    floatAmplitude: 5,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(0 0% 90%) 0%, hsl(0 0% 70%) 100%)',
    accentColors: ['#F5F5F5', '#A3A3A3', '#525252'],
  },
};

export const cozyTheme: Theme = {
  id: 'cozy',
  name: 'Cozy',
  category: 'lifestyle',
  description: 'Warm blanket comfort and relaxation',
  icon: 'Coffee',
  colors: {
    light: {
      background: '30 30% 96%',
      foreground: '25 35% 12%',
      card: '30 25% 98%',
      cardForeground: '25 35% 12%',
      primary: '25 60% 45%',
      primaryForeground: '30 25% 98%',
      secondary: '15 50% 55%',
      secondaryForeground: '15 10% 98%',
      accent: '30 50% 92%',
      accentForeground: '25 60% 35%',
      muted: '30 22% 88%',
      mutedForeground: '25 25% 42%',
      border: '30 22% 85%',
      input: '30 22% 85%',
      ring: '25 60% 45%',
      glowColor: '30 70% 50%',
      glowColorSoft: '30 60% 70%',
      particleColor: '30 70% 55%',
      orbColor1: '25 60% 45%',
      orbColor2: '15 50% 55%',
    },
    dark: {
      background: '25 30% 8%',
      foreground: '30 20% 95%',
      card: '25 25% 12%',
      cardForeground: '30 20% 95%',
      primary: '25 65% 50%',
      primaryForeground: '25 30% 10%',
      secondary: '15 55% 45%',
      secondaryForeground: '15 10% 95%',
      accent: '25 45% 18%',
      accentForeground: '25 65% 65%',
      muted: '25 25% 18%',
      mutedForeground: '30 18% 55%',
      border: '25 25% 18%',
      input: '25 25% 18%',
      ring: '25 65% 50%',
      glowColor: '30 75% 45%',
      glowColorSoft: '30 65% 55%',
      particleColor: '30 75% 50%',
      orbColor1: '25 65% 50%',
      orbColor2: '15 55% 45%',
    },
  },
  particles: {
    variant: 'fireflies',
    count: 10,
    baseColor: 'hsl(30 70% 55%)',
    speed: 'slow',
    size: 'medium',
  },
  animation: {
    springPreset: 'gentle',
    glowIntensity: 0.55,
    floatAmplitude: 8,
  },
  preview: {
    gradient: 'linear-gradient(135deg, hsl(25 60% 45%) 0%, hsl(15 50% 55%) 100%)',
    accentColors: ['#92400E', '#B45309', '#FEF3C7'],
  },
};

// ============================================================================
// THEME COLLECTION & UTILITIES
// ============================================================================

export const allThemes: Theme[] = [
  lanternTheme,
  forestTheme,
  oceanTheme,
  auroraTheme,
  sunsetTheme,
  cherryBlossomTheme,
  basketballTheme,
  soccerTheme,
  hockeyTheme,
  cosmicTheme,
  heroTheme,
  nightGuardianTheme,
  cyberpunkTheme,
  minimalTheme,
  cozyTheme,
];

export const themeCategories: { id: ThemeCategory; name: string; icon: string }[] = [
  { id: 'default', name: 'Default', icon: 'Flame' },
  { id: 'nature', name: 'Nature', icon: 'Leaf' },
  { id: 'sports', name: 'Sports', icon: 'Trophy' },
  { id: 'superheroes', name: 'Superheroes', icon: 'Zap' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'Heart' },
];

export const getThemeById = (id: string): Theme | undefined => {
  return allThemes.find(theme => theme.id === id);
};

export const getThemesByCategory = (category: ThemeCategory): Theme[] => {
  return allThemes.filter(theme => theme.category === category);
};

export const defaultThemeSettings: ThemeSettings = {
  themeId: 'lantern',
  colorMode: 'system',
  animationIntensity: 'normal',
  backgroundStyle: 'particles',
  customAccentColor: null,
};
