/**
 * ThemePreviewCard Component
 * Award-winning theme preview with cinematic visuals
 * Interactive, immersive theme selection experience
 */

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import { Check, Quote } from 'lucide-react';
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
  const IconComponent = (LucideIcons as Record<string, React.ComponentType<{ className?: string }>>)[name] || LucideIcons.Sparkles;
  return <IconComponent className={className} />;
};

// Enhanced particle preview for theme cards
const MiniParticlePreview = ({
  theme,
  isActive,
}: {
  theme: Theme;
  isActive: boolean;
}) => {
  const particles = useMemo(() => {
    const count = Math.min(theme.particles.count, 12);
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      x: ((i * 17 + 5) % 90) + 5,
      y: ((i * 23 + 10) % 80) + 10,
      size: theme.particles.size === 'small' ? 3 : theme.particles.size === 'medium' ? 5 : 8,
      delay: (i % 6) * 0.2,
      color: i % 3 === 0 && theme.particles.secondaryColor
        ? theme.particles.secondaryColor
        : theme.particles.baseColor,
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
            backgroundColor: particle.color,
            boxShadow: `0 0 ${particle.size * 3}px ${particle.color}, 0 0 ${particle.size * 6}px ${particle.color}40`,
          }}
          animate={{
            y: [0, -25, 0],
            x: [0, particle.id % 2 === 0 ? 5 : -5, 0],
            opacity: [0.4, 1, 0.4],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: theme.particles.speed === 'slow' ? 4 : theme.particles.speed === 'medium' ? 2.5 : 1.5,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// Ambient glow effect
const AmbientGlow = ({ theme, isHovered }: { theme: Theme; isHovered: boolean }) => {
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: isHovered ? 1 : 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Corner glows */}
      <div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: `${theme.particles.baseColor}30` }}
      />
      <div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-3xl"
        style={{ backgroundColor: theme.particles.secondaryColor ? `${theme.particles.secondaryColor}30` : `${theme.particles.baseColor}20` }}
      />
    </motion.div>
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
      y: 40,
      rotateX: -10,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 80,
        damping: 15,
        delay: index * 0.06,
      },
    },
    hover: {
      y: -10,
      scale: 1.03,
      rotateY: 3,
      rotateX: -3,
      transition: {
        type: "spring" as const,
        stiffness: 400,
        damping: 25,
      },
    },
    tap: {
      scale: 0.97,
    },
  };

  return (
    <motion.div
      className={cn(
        "relative rounded-2xl overflow-hidden cursor-pointer group",
        "border-2 transition-all duration-300",
        isActive
          ? "border-primary ring-4 ring-primary/20"
          : "border-border/50 hover:border-primary/60"
      )}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onSelect}
      style={{
        transformStyle: 'preserve-3d',
        perspective: '1000px',
      }}
    >
      {/* Ambient glow effect */}
      <AmbientGlow theme={theme} isHovered={isHovered} />

      {/* Live Mini Preview Area - Taller for more impact */}
      <div
        className="h-36 relative overflow-hidden"
        style={{ background: theme.preview.gradient }}
      >
        {/* Animated gradient overlay */}
        <motion.div
          className="absolute inset-0"
          animate={isHovered ? {
            background: [
              `linear-gradient(0deg, ${theme.particles.baseColor}10 0%, transparent 100%)`,
              `linear-gradient(180deg, ${theme.particles.baseColor}10 0%, transparent 100%)`,
              `linear-gradient(0deg, ${theme.particles.baseColor}10 0%, transparent 100%)`,
            ],
          } : {}}
          transition={{ duration: 3, repeat: Infinity }}
        />

        {/* Mini Particle System */}
        <MiniParticlePreview theme={theme} isActive={isHovered || isActive} />

        {/* Cinematic vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Theme Icon - Larger and more prominent */}
        <motion.div
          className="absolute top-4 right-4 p-2.5 rounded-xl bg-white/20 backdrop-blur-md border border-white/20"
          animate={isHovered ? { scale: 1.15, rotate: 8 } : { scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
        >
          <ThemeIcon name={theme.icon} className="h-5 w-5 text-white drop-shadow-lg" />
        </motion.div>

        {/* Active Indicator with glow */}
        <AnimatePresence>
          {isActive && (
            <motion.div
              className="absolute top-4 left-4"
              initial={{ scale: 0, rotate: -180, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0, rotate: 180, opacity: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
            >
              <div
                className="p-2 rounded-full bg-white shadow-xl"
                style={{
                  boxShadow: `0 0 20px ${theme.particles.baseColor}80, 0 4px 12px rgba(0,0,0,0.2)`,
                }}
              >
                <Check className="h-4 w-4 text-primary" strokeWidth={3} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tagline at bottom of preview */}
        <motion.div
          className="absolute bottom-3 left-0 right-0 flex justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/40 backdrop-blur-sm">
            <Quote className="h-3 w-3 text-white/70" />
            <span className="text-xs text-white/90 font-medium italic">
              {theme.tagline}
            </span>
          </div>
        </motion.div>

        {/* Cinematic shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
          animate={isHovered ? { x: ['0%', '200%'] } : { x: '-100%' }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>

      {/* Theme Info - Enhanced with better typography */}
      <div className="p-4 bg-card relative">
        {/* Subtle top border glow when active */}
        {isActive && (
          <div
            className="absolute top-0 left-0 right-0 h-px"
            style={{
              background: `linear-gradient(90deg, transparent, ${theme.particles.baseColor}, transparent)`,
            }}
          />
        )}

        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <h3 className="font-bold text-foreground text-base leading-tight">{theme.name}</h3>
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground/70 font-medium">
              {theme.category}
            </span>
          </div>
          {isActive && (
            <motion.span
              className="text-xs text-primary font-semibold px-2 py-0.5 rounded-full bg-primary/10"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              Active
            </motion.span>
          )}
        </div>

        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {theme.description}
        </p>

        {/* Enhanced Color Palette Preview */}
        <div className="flex gap-1.5">
          {theme.preview.accentColors.map((color, i) => (
            <motion.div
              key={i}
              className="h-5 flex-1 rounded-lg shadow-sm relative overflow-hidden"
              style={{ backgroundColor: color }}
              whileHover={{ scale: 1.1, y: -4 }}
              transition={{ delay: i * 0.03, type: "spring", stiffness: 500 }}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/30 to-transparent opacity-60" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Hover border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered
            ? `0 0 30px ${theme.particles.baseColor}40, inset 0 0 0 1px ${theme.particles.baseColor}30`
            : 'none',
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};

export default ThemePreviewCard;
