/**
 * ThemePreviewCard Component
 * Interactive theme preview with live mini-particle animation
 * The star component of the Settings page
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Check } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { Theme } from '@/lib/themes';
import { cn } from '@/lib/utils';

interface ThemePreviewCardProps {
  theme: Theme;
  isActive: boolean;
  onSelect: () => void;
  index: number;
}

// Dynamic icon component
const ThemeIcon = ({ name, className }: { name: string; className?: string }) => {
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

// Mini particle preview for theme cards
const MiniParticlePreview = ({
  theme,
  isActive,
}: {
  theme: Theme;
  isActive: boolean;
}) => {
  const particles = useMemo(() => {
    const count = Math.min(theme.particles.count, 8);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: ((i * 17) % 100),
      y: ((i * 23) % 100),
      size: theme.particles.size === 'small' ? 2 : theme.particles.size === 'medium' ? 4 : 6,
      delay: (i % 5) * 0.3,
    }));
  }, [theme.particles]);

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: theme.particles.baseColor,
            boxShadow: `0 0 ${particle.size * 2}px ${theme.particles.baseColor}`,
          }}
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: theme.particles.speed === 'slow' ? 3 : theme.particles.speed === 'medium' ? 2 : 1,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

export const ThemePreviewCard = ({
  theme,
  isActive,
  onSelect,
  index,
}: ThemePreviewCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  // Card animation variants
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -15,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        delay: index * 0.08,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      rotateY: 2,
      rotateX: -2,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group perspective-1000",
        "border-2 transition-colors duration-300",
        isActive
          ? "border-primary ring-2 ring-primary/20"
          : "border-border hover:border-primary/50"
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Live Mini Preview Area */}
      <div
        className="h-32 relative overflow-hidden"
        style={{ background: theme.preview.gradient }}
      >
        {/* Mini Particle System */}
        <MiniParticlePreview theme={theme} isActive={isHovered || isActive} />

        {/* Glow Effect on hover */}
        <motion.div
          className="absolute inset-0"
          animate={isHovered ? {
            boxShadow: `inset 0 0 60px ${theme.particles.baseColor}40`
          } : {
            boxShadow: 'inset 0 0 0px transparent'
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Theme Icon */}
        <motion.div
          className="absolute top-3 right-3 p-2 rounded-full bg-white/20 backdrop-blur-sm"
          animate={isHovered ? { scale: 1.1, rotate: 10 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <ThemeIcon name={theme.icon} className="h-5 w-5 text-white drop-shadow-md" />
        </motion.div>

        {/* Active Indicator */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute top-3 left-3"
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <div className="p-1.5 rounded-full bg-white shadow-lg">
                <Check className="h-4 w-4 text-primary" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%' }}
          animate={isHovered ? { x: '100%' } : { x: '-100%' }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        />
      </div>

      {/* Theme Info */}
      <div className="p-4 bg-card">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">{theme.name}</h3>
          {isActive && (
            <span className="text-xs text-primary font-medium">Active</span>
          )}
        </div>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {theme.description}
        </p>

        {/* Color Palette Preview */}
        <div className="flex gap-1.5">
          {theme.preview.accentColors.map((color, i) => (
            <motion.div
              key={i}
              className="h-4 flex-1 rounded-full shadow-sm"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.15, y: -3 }}
              transition={{ delay: i * 0.05, type: "spring", stiffness: 400 }}
            />
          ))}
        </div>
      </div>

      {/* Hover overlay gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
  );
};

export default ThemePreviewCard;
