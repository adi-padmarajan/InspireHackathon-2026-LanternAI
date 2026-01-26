// Particle System Components for Theme Customization
// Each variant creates unique ambient effects matching their theme

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { ThemeParticleConfig } from '@/lib/themes';

interface ParticleBackgroundProps {
  config: ThemeParticleConfig;
  intensity: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

const generateParticles = (count: number, seed: number = 0) => {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: ((i * 17 + seed) % 100),
    y: ((i * 23 + seed) % 100),
    size: 2 + (i % 5),
    delay: (i % 10) * 0.3,
    duration: 8 + (i % 7),
    drift: ((i % 3) - 1) * 30,
    maxOpacity: 0.3 + (i % 5) * 0.1,
  }));
};

// ============================================================================
// FIREFLIES - Warm, floating glowing particles
// ============================================================================

export const FirefliesBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity)), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-firefly"
          style={{
            width: particle.size * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            height: particle.size * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -150 * intensity, 0],
            x: [0, particle.drift * intensity, 0],
            opacity: [0, particle.maxOpacity * intensity, 0],
            scale: [0.5, 1.2, 0.5],
          }}
          transition={{
            duration: particle.duration / (config.speed === 'fast' ? 0.5 : config.speed === 'slow' ? 1.5 : 1),
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// BUBBLES - Rising, translucent spheres for Ocean theme
// ============================================================================

export const BubblesBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity)), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-bubble"
          style={{
            width: (particle.size + 4) * (config.size === 'small' ? 1 : config.size === 'medium' ? 2 : 3),
            height: (particle.size + 4) * (config.size === 'small' ? 1 : config.size === 'medium' ? 2 : 3),
            left: `${particle.x}%`,
            bottom: '-5%',
          }}
          animate={{
            y: [0, -window.innerHeight * 1.2],
            x: [0, particle.drift * 0.5, 0, -particle.drift * 0.3, 0],
            scale: [0.8, 1, 1.1, 1, 0.9],
            opacity: [0, 0.6 * intensity, 0.5 * intensity, 0.4 * intensity, 0],
          }}
          transition={{
            duration: particle.duration * 2 / (config.speed === 'fast' ? 0.5 : config.speed === 'slow' ? 1.5 : 1),
            repeat: Infinity,
            delay: particle.delay * 2,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// STARS - Twinkling points for Cosmic theme
// ============================================================================

export const StarsBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity), 42), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-star"
          style={{
            width: particle.size * (config.size === 'small' ? 0.5 : config.size === 'medium' ? 1 : 1.5),
            height: particle.size * (config.size === 'small' ? 0.5 : config.size === 'medium' ? 1 : 1.5),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            opacity: [0.2, 1 * intensity, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: 2 + (particle.id % 3),
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
      {/* Shooting stars occasionally */}
      {intensity > 0.5 && (
        <motion.div
          className="particle particle-star"
          style={{
            width: 3,
            height: 3,
            left: '10%',
            top: '20%',
          }}
          animate={{
            x: [0, 200],
            y: [0, 150],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatDelay: 8,
            ease: "easeOut",
          }}
        />
      )}
    </div>
  );
};

// ============================================================================
// SNOW - Gentle falling snowflakes for Hockey theme
// ============================================================================

export const SnowBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity)), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-snow"
          style={{
            width: (particle.size + 1) * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            height: (particle.size + 1) * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            left: `${particle.x}%`,
            top: '-5%',
          }}
          animate={{
            y: [0, window.innerHeight * 1.2],
            x: [0, particle.drift * 0.3, 0, -particle.drift * 0.2, 0],
            rotate: [0, 360],
            opacity: [0, 0.8 * intensity, 0.7 * intensity, 0],
          }}
          transition={{
            duration: particle.duration * 1.5 / (config.speed === 'fast' ? 0.5 : config.speed === 'slow' ? 1.5 : 1),
            repeat: Infinity,
            delay: particle.delay * 1.5,
            ease: "linear",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// LEAVES - Floating leaves/petals for Forest & Cherry Blossom themes
// ============================================================================

export const LeavesBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity)), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-leaf"
          style={{
            width: (particle.size + 3) * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            height: (particle.size + 2) * (config.size === 'small' ? 1 : config.size === 'medium' ? 1.5 : 2),
            left: `${particle.x}%`,
            top: '-5%',
          }}
          animate={{
            y: [0, window.innerHeight * 1.1],
            x: [0, particle.drift, -particle.drift * 0.5, particle.drift * 0.3, 0],
            rotate: [0, 180, 360, 540, 720],
            opacity: [0, 0.7 * intensity, 0.6 * intensity, 0.5 * intensity, 0],
          }}
          transition={{
            duration: particle.duration * 2 / (config.speed === 'fast' ? 0.5 : config.speed === 'slow' ? 1.5 : 1),
            repeat: Infinity,
            delay: particle.delay * 2,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// SPARKS - Energetic particles for Sports & Cyberpunk themes
// ============================================================================

export const SparksBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  const particles = useMemo(() =>
    generateParticles(Math.round(config.count * intensity)), [config.count, intensity]
  );

  if (intensity === 0) return null;

  return (
    <div className="particle-container">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="particle particle-spark"
          style={{
            width: particle.size * (config.size === 'small' ? 0.5 : config.size === 'medium' ? 1 : 1.5),
            height: particle.size * (config.size === 'small' ? 0.5 : config.size === 'medium' ? 1 : 1.5),
            left: `${particle.x}%`,
            top: `${particle.y}%`,
          }}
          animate={{
            y: [0, -80 * intensity, -30 * intensity, -100 * intensity],
            x: [0, particle.drift * 2, -particle.drift, particle.drift * 0.5],
            opacity: [0, 1 * intensity, 0.8 * intensity, 0],
            scale: [0, 1.5, 1, 0],
          }}
          transition={{
            duration: particle.duration * 0.4 / (config.speed === 'fast' ? 0.5 : config.speed === 'slow' ? 1.5 : 1),
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// AURORA - Flowing northern lights for Aurora theme
// ============================================================================

export const AuroraBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  if (intensity === 0) return null;

  return (
    <div className="particle-container overflow-hidden">
      {/* Multiple aurora waves with different timings */}
      {Array.from({ length: config.count }).map((_, i) => (
        <motion.div
          key={i}
          className="aurora-wave"
          style={{
            left: `${-50 + (i * 30)}%`,
            top: `${-20 + (i * 15)}%`,
            opacity: 0.3 * intensity,
          }}
          animate={{
            x: ['-25%', '0%', '-25%'],
            y: ['0%', '-10%', '0%'],
            rotate: [-5 + i * 2, 5 - i * 2, -5 + i * 2],
          }}
          transition={{
            duration: 15 + i * 3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
      {/* Subtle star points */}
      {intensity > 0.5 && Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={`star-${i}`}
          className="particle particle-star"
          style={{
            width: 2,
            height: 2,
            left: `${(i * 5) % 100}%`,
            top: `${(i * 7) % 100}%`,
          }}
          animate={{
            opacity: [0.1, 0.5 * intensity, 0.1],
          }}
          transition={{
            duration: 3 + (i % 3),
            repeat: Infinity,
            delay: i * 0.2,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// ORBS - Large floating gradient orbs (original style, enhanced)
// ============================================================================

export const OrbsBackground = ({ config, intensity }: ParticleBackgroundProps) => {
  if (intensity === 0) return null;

  const orbCount = Math.min(config.count, 5);

  return (
    <div className="particle-container">
      {Array.from({ length: orbCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full blur-3xl"
          style={{
            width: config.size === 'small' ? 150 : config.size === 'medium' ? 250 : 350,
            height: config.size === 'small' ? 150 : config.size === 'medium' ? 250 : 350,
            left: `${20 + (i * 25) % 60}%`,
            top: `${15 + (i * 30) % 50}%`,
            background: `radial-gradient(circle, hsl(var(--theme-orb-${(i % 2) + 1}) / ${0.15 * intensity}) 0%, transparent 70%)`,
          }}
          animate={{
            scale: [1, 1.1 + (i * 0.05), 1],
            x: [0, 30 * ((i % 2) === 0 ? 1 : -1), 0],
            y: [0, 20 * ((i % 2) === 0 ? -1 : 1), 0],
            opacity: [0.5 * intensity, 0.7 * intensity, 0.5 * intensity],
          }}
          transition={{
            duration: 15 + i * 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 2,
          }}
        />
      ))}
    </div>
  );
};

// ============================================================================
// EXPORT MAP
// ============================================================================

export const particleComponents = {
  fireflies: FirefliesBackground,
  bubbles: BubblesBackground,
  stars: StarsBackground,
  snow: SnowBackground,
  leaves: LeavesBackground,
  sparks: SparksBackground,
  aurora: AuroraBackground,
  orbs: OrbsBackground,
};

export type ParticleVariant = keyof typeof particleComponents;
