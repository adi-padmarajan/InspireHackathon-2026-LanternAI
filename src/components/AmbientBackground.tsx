/**
 * AmbientBackground Component
 * Theme-aware ambient particles and effects
 * Renders the appropriate particle system based on current theme
 */

import { motion } from "framer-motion";
import { shouldReduceMotion } from "@/lib/animations";
import { useTheme } from "@/contexts/ThemeContext";
import {
  FirefliesBackground,
  BubblesBackground,
  StarsBackground,
  SnowBackground,
  LeavesBackground,
  SparksBackground,
  AuroraBackground,
  OrbsBackground,
  particleComponents,
} from "@/components/ambient/particles";
import { ThemeParticleConfig, AnimationIntensity } from "@/lib/themes";

// ============================================================================
// INTENSITY MULTIPLIER
// ============================================================================

const getIntensityMultiplier = (intensity: AnimationIntensity): number => {
  const multipliers: Record<AnimationIntensity, number> = {
    none: 0,
    subtle: 0.5,
    normal: 1,
    energetic: 1.5,
    cinematic: 2.0,
  };
  return multipliers[intensity] ?? 1;
};

// ============================================================================
// PROPS INTERFACE
// ============================================================================

interface AmbientBackgroundProps {
  className?: string;
}

// ============================================================================
// MAIN AMBIENT BACKGROUND COMPONENT
// ============================================================================

export const AmbientBackground = ({ className = "" }: AmbientBackgroundProps) => {
  const reduceMotion = shouldReduceMotion();
  const { currentTheme, settings } = useTheme();

  // Get theme configuration
  const themeConfig = currentTheme.particles;
  let intensity = getIntensityMultiplier(settings.animationIntensity);
  const backgroundStyle = settings.backgroundStyle;

  // Handle reduced motion
  if (reduceMotion || intensity === 0) {
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
        {/* Static gradient fallback */}
        <div
          className="absolute w-96 h-96 rounded-full blur-3xl opacity-5"
          style={{
            background: "radial-gradient(circle, hsl(var(--theme-orb-1)) 0%, transparent 70%)",
            top: "10%",
            left: "20%",
          }}
        />
        <div
          className="absolute w-80 h-80 rounded-full blur-3xl opacity-5"
          style={{
            background: "radial-gradient(circle, hsl(var(--theme-orb-2)) 0%, transparent 70%)",
            bottom: "20%",
            right: "15%",
          }}
        />
      </div>
    );
  }

  // Adjust based on background style setting
  let effectiveConfig = { ...themeConfig };

  if (backgroundStyle === 'minimal') {
    effectiveConfig = {
      ...themeConfig,
      count: Math.max(3, Math.floor(themeConfig.count / 3)),
      variant: 'orbs',
    };
    intensity *= 0.5;
  } else if (backgroundStyle === 'orbs') {
    effectiveConfig = {
      ...themeConfig,
      variant: 'orbs',
      count: Math.min(5, themeConfig.count),
    };
  } else if (backgroundStyle === 'dynamic') {
    intensity *= 1.2;
  }

  // Map new particle variants to existing components
  const variantFallbacks: Record<string, keyof typeof particleComponents> = {
    fireflies: 'fireflies',
    bubbles: 'bubbles',
    stars: 'stars',
    snow: 'snow',
    leaves: 'leaves',
    sparks: 'sparks',
    aurora: 'aurora',
    orbs: 'orbs',
    // New variants map to similar existing ones
    rain: 'snow',        // Rain falls like snow
    embers: 'sparks',    // Embers are like sparks
    crystals: 'stars',   // Crystals shimmer like stars
    glitch: 'sparks',    // Glitch effects use sparks
    nebula: 'orbs',      // Nebula uses orb effects
    lightning: 'sparks', // Lightning flashes like sparks
  };

  const mappedVariant = variantFallbacks[effectiveConfig.variant] || 'orbs';
  const ParticleComponent = particleComponents[mappedVariant];

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 ${className}`}>
      <ParticleComponent config={effectiveConfig} intensity={intensity} />
    </div>
  );
};

// ============================================================================
// GLOW ORB COMPONENT (Theme-aware)
// ============================================================================

interface GlowOrbProps {
  color?: "warm" | "primary" | "accent" | "theme";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GlowOrb = ({
  color = "theme",
  size = "md",
  className = "",
}: GlowOrbProps) => {
  const reduceMotion = shouldReduceMotion();

  // Theme-aware colors using CSS variables
  const colorMap = {
    warm: "hsl(var(--theme-glow))",
    primary: "hsl(var(--primary))",
    accent: "hsl(var(--theme-orb-2))",
    theme: "hsl(var(--theme-orb-1))",
  };

  const sizeMap = {
    sm: "w-32 h-32",
    md: "w-64 h-64",
    lg: "w-96 h-96",
  };

  return (
    <motion.div
      className={`absolute rounded-full blur-3xl pointer-events-none ${sizeMap[size]} ${className}`}
      style={{
        background: `radial-gradient(circle, ${colorMap[color]} 0%, transparent 70%)`,
        opacity: 0.15,
      }}
      animate={
        reduceMotion
          ? {}
          : {
              scale: [1, 1.1, 1],
              opacity: [0.1, 0.2, 0.1],
            }
      }
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// ============================================================================
// WARM GLOW COMPONENT (Theme-aware)
// ============================================================================

interface WarmGlowProps {
  intensity?: "subtle" | "medium" | "strong";
  className?: string;
}

export const WarmGlow = ({
  intensity = "medium",
  className = "",
}: WarmGlowProps) => {
  const reduceMotion = shouldReduceMotion();

  const opacityMap = {
    subtle: 0.1,
    medium: 0.2,
    strong: 0.35,
  };

  return (
    <motion.div
      className={`absolute inset-0 rounded-full blur-3xl pointer-events-none ${className}`}
      style={{
        background: "radial-gradient(circle, hsl(var(--theme-glow)) 0%, transparent 60%)",
      }}
      animate={
        reduceMotion
          ? { opacity: opacityMap[intensity] }
          : {
              opacity: [
                opacityMap[intensity] * 0.7,
                opacityMap[intensity],
                opacityMap[intensity] * 0.7,
              ],
              scale: [1, 1.05, 1],
            }
      }
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

// ============================================================================
// THEME TRANSITION OVERLAY
// ============================================================================

interface ThemeTransitionOverlayProps {
  className?: string;
}

export const ThemeTransitionOverlay = ({ className = "" }: ThemeTransitionOverlayProps) => {
  const { isTransitioning, currentTheme } = useTheme();

  if (!isTransitioning) return null;

  return (
    <motion.div
      className={`fixed inset-0 z-[100] pointer-events-none theme-transition-overlay ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Radial wipe effect */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: currentTheme.preview.gradient,
        }}
        initial={{
          clipPath: 'circle(0% at 50% 50%)',
          opacity: 0.8
        }}
        animate={{
          clipPath: 'circle(150% at 50% 50%)',
          opacity: 0
        }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      />

      {/* Center glow burst */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(var(--theme-glow)) 0%, transparent 70%)`,
        }}
        initial={{ scale: 0, opacity: 0.8 }}
        animate={{ scale: 3, opacity: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />

      {/* Particle burst */}
      {Array.from({ length: 20 }).map((_, i) => {
        const angle = (i / 20) * 360;
        const distance = 200 + Math.random() * 100;
        return (
          <motion.div
            key={i}
            className="absolute top-1/2 left-1/2 rounded-full"
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              background: `hsl(var(--theme-particle))`,
              boxShadow: `0 0 8px hsl(var(--theme-glow))`,
            }}
            initial={{ x: 0, y: 0, opacity: 1 }}
            animate={{
              x: Math.cos(angle * (Math.PI / 180)) * distance,
              y: Math.sin(angle * (Math.PI / 180)) * distance,
              opacity: 0,
              scale: 0,
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        );
      })}

      {/* Theme name flash */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], scale: [0.8, 1, 1, 1.1] }}
        transition={{ duration: 0.8, times: [0, 0.3, 0.7, 1] }}
      >
        <span className="text-4xl font-serif font-bold text-white drop-shadow-2xl">
          {currentTheme.name}
        </span>
      </motion.div>
    </motion.div>
  );
};
