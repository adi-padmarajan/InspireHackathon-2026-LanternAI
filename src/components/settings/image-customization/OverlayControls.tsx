/**
 * OverlayControls Component
 * Controls for overlay opacity, color, blur, and brightness
 */

import { motion } from 'framer-motion';
import { Sun, Moon, Palette, Droplets, SunDim } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';

interface OverlayControlsProps {
  overlayOpacity: number;
  setOverlayOpacity: (opacity: number) => void;
  overlayColor: 'theme' | 'dark' | 'light';
  setOverlayColor: (color: 'theme' | 'dark' | 'light') => void;
  blur: number;
  setBlur: (blur: number) => void;
  brightness: number;
  setBrightness: (brightness: number) => void;
}

const colorOptions: Array<{
  id: 'theme' | 'dark' | 'light';
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
}> = [
  { id: 'theme', label: 'Auto', icon: Palette, description: 'Matches your theme' },
  { id: 'dark', label: 'Dark', icon: Moon, description: 'Dark overlay' },
  { id: 'light', label: 'Light', icon: Sun, description: 'Light overlay' },
];

export function OverlayControls({
  overlayOpacity,
  setOverlayOpacity,
  overlayColor,
  setOverlayColor,
  blur,
  setBlur,
  brightness,
  setBrightness,
}: OverlayControlsProps) {
  return (
    <div className="space-y-6">
      {/* Overlay Opacity */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground">
            Overlay Opacity
          </label>
          <span className="text-xs text-muted-foreground">
            {overlayOpacity}%
          </span>
        </div>
        <Slider
          value={[overlayOpacity]}
          min={0}
          max={100}
          step={5}
          onValueChange={([value]) => setOverlayOpacity(value)}
          className="w-full"
        />
        <p className="text-xs text-muted-foreground">
          Higher opacity makes text more readable
        </p>
      </div>

      {/* Overlay Color */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">
          Overlay Color
        </label>
        <div className="grid grid-cols-3 gap-2">
          {colorOptions.map((option) => {
            const Icon = option.icon;
            const isActive = overlayColor === option.id;

            return (
              <motion.button
                key={option.id}
                className={cn(
                  'flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-colors',
                  isActive
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50 bg-card'
                )}
                onClick={() => setOverlayColor(option.id)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Icon className={cn(
                  'w-5 h-5',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )} />
                <span className={cn(
                  'text-xs font-medium',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}>
                  {option.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Blur */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Blur
            </label>
          </div>
          <span className="text-xs text-muted-foreground">
            {blur}px
          </span>
        </div>
        <Slider
          value={[blur]}
          min={0}
          max={20}
          step={1}
          onValueChange={([value]) => setBlur(value)}
          className="w-full"
        />
      </div>

      {/* Brightness */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SunDim className="w-4 h-4 text-muted-foreground" />
            <label className="text-sm font-medium text-foreground">
              Brightness
            </label>
          </div>
          <span className="text-xs text-muted-foreground">
            {brightness}%
          </span>
        </div>
        <Slider
          value={[brightness]}
          min={50}
          max={150}
          step={5}
          onValueChange={([value]) => setBrightness(value)}
          className="w-full"
        />
      </div>
    </div>
  );
}

export default OverlayControls;
