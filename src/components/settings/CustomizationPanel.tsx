/**
 * CustomizationPanel Component
 * Controls for animation intensity, background style, accent color, and color mode
 */

import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Sparkles, Circle, Minus, Zap, Palette, RotateCcw, type LucideIcon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { AnimationIntensity, BackgroundStyle } from '@/lib/themes';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ImageCustomizationPanel } from './image-customization';
import { cn } from '@/lib/utils';

// ============================================================================
// COLOR MODE SELECTOR
// ============================================================================

export const ColorModeSelector = () => {
  const { settings, setColorMode, isDark } = useTheme();

  const modes = [
    { id: 'light' as const, icon: Sun, label: 'Light' },
    { id: 'dark' as const, icon: Moon, label: 'Dark' },
    { id: 'system' as const, icon: Monitor, label: 'System' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Color Mode</label>
      <div className="grid grid-cols-3 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          const isActive = settings.colorMode === mode.id;

          return (
            <motion.button
              key={mode.id}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-card"
              )}
              onClick={() => setColorMode(mode.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Icon className={cn(
                "h-5 w-5",
                isActive ? "text-primary" : "text-muted-foreground"
              )} />
              <span className={cn(
                "text-xs font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {mode.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// ANIMATION INTENSITY SELECTOR
// ============================================================================

export const AnimationIntensitySelector = () => {
  const { settings, setAnimationIntensity } = useTheme();

  const intensities: { id: AnimationIntensity; icon: LucideIcon; label: string; description: string }[] = [
    { id: 'none', icon: Minus, label: 'None', description: 'No animations' },
    { id: 'subtle', icon: Circle, label: 'Subtle', description: 'Minimal movement' },
    { id: 'normal', icon: Sparkles, label: 'Normal', description: 'Balanced animations' },
    { id: 'energetic', icon: Zap, label: 'Energetic', description: 'Lively effects' },
  ];

  const currentIndex = intensities.findIndex(i => i.id === settings.animationIntensity);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Animation Intensity</label>
        <span className="text-xs text-muted-foreground">
          {intensities[currentIndex]?.label}
        </span>
      </div>

      {/* Slider */}
      <div className="px-2">
        <Slider
          value={[currentIndex]}
          min={0}
          max={3}
          step={1}
          onValueChange={([value]) => setAnimationIntensity(intensities[value].id)}
          className="w-full"
        />
      </div>

      {/* Visual indicator */}
      <div className="grid grid-cols-4 gap-2">
        {intensities.map((intensity, i) => {
          const Icon = intensity.icon;
          const isActive = settings.animationIntensity === intensity.id;

          return (
            <motion.button
              key={intensity.id}
              className={cn(
                "flex flex-col items-center gap-1.5 p-2 rounded-lg border transition-colors",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:bg-muted/50"
              )}
              onClick={() => setAnimationIntensity(intensity.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                animate={isActive && intensity.id !== 'none' ? {
                  rotate: intensity.id === 'energetic' ? [0, 10, -10, 0] : 0,
                  scale: intensity.id === 'subtle' ? [1, 1.05, 1] : intensity.id === 'energetic' ? [1, 1.1, 1] : 1,
                } : {}}
                transition={{ duration: intensity.id === 'energetic' ? 0.5 : 2, repeat: Infinity }}
              >
                <Icon className={cn(
                  "h-4 w-4",
                  isActive ? "text-primary" : "text-muted-foreground"
                )} />
              </motion.div>
              <span className={cn(
                "text-[10px] font-medium",
                isActive ? "text-primary" : "text-muted-foreground"
              )}>
                {intensity.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// BACKGROUND STYLE SELECTOR
// ============================================================================

export const BackgroundStyleSelector = () => {
  const { settings, setBackgroundStyle } = useTheme();

  const styles: { id: BackgroundStyle; label: string; description: string }[] = [
    { id: 'particles', label: 'Particles', description: 'Theme-specific effects' },
    { id: 'orbs', label: 'Orbs', description: 'Floating gradient orbs' },
    { id: 'minimal', label: 'Minimal', description: 'Subtle, clean look' },
    { id: 'dynamic', label: 'Dynamic', description: 'Enhanced intensity' },
  ];

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">Background Style</label>
      <div className="grid grid-cols-2 gap-2">
        {styles.map((style) => {
          const isActive = settings.backgroundStyle === style.id;

          return (
            <motion.button
              key={style.id}
              className={cn(
                "flex flex-col items-start gap-1 p-3 rounded-xl border-2 transition-colors text-left",
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50 bg-card"
              )}
              onClick={() => setBackgroundStyle(style.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className={cn(
                "text-sm font-medium",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {style.label}
              </span>
              <span className="text-xs text-muted-foreground">
                {style.description}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

// ============================================================================
// ACCENT COLOR PICKER
// ============================================================================

export const AccentColorPicker = () => {
  const { settings, setCustomAccentColor, currentTheme } = useTheme();

  const presetColors = [
    null, // Theme default
    '350 80% 60%', // Pink
    '25 95% 55%', // Orange
    '45 95% 50%', // Yellow
    '152 55% 45%', // Green
    '200 85% 55%', // Blue
    '270 80% 60%', // Purple
    '320 100% 60%', // Magenta
  ];

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">Accent Color</label>
        {settings.customAccentColor && (
          <button
            onClick={() => setCustomAccentColor(null)}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Reset
          </button>
        )}
      </div>
      <div className="flex gap-2 flex-wrap">
        {presetColors.map((color, i) => {
          const isActive = color === settings.customAccentColor ||
            (color === null && settings.customAccentColor === null);
          const displayColor = color
            ? `hsl(${color})`
            : `hsl(${currentTheme.colors.light.primary})`;

          return (
            <motion.button
              key={i}
              className={cn(
                "relative w-8 h-8 rounded-full border-2 transition-colors overflow-hidden",
                isActive ? "border-foreground" : "border-border hover:border-foreground/50"
              )}
              style={{ backgroundColor: displayColor }}
              onClick={() => setCustomAccentColor(color)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {color === null && (
                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white drop-shadow">
                  T
                </span>
              )}
              {isActive && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  <div className="w-2 h-2 rounded-full bg-white shadow" />
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>
      <p className="text-xs text-muted-foreground">
        {settings.customAccentColor
          ? "Custom accent color applied"
          : "Using theme default"}
      </p>
    </div>
  );
};

// ============================================================================
// RESET BUTTON
// ============================================================================

export const ResetButton = () => {
  const { resetToDefaults } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={resetToDefaults}
      className="w-full gap-2"
    >
      <RotateCcw className="h-4 w-4" />
      Reset to Defaults
    </Button>
  );
};

// ============================================================================
// MAIN CUSTOMIZATION PANEL
// ============================================================================

export const CustomizationPanel = () => {
  return (
    <motion.div
      className="space-y-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
    >
      <ColorModeSelector />
      <ImageCustomizationPanel />
      <AnimationIntensitySelector />
      <BackgroundStyleSelector />
      <AccentColorPicker />
      <div className="pt-4 border-t border-border">
        <ResetButton />
      </div>
    </motion.div>
  );
};

export default CustomizationPanel;
