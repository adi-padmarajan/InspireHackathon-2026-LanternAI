/**
 * Image Settings Types and Utilities
 * Award-winning customization with wallpapers, gradients, and images
 */

import type { Wallpaper } from './wallpapers';

// ============================================================================
// TYPES
// ============================================================================

export type ImageSource = 'unsplash' | 'upload' | 'curated' | 'none';

export type OverlayColorMode = 'theme' | 'dark' | 'light' | 'custom';

export interface UnsplashAttribution {
  photographerName: string;
  photographerUsername: string;
  photographerUrl: string;
  unsplashUrl: string;
}

export interface ImagePosition {
  x: number; // 0-100 percentage
  y: number; // 0-100 percentage
}

export interface BackgroundImage {
  id: string;
  source: ImageSource;
  url: string;
  thumbnailUrl?: string;
  blurHash?: string;
  attribution?: UnsplashAttribution;
  uploadedAt?: string;
  width: number;
  height: number;
}

export interface BackgroundSettings {
  enabled: boolean;
  image: BackgroundImage | null;
  wallpaper?: Wallpaper | null; // NEW: Support for gradient/mesh/pattern/dynamic wallpapers
  position: ImagePosition;
  overlayOpacity: number; // 0-100
  overlayColor: OverlayColorMode;
  customOverlayColor?: string;
  blur: number; // 0-20 px
  brightness: number; // 50-150 percentage
  saturation: number; // 0-200 percentage
}

export interface ThemeBackgroundSettings {
  useGlobalBackground: boolean;
  globalBackground: BackgroundSettings | null;
  themeBackgrounds: Record<string, BackgroundSettings>;
}

// ============================================================================
// UNSPLASH API TYPES
// ============================================================================

export interface UnsplashPhotoUrls {
  raw: string;
  full: string;
  regular: string;
  small: string;
  thumb: string;
}

export interface UnsplashUser {
  id: string;
  username: string;
  name: string;
  links: {
    html: string;
  };
}

export interface UnsplashPhoto {
  id: string;
  created_at: string;
  width: number;
  height: number;
  color: string;
  blur_hash: string;
  description: string | null;
  alt_description: string | null;
  urls: UnsplashPhotoUrls;
  user: UnsplashUser;
}

export interface UnsplashSearchResponse {
  total: number;
  total_pages: number;
  results: UnsplashPhoto[];
}

// ============================================================================
// CURATED CATEGORIES
// ============================================================================

export interface CuratedCategory {
  id: string;
  name: string;
  query: string;
  icon: string;
}

export const curatedCategories: CuratedCategory[] = [
  { id: 'nature', name: 'Nature', query: 'nature landscape mountains', icon: 'Mountain' },
  { id: 'abstract', name: 'Abstract', query: 'abstract gradient colorful', icon: 'Palette' },
  { id: 'minimal', name: 'Minimal', query: 'minimal clean white simple', icon: 'Square' },
  { id: 'space', name: 'Space', query: 'galaxy stars nebula cosmos', icon: 'Sparkles' },
  { id: 'ocean', name: 'Ocean', query: 'ocean waves beach sea', icon: 'Waves' },
  { id: 'forest', name: 'Forest', query: 'forest trees woods green', icon: 'TreePine' },
  { id: 'city', name: 'City', query: 'city skyline architecture urban', icon: 'Building2' },
  { id: 'sunset', name: 'Sunset', query: 'sunset sunrise golden hour', icon: 'Sunrise' },
];

// ============================================================================
// DEFAULTS
// ============================================================================

export const defaultImagePosition: ImagePosition = {
  x: 50,
  y: 50,
};

export const defaultBackgroundSettings: BackgroundSettings = {
  enabled: false,
  image: null,
  position: defaultImagePosition,
  overlayOpacity: 40,
  overlayColor: 'theme',
  blur: 0,
  brightness: 100,
  saturation: 100,
};

export const defaultThemeBackgroundSettings: ThemeBackgroundSettings = {
  useGlobalBackground: true,
  globalBackground: null,
  themeBackgrounds: {},
};

// ============================================================================
// STORAGE
// ============================================================================

export const BACKGROUND_STORAGE_KEY = 'lantern_background_settings';

export const loadBackgroundSettings = (): ThemeBackgroundSettings => {
  try {
    const stored = localStorage.getItem(BACKGROUND_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultThemeBackgroundSettings, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load background settings:', e);
  }
  return defaultThemeBackgroundSettings;
};

export const saveBackgroundSettings = (settings: ThemeBackgroundSettings): void => {
  try {
    localStorage.setItem(BACKGROUND_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save background settings:', e);
  }
};

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Convert Unsplash photo to BackgroundImage
 */
export const unsplashPhotoToBackgroundImage = (photo: UnsplashPhoto): BackgroundImage => ({
  id: photo.id,
  source: 'unsplash',
  url: photo.urls.regular,
  thumbnailUrl: photo.urls.small,
  blurHash: photo.blur_hash,
  attribution: {
    photographerName: photo.user.name,
    photographerUsername: photo.user.username,
    photographerUrl: photo.user.links.html,
    unsplashUrl: `https://unsplash.com/photos/${photo.id}`,
  },
  width: photo.width,
  height: photo.height,
});

/**
 * Get CSS for background image with effects
 */
export const getBackgroundImageCSS = (settings: BackgroundSettings): React.CSSProperties => {
  if (!settings.enabled || !settings.image) {
    return {};
  }

  return {
    backgroundImage: `url(${settings.image.url})`,
    backgroundPosition: `${settings.position.x}% ${settings.position.y}%`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    filter: `blur(${settings.blur}px) brightness(${settings.brightness}%) saturate(${settings.saturation}%)`,
  };
};

/**
 * Get overlay gradient based on color mode
 */
export const getOverlayGradient = (
  colorMode: OverlayColorMode,
  opacity: number,
  customColor?: string,
  isDark?: boolean
): string => {
  const alpha = opacity / 100;

  switch (colorMode) {
    case 'dark':
      return `linear-gradient(to bottom, rgba(0, 0, 0, ${alpha * 0.8}), rgba(0, 0, 0, ${alpha}))`;
    case 'light':
      return `linear-gradient(to bottom, rgba(255, 255, 255, ${alpha * 0.8}), rgba(255, 255, 255, ${alpha}))`;
    case 'custom':
      if (customColor) {
        return `linear-gradient(to bottom, ${customColor}${Math.round(alpha * 0.8 * 255).toString(16).padStart(2, '0')}, ${customColor}${Math.round(alpha * 255).toString(16).padStart(2, '0')})`;
      }
      // Fall through to theme
    case 'theme':
    default: {
      // Use theme-aware overlay
      const baseColor = isDark ? '0, 0, 0' : '255, 255, 255';
      return `linear-gradient(to bottom, rgba(${baseColor}, ${alpha * 0.6}), rgba(${baseColor}, ${alpha * 0.9}))`;
    }
  }
};

/**
 * Generate a unique ID for uploaded images
 */
export const generateImageId = (): string => {
  return `img_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
};

/**
 * Validate image file
 */
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB

  if (!validTypes.includes(file.type)) {
    return { valid: false, error: 'Invalid file type. Please upload JPEG, PNG, WebP, or GIF.' };
  }

  if (file.size > maxSize) {
    return { valid: false, error: 'File too large. Maximum size is 5MB.' };
  }

  return { valid: true };
};
