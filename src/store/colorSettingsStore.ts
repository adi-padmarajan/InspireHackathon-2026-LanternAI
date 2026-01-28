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
      name: 'lantern-colors',
    }
  )
);
