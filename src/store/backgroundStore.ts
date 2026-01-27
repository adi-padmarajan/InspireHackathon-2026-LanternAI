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

interface BackgroundSettings {
  // ...existing properties...
  backgroundImage: string | null;
  backgroundPosition: string;
}

interface ColorSettingsStore extends ColorSettings {
  setUsernameColor: (color: string) => void;
  setHighlightColor: (color: string) => void;
  setLogoIconColor: (color: string) => void;
  setLogoBgColor: (color: string) => void;
  resetToDefaults: () => void;
  setBackgroundPosition: (position: string) => void;
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
      setBackgroundPosition: (position: string) => set({ backgroundPosition: position }),
    }),
    {
      name: 'verdant-bloom-colors',
    }
  )
);

interface BackgroundStore {
  backgroundImage: string | null;
  backgroundPosition: string;
  setBackgroundImage: (image: string | null) => void;
  setBackgroundPosition: (position: string) => void;
}

export const useBackgroundStore = create<BackgroundStore>()(
  persist(
    (set) => ({
      backgroundImage: null,
      backgroundPosition: 'center',
      setBackgroundImage: (image: string | null) => set({ backgroundImage: image }),
      setBackgroundPosition: (position: string) => set({ backgroundPosition: position }),
    }),
    {
      name: 'verdant-bloom-background',
    }
  )
);