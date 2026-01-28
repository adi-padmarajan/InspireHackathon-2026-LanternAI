import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
      name: 'lantern-background',
    }
  )
);
