/**
 * FocusMode Component
 * Immersive full-screen focus experience with ambient scene
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Maximize2, Volume2, VolumeX, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useScene } from '@/contexts/SceneContext';
import { SceneDisplay } from './SceneDisplay';
import { ClockWidget } from '@/components/widgets/ClockWidget';
import { FocusTimerWidget } from '@/components/widgets/FocusTimerWidget';
import { cn } from '@/lib/utils';

interface FocusModeProps {
  onClose?: () => void;
}

export function FocusMode({ onClose }: FocusModeProps) {
  const { activeScene, isFocusMode, toggleFocusMode } = useScene();
  const [showControls, setShowControls] = useState(true);
  const [showTimer, setShowTimer] = useState(true);
  const [isMuted, setIsMuted] = useState(true);

  // Auto-hide controls after inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      setShowControls(true);
      clearTimeout(timeout);
      timeout = setTimeout(() => setShowControls(false), 3000);
    };

    window.addEventListener('mousemove', resetTimeout);
    window.addEventListener('keydown', resetTimeout);

    resetTimeout();

    return () => {
      window.removeEventListener('mousemove', resetTimeout);
      window.removeEventListener('keydown', resetTimeout);
      clearTimeout(timeout);
    };
  }, []);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const handleClose = useCallback(() => {
    toggleFocusMode(false);
    onClose?.();
  }, [toggleFocusMode, onClose]);

  if (!isFocusMode) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 bg-background"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Scene Display */}
        <SceneDisplay />

        {/* Ambient Background */}
        <div className="absolute inset-0 pointer-events-none">
          {activeScene && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(ellipse at center, hsl(${activeScene.colorAccent} / 0.2), transparent 70%)`,
              }}
            />
          )}
        </div>

        {/* Center Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          {/* Clock */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="pointer-events-auto"
          >
            <ClockWidget size="large" style="minimal" showDate showSeconds={false} />
          </motion.div>

          {/* Focus Timer */}
          <AnimatePresence>
            {showTimer && (
              <motion.div
                className="mt-8 pointer-events-auto"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: 0.4 }}
              >
                <FocusTimerWidget size="large" />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Scene info */}
          {activeScene && (
            <motion.div
              className="absolute bottom-24 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: showControls ? 0.7 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-sm text-muted-foreground">{activeScene.name}</p>
              <p className="text-xs text-muted-foreground/60">{activeScene.description}</p>
            </motion.div>
          )}
        </div>

        {/* Controls Overlay */}
        <motion.div
          className="absolute inset-x-0 top-0 p-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{
            opacity: showControls ? 1 : 0,
            y: showControls ? 0 : -20,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between max-w-4xl mx-auto">
            {/* Left controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-card/50 backdrop-blur-sm hover:bg-card/70"
                onClick={() => setShowTimer(!showTimer)}
              >
                <Target className={cn('w-5 h-5', showTimer && 'text-primary')} />
              </Button>
            </div>

            {/* Title */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium text-foreground/80">Focus Mode</span>
            </div>

            {/* Right controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-10 w-10 bg-card/50 backdrop-blur-sm hover:bg-card/70"
                onClick={handleClose}
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Bottom hint */}
        <motion.div
          className="absolute inset-x-0 bottom-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showControls ? 0.5 : 0 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          <p className="text-xs text-muted-foreground">
            Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-[10px]">Esc</kbd> to exit
          </p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default FocusMode;
