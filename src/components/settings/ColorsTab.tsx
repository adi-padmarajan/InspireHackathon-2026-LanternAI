import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ColorSettings {
  // Text colors
  usernameColor: string;
  highlightColor: string;
  // Logo colors
  logoIconColor: string;
  logoBgColor: string;
}

interface ColorSettingsStore extends ColorSettings {
  setUsernameColor: (color: string) => void;
  setHighlightColor: (color: string) => void;
  setLogoIconColor: (color: string) => void;
  setLogoBgColor: (color: string) => void;
  resetToDefaults: () => void;
}

const defaultColors: ColorSettings = {
  usernameColor: '#a855f7', // Purple (default)
  highlightColor: '#a855f7',
  logoIconColor: '#ffffff', // White icon
  logoBgColor: '#7c3aed', // Purple background
};

export const useColorSettingsStore = create<ColorSettingsStore>()(
  persist(
    (set) => ({
      ...defaultColors,
      setUsernameColor: (color: string) => set({ usernameColor: color }),
      setHighlightColor: (color: string) => set({ highlightColor: color }),
      setLogoIconColor: (color: string) => set({ logoIconColor: color }),
      setLogoBgColor: (color: string) => set({ logoBgColor: color }),
      resetToDefaults: () => set(defaultColors),
    }),
    {
      name: 'verdant-bloom-colors',
    }
  )
);

// Find the accent colors array and add black and white at the beginning:
const accentColors = [
  '#000000', // Black
  '#ffffff', // White
  '#7c3aed', // Purple (existing)
  '#ec4899', // Pink
  '#f97316', // Orange
  '#eab308', // Yellow
  '#22c55e', // Green
  '#06b6d4', // Cyan
  '#8b5cf6', // Violet
  '#f472b6', // Light Pink
];

// If the color buttons need a visible border for white, update the button styling:
// Add a border class for visibility when color is white
<button
  key={color}
  onClick={() => handleAccentChange(color)}
  className={`w-12 h-12 rounded-full transition-transform hover:scale-110 ${
    selectedAccent === color ? 'ring-2 ring-offset-2 ring-foreground' : ''
  } ${color === '#ffffff' ? 'border border-muted-foreground/50' : ''}`}
  style={{ backgroundColor: color }}
/>