import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  Theme,
  ThemeSettings,
  ThemeCategory,
  AnimationIntensity,
  BackgroundStyle,
  allThemes,
  getThemeById,
  getThemesByCategory,
  defaultThemeSettings,
  lanternTheme,
} from '@/lib/themes';

// ============================================================================
// TYPES
// ============================================================================

export interface ThemeContextType {
  // Current state
  currentTheme: Theme;
  settings: ThemeSettings;
  isTransitioning: boolean;
  isDark: boolean;

  // Actions
  setTheme: (themeId: string) => void;
  setColorMode: (mode: 'light' | 'dark' | 'system') => void;
  setAnimationIntensity: (intensity: AnimationIntensity) => void;
  setBackgroundStyle: (style: BackgroundStyle) => void;
  setCustomAccentColor: (color: string | null) => void;
  resetToDefaults: () => void;
  toggleColorMode: () => void;

  // Utilities
  getThemeById: (id: string) => Theme | undefined;
  getThemesByCategory: (category: ThemeCategory) => Theme[];
  allThemes: Theme[];
}

// ============================================================================
// STORAGE KEYS
// ============================================================================

const THEME_STORAGE_KEY = 'lantern_theme_settings';

// ============================================================================
// CONTEXT
// ============================================================================

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// ============================================================================
// UTILITIES
// ============================================================================

const getSystemColorMode = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

const applyThemeToDOM = (theme: Theme, colorMode: 'light' | 'dark', customAccent: string | null) => {
  const root = document.documentElement;
  const colors = colorMode === 'dark' ? theme.colors.dark : theme.colors.light;

  // Apply color mode class
  if (colorMode === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Apply all CSS custom properties
  const colorKeys: (keyof typeof colors)[] = [
    'background', 'foreground', 'card', 'cardForeground',
    'primary', 'primaryForeground', 'secondary', 'secondaryForeground',
    'accent', 'accentForeground', 'muted', 'mutedForeground',
    'border', 'input', 'ring', 'glowColor', 'glowColorSoft',
    'particleColor', 'orbColor1', 'orbColor2'
  ];

  colorKeys.forEach(key => {
    const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
    let value = colors[key];

    // Override primary with custom accent if set
    if (customAccent && (key === 'primary' || key === 'glowColor' || key === 'particleColor')) {
      value = customAccent;
    }

    root.style.setProperty(`--${cssKey}`, value);
  });

  // Set theme-specific tokens
  root.style.setProperty('--theme-glow', customAccent || colors.glowColor);
  root.style.setProperty('--theme-glow-soft', colors.glowColorSoft);
  root.style.setProperty('--theme-particle', customAccent || colors.particleColor);
  root.style.setProperty('--theme-orb-1', colors.orbColor1);
  root.style.setProperty('--theme-orb-2', colors.orbColor2);

  // Set animation config
  root.style.setProperty('--glow-intensity', String(theme.animation.glowIntensity));
  root.style.setProperty('--float-amplitude', `${theme.animation.floatAmplitude}px`);
};

const applyAnimationIntensity = (intensity: AnimationIntensity) => {
  const root = document.documentElement;

  // Remove all intensity classes
  root.classList.remove('animation-none', 'animation-subtle', 'animation-normal', 'animation-energetic');

  // Add current intensity class
  root.classList.add(`animation-${intensity}`);

  // Set CSS variables for intensity
  const multipliers: Record<AnimationIntensity, number> = {
    none: 0,
    subtle: 0.5,
    normal: 1,
    energetic: 1.5,
  };

  root.style.setProperty('--animation-scale', String(multipliers[intensity]));
  root.style.setProperty('--particle-opacity', intensity === 'none' ? '0' : '1');
};

const loadSettings = (): ThemeSettings => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Validate the stored theme exists
      if (parsed.themeId && getThemeById(parsed.themeId)) {
        return { ...defaultThemeSettings, ...parsed };
      }
    }
  } catch (e) {
    console.warn('Failed to load theme settings:', e);
  }
  return defaultThemeSettings;
};

const saveSettings = (settings: ThemeSettings) => {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save theme settings:', e);
  }
};

// ============================================================================
// PROVIDER
// ============================================================================

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [settings, setSettings] = useState<ThemeSettings>(defaultThemeSettings);
  const [currentTheme, setCurrentTheme] = useState<Theme>(lanternTheme);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const loadedSettings = loadSettings();
    const theme = getThemeById(loadedSettings.themeId) || lanternTheme;

    setSettings(loadedSettings);
    setCurrentTheme(theme);

    // Determine actual color mode
    const actualMode = loadedSettings.colorMode === 'system'
      ? getSystemColorMode()
      : loadedSettings.colorMode;

    setIsDark(actualMode === 'dark');

    // Apply theme immediately
    applyThemeToDOM(theme, actualMode, loadedSettings.customAccentColor);
    applyAnimationIntensity(loadedSettings.animationIntensity);

    setIsInitialized(true);
  }, []);

  // Listen for system color scheme changes
  useEffect(() => {
    if (!isInitialized) return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      if (settings.colorMode === 'system') {
        const newMode = e.matches ? 'dark' : 'light';
        setIsDark(e.matches);
        applyThemeToDOM(currentTheme, newMode, settings.customAccentColor);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [isInitialized, settings.colorMode, currentTheme, settings.customAccentColor]);

  // Theme setter with cinematic transition
  const setTheme = useCallback((themeId: string) => {
    const newTheme = getThemeById(themeId);
    if (!newTheme || newTheme.id === currentTheme.id) return;

    // Start transition
    setIsTransitioning(true);
    document.documentElement.classList.add('theme-transitioning');

    // Small delay for transition overlay to render
    setTimeout(() => {
      const actualMode = settings.colorMode === 'system'
        ? getSystemColorMode()
        : settings.colorMode;

      // Apply new theme
      applyThemeToDOM(newTheme, actualMode, settings.customAccentColor);

      // Update state
      setCurrentTheme(newTheme);
      const newSettings = { ...settings, themeId };
      setSettings(newSettings);
      saveSettings(newSettings);

      // End transition after animation
      setTimeout(() => {
        setIsTransitioning(false);
        document.documentElement.classList.remove('theme-transitioning');
      }, 600);
    }, 100);
  }, [currentTheme.id, settings]);

  // Color mode setter
  const setColorMode = useCallback((mode: 'light' | 'dark' | 'system') => {
    const actualMode = mode === 'system' ? getSystemColorMode() : mode;

    setIsDark(actualMode === 'dark');
    applyThemeToDOM(currentTheme, actualMode, settings.customAccentColor);

    const newSettings = { ...settings, colorMode: mode };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [currentTheme, settings]);

  // Toggle between light and dark
  const toggleColorMode = useCallback(() => {
    const newMode = isDark ? 'light' : 'dark';
    setColorMode(newMode);
  }, [isDark, setColorMode]);

  // Animation intensity setter
  const setAnimationIntensity = useCallback((intensity: AnimationIntensity) => {
    applyAnimationIntensity(intensity);

    const newSettings = { ...settings, animationIntensity: intensity };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings]);

  // Background style setter
  const setBackgroundStyle = useCallback((style: BackgroundStyle) => {
    const newSettings = { ...settings, backgroundStyle: style };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [settings]);

  // Custom accent color setter
  const setCustomAccentColor = useCallback((color: string | null) => {
    const actualMode = settings.colorMode === 'system'
      ? getSystemColorMode()
      : settings.colorMode;

    applyThemeToDOM(currentTheme, actualMode, color);

    const newSettings = { ...settings, customAccentColor: color };
    setSettings(newSettings);
    saveSettings(newSettings);
  }, [currentTheme, settings]);

  // Reset to defaults
  const resetToDefaults = useCallback(() => {
    const actualMode = defaultThemeSettings.colorMode === 'system'
      ? getSystemColorMode()
      : defaultThemeSettings.colorMode;

    setSettings(defaultThemeSettings);
    setCurrentTheme(lanternTheme);
    setIsDark(actualMode === 'dark');

    applyThemeToDOM(lanternTheme, actualMode, null);
    applyAnimationIntensity(defaultThemeSettings.animationIntensity);
    saveSettings(defaultThemeSettings);
  }, []);

  const value: ThemeContextType = {
    currentTheme,
    settings,
    isTransitioning,
    isDark,
    setTheme,
    setColorMode,
    setAnimationIntensity,
    setBackgroundStyle,
    setCustomAccentColor,
    resetToDefaults,
    toggleColorMode,
    getThemeById,
    getThemesByCategory,
    allThemes,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

export default ThemeContext;
