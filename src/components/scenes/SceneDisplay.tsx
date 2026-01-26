/**
 * SceneDisplay Component
 * Renders the active ambient scene with beautiful image presentation
 * Images are displayed as focal elements, not stretched backgrounds
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useScene } from '@/contexts/SceneContext';
import { cn } from '@/lib/utils';

interface SceneDisplayProps {
  className?: string;
}

export function SceneDisplay({ className }: SceneDisplayProps) {
  const { activeScene, isSceneEnabled } = useScene();

  if (!isSceneEnabled || !activeScene) {
    return null;
  }

  const { image, imageStyle, overlayOpacity, colorAccent, ambientGlow } = activeScene;

  // Different rendering styles for the focal image
  const renderImage = () => {
    switch (imageStyle) {
      case 'floating':
        return (
          <motion.div
            className="relative w-[320px] md:w-[400px] lg:w-[480px] aspect-[4/3]"
            initial={{ opacity: 0, y: 30, rotateX: 10 }}
            animate={{
              opacity: 1,
              y: [0, -8, 0],
              rotateX: 0,
            }}
            transition={{
              opacity: { duration: 0.8 },
              y: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
              rotateX: { duration: 1 },
            }}
            style={{
              perspective: '1000px',
            }}
          >
            {/* Floating shadow */}
            <motion.div
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-[80%] h-6 rounded-full bg-black/20 blur-xl"
              animate={{
                scale: [1, 0.9, 1],
                opacity: [0.3, 0.2, 0.3],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Image container */}
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image.url}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />

              {/* Subtle overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                style={{ opacity: overlayOpacity / 100 }}
              />
            </div>

            {/* Ambient glow behind */}
            {ambientGlow && (
              <motion.div
                className="absolute -inset-8 -z-10 rounded-3xl blur-3xl"
                style={{
                  background: `radial-gradient(circle, hsl(${colorAccent} / 0.4), transparent 70%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.div>
        );

      case 'framed':
        return (
          <motion.div
            className="relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            {/* Decorative frame */}
            <div className="absolute -inset-3 rounded-3xl border-2 border-white/10" />
            <div className="absolute -inset-6 rounded-3xl border border-white/5" />

            {/* Image */}
            <div className="relative w-[300px] md:w-[380px] lg:w-[440px] aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl">
              <img
                src={image.url}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-br from-black/20 via-transparent to-black/30"
                style={{ opacity: overlayOpacity / 100 }}
              />

              {/* Inner border highlight */}
              <div className="absolute inset-0 rounded-2xl border border-white/20" />
            </div>

            {/* Ambient glow */}
            {ambientGlow && (
              <motion.div
                className="absolute -inset-12 -z-10 rounded-full blur-3xl"
                style={{
                  background: `radial-gradient(circle, hsl(${colorAccent} / 0.3), transparent 60%)`,
                }}
                animate={{
                  opacity: [0.4, 0.7, 0.4],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}
          </motion.div>
        );

      case 'minimal':
        return (
          <motion.div
            className="relative w-[280px] md:w-[340px] lg:w-[400px] aspect-square"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            {/* Simple circular mask */}
            <div className="relative w-full h-full rounded-full overflow-hidden shadow-xl">
              <img
                src={image.url}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />

              {/* Soft vignette */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.3) 100%)',
                  opacity: overlayOpacity / 100,
                }}
              />
            </div>

            {/* Soft ring */}
            <div className="absolute -inset-2 rounded-full border border-white/10" />
          </motion.div>
        );

      case 'card':
      default:
        return (
          <motion.div
            className="relative w-[320px] md:w-[420px] lg:w-[500px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Card container */}
            <div className="relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <img
                src={image.url}
                alt={activeScene.name}
                className="w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent"
                style={{ opacity: overlayOpacity / 100 }}
              />

              {/* Scene info */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.h3
                  className="text-lg font-semibold text-white"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {activeScene.name}
                </motion.h3>
                <motion.p
                  className="text-sm text-white/70"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  {activeScene.description}
                </motion.p>
              </div>
            </div>

            {/* Ambient glow */}
            {ambientGlow && (
              <motion.div
                className="absolute -inset-8 -z-10 rounded-3xl blur-3xl"
                style={{
                  background: `linear-gradient(135deg, hsl(${colorAccent} / 0.4), transparent 60%)`,
                }}
                animate={{
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
            )}

            {/* Attribution */}
            {image.attribution && (
              <motion.div
                className="absolute -bottom-8 left-0 right-0 flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <a
                  href={image.attribution.unsplashUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                >
                  Photo by {image.attribution.photographerName} on Unsplash
                </a>
              </motion.div>
            )}
          </motion.div>
        );
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeScene.id}
        className={cn(
          'fixed inset-0 flex items-center justify-center pointer-events-none z-0',
          className
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background ambient color */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(ellipse at center, hsl(${colorAccent} / 0.15), transparent 70%)`,
          }}
        />

        {/* Focal image */}
        {renderImage()}
      </motion.div>
    </AnimatePresence>
  );
}

export default SceneDisplay;
