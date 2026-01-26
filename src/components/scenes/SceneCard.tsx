/**
 * SceneCard Component
 * Displays an ambient scene image beautifully as a focal card element
 */

import { motion } from 'framer-motion';
import { Play, Pause, Check, Sparkles } from 'lucide-react';
import { AmbientScene, moodConfig } from '@/lib/scenes';
import { cn } from '@/lib/utils';

interface SceneCardProps {
  scene: AmbientScene;
  isActive?: boolean;
  onSelect?: () => void;
  size?: 'small' | 'medium' | 'large';
  showMoodBadge?: boolean;
  className?: string;
}

export function SceneCard({
  scene,
  isActive = false,
  onSelect,
  size = 'medium',
  showMoodBadge = true,
  className,
}: SceneCardProps) {
  const mood = moodConfig[scene.mood];

  const sizeClasses = {
    small: 'w-32 h-24',
    medium: 'w-48 h-36',
    large: 'w-64 h-48',
  };

  return (
    <motion.button
      className={cn(
        'group relative rounded-2xl overflow-hidden',
        'border-2 transition-all duration-300',
        isActive
          ? 'border-primary shadow-lg shadow-primary/25 ring-2 ring-primary/20'
          : 'border-border/50 hover:border-primary/50',
        sizeClasses[size],
        className
      )}
      onClick={onSelect}
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      {/* Image */}
      <img
        src={scene.image.thumbnailUrl || scene.image.url}
        alt={scene.name}
        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        loading="lazy"
      />

      {/* Overlay gradient */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent',
          'transition-opacity duration-300',
          isActive ? 'opacity-80' : 'opacity-60 group-hover:opacity-70'
        )}
      />

      {/* Ambient glow effect */}
      {scene.ambientGlow && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 100%, hsl(${scene.colorAccent} / 0.3), transparent 60%)`,
          }}
          animate={{
            opacity: isActive ? [0.5, 0.8, 0.5] : 0.3,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-end p-3">
        {/* Mood badge */}
        {showMoodBadge && (
          <div
            className={cn(
              'absolute top-2 right-2 px-2 py-0.5 rounded-full',
              'text-[10px] font-medium text-white/90',
              'bg-black/40 backdrop-blur-sm'
            )}
          >
            {mood.label}
          </div>
        )}

        {/* Title & description */}
        <div className="space-y-0.5">
          <h4 className="text-sm font-semibold text-white leading-tight">
            {scene.name}
          </h4>
          {size !== 'small' && (
            <p className="text-[10px] text-white/70 line-clamp-1">
              {scene.description}
            </p>
          )}
        </div>
      </div>

      {/* Active indicator */}
      {isActive && (
        <motion.div
          className="absolute top-2 left-2 w-6 h-6 rounded-full bg-primary flex items-center justify-center"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 25 }}
        >
          <Check className="w-3.5 h-3.5 text-primary-foreground" />
        </motion.div>
      )}

      {/* Custom scene indicator */}
      {scene.isCustom && (
        <div className="absolute top-2 left-2">
          <Sparkles className="w-3 h-3 text-yellow-400" />
        </div>
      )}
    </motion.button>
  );
}

export default SceneCard;
