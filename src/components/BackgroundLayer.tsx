/**
 * BackgroundLayer Component
 * Renders the customizable background image behind all content
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { getOverlayGradient } from '@/lib/imageSettings';

export function BackgroundLayer() {
  const { currentBackground, isDark } = useTheme();

  const hasBackground = currentBackground?.enabled && currentBackground?.image;

  return (
    <AnimatePresence>
      {hasBackground && currentBackground?.image && (
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background image */}
          <motion.img
            src={currentBackground.image.url}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{
              objectPosition: `${currentBackground.position.x}% ${currentBackground.position.y}%`,
              filter: `blur(${currentBackground.blur}px) brightness(${currentBackground.brightness}%) saturate(${currentBackground.saturation || 100}%)`,
            }}
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.05, opacity: 0 }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />

          {/* Gradient overlay */}
          <motion.div
            className="absolute inset-0"
            style={{
              background: getOverlayGradient(
                currentBackground.overlayColor,
                currentBackground.overlayOpacity,
                currentBackground.customOverlayColor,
                isDark
              ),
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />

          {/* Vignette effect for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.2) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BackgroundLayer;
