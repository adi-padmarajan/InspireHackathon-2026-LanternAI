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

// Add position options array:
const positionOptions = [
  { value: 'top left', label: '↖ Top Left' },
  { value: 'top center', label: '↑ Top' },
  { value: 'top right', label: '↗ Top Right' },
  { value: 'center left', label: '← Left' },
  { value: 'center', label: '⊙ Center' },
  { value: 'center right', label: '→ Right' },
  { value: 'bottom left', label: '↙ Bottom Left' },
  { value: 'bottom center', label: '↓ Bottom' },
  { value: 'bottom right', label: '↘ Bottom Right' },
];

import React from 'react';
import { useBackgroundStore } from '../../store/backgroundStore';

export const BackgroundPositionPicker: React.FC = () => {
  const { backgroundImage, backgroundPosition, setBackgroundPosition } = useBackgroundStore();

  if (!backgroundImage) return null;

  return (
    <div className="p-4 rounded-lg border border-border bg-card">
      <h4 className="text-sm font-medium text-muted-foreground mb-3">Image Position</h4>
      <div className="grid grid-cols-3 gap-1 w-fit">
        {positionOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setBackgroundPosition(option.value)}
            className={`w-10 h-10 text-lg rounded-md border transition-colors ${
              backgroundPosition === option.value
                ? 'border-primary bg-primary/10 text-primary'
                : 'border-border hover:bg-muted text-muted-foreground'
            }`}
            title={option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};