/**
 * ImageCustomizationPanel Component
 * Entry point for background image customization in settings
 */

import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Settings2, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from '@/contexts/ThemeContext';
import { useImagePicker, ImagePickerModal } from './index';
import { cn } from '@/lib/utils';

export function ImageCustomizationPanel() {
  const {
    currentBackground,
    backgroundSettings,
    setBackgroundSettings,
    setGlobalBackground,
    clearBackground,
  } = useTheme();

  const picker = useImagePicker({
    initialSettings: currentBackground,
    onSelect: (settings) => {
      setBackgroundSettings(settings);
    },
  });

  const hasBackground = currentBackground?.enabled && currentBackground?.image;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-foreground">
          Background Image
        </label>
        {hasBackground && (
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs text-destructive hover:text-destructive gap-1"
            onClick={clearBackground}
          >
            <Trash2 className="w-3 h-3" />
            Remove
          </Button>
        )}
      </div>

      {/* Preview / Add button */}
      <motion.button
        className={cn(
          'relative w-full aspect-video rounded-xl overflow-hidden',
          'border-2 border-dashed transition-colors',
          hasBackground
            ? 'border-primary/50 hover:border-primary'
            : 'border-border hover:border-primary/50'
        )}
        onClick={picker.openModal}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
      >
        {hasBackground && currentBackground?.image ? (
          <>
            {/* Background image preview */}
            <img
              src={currentBackground.image.thumbnailUrl || currentBackground.image.url}
              alt="Background preview"
              className="w-full h-full object-cover"
              style={{
                objectPosition: `${currentBackground.position.x}% ${currentBackground.position.y}%`,
                filter: `blur(${currentBackground.blur}px) brightness(${currentBackground.brightness}%)`,
              }}
            />

            {/* Overlay preview */}
            <div
              className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60"
              style={{ opacity: currentBackground.overlayOpacity / 100 }}
            />

            {/* Edit indicator */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity"
              initial={false}
            >
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-black/50 text-white text-sm">
                <Settings2 className="w-4 h-4" />
                <span>Edit Background</span>
              </div>
            </motion.div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-muted-foreground">
            <motion.div
              className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3"
              whileHover={{ scale: 1.1 }}
            >
              <Plus className="w-6 h-6" />
            </motion.div>
            <p className="text-sm font-medium">Add Background Image</p>
            <p className="text-xs mt-1">Search Unsplash or upload your own</p>
          </div>
        )}
      </motion.button>

      {/* Global vs per-theme toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
        <div className="flex items-center gap-2">
          <ImageIcon className="w-4 h-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-medium">Use for all themes</p>
            <p className="text-xs text-muted-foreground">
              {backgroundSettings.useGlobalBackground
                ? 'Same background for all themes'
                : 'Different background per theme'}
            </p>
          </div>
        </div>
        <Switch
          checked={backgroundSettings.useGlobalBackground}
          onCheckedChange={setGlobalBackground}
        />
      </div>

      {/* Attribution */}
      {hasBackground && currentBackground?.image?.attribution && (
        <motion.div
          className="flex items-center gap-2 text-xs text-muted-foreground"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span>Photo by</span>
          <a
            href={currentBackground.image.attribution.photographerUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            {currentBackground.image.attribution.photographerName}
          </a>
          <span>on</span>
          <a
            href={currentBackground.image.attribution.unsplashUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-foreground hover:underline"
          >
            Unsplash
          </a>
        </motion.div>
      )}

      {/* Image Picker Modal */}
      <ImagePickerModal picker={picker} />
    </div>
  );
}

export default ImageCustomizationPanel;
