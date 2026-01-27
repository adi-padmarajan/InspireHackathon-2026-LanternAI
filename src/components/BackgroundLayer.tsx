/**
 * BackgroundLayer Component - Award-Winning Visual Experience
 * Renders cinematic backgrounds with gradients, mesh, patterns, dynamic effects, and images
 */

import { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/contexts/ThemeContext';
import { getOverlayGradient } from '@/lib/imageSettings';
import {
  Wallpaper,
  GradientWallpaper,
  MeshGradientWallpaper,
  PatternWallpaper,
  DynamicWallpaper,
  getGradientCSS,
  getMeshGradientCSS,
} from '@/lib/wallpapers';

// ============================================================================
// GRADIENT BACKGROUND
// ============================================================================

const GradientBackground = ({ wallpaper }: { wallpaper: GradientWallpaper }) => {
  const gradient = getGradientCSS(wallpaper);

  return (
    <motion.div
      className="absolute inset-0"
      style={{ background: gradient }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    />
  );
};

// ============================================================================
// MESH GRADIENT BACKGROUND - Ultra-modern look
// ============================================================================

const MeshGradientBackground = ({ wallpaper }: { wallpaper: MeshGradientWallpaper }) => {
  const [c1, c2, c3, c4] = wallpaper.colors;

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Base layer */}
      <div
        className="absolute inset-0"
        style={{ backgroundColor: c1 }}
      />

      {/* Animated mesh blobs */}
      <motion.div
        className="absolute w-[80%] h-[80%] rounded-full blur-3xl opacity-70"
        style={{ backgroundColor: c1, top: '-20%', left: '-10%' }}
        animate={{
          x: [0, 50, 0],
          y: [0, 30, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[70%] h-[70%] rounded-full blur-3xl opacity-60"
        style={{ backgroundColor: c2, top: '10%', right: '-20%' }}
        animate={{
          x: [0, -40, 0],
          y: [0, 50, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[60%] h-[60%] rounded-full blur-3xl opacity-50"
        style={{ backgroundColor: c3, bottom: '-10%', left: '20%' }}
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{ duration: 30, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-[50%] h-[50%] rounded-full blur-3xl opacity-40"
        style={{ backgroundColor: c4, bottom: '20%', right: '10%' }}
        animate={{
          x: [0, -30, 0],
          y: [0, -60, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
};

// ============================================================================
// PATTERN BACKGROUND
// ============================================================================

const PatternBackground = ({ wallpaper }: { wallpaper: PatternWallpaper }) => {
  const getPatternStyle = () => {
    switch (wallpaper.pattern) {
      case 'dots':
        return {
          backgroundColor: wallpaper.baseColor,
          backgroundImage: `radial-gradient(${wallpaper.patternColor} 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        };
      case 'grid':
        return {
          backgroundColor: wallpaper.baseColor,
          backgroundImage: `
            linear-gradient(${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px),
            linear-gradient(90deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255).toString(16).padStart(2, '0')} 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        };
      case 'waves':
        return {
          backgroundColor: wallpaper.baseColor,
          backgroundImage: `
            repeating-linear-gradient(
              45deg,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.3).toString(16).padStart(2, '0')} 0px,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.3).toString(16).padStart(2, '0')} 2px,
              transparent 2px,
              transparent 10px
            )
          `,
        };
      case 'geometric':
        return {
          backgroundColor: wallpaper.baseColor,
          backgroundImage: `
            linear-gradient(30deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 12%, transparent 12.5%, transparent 87%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 87.5%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')}),
            linear-gradient(150deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 12%, transparent 12.5%, transparent 87%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 87.5%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')}),
            linear-gradient(30deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 12%, transparent 12.5%, transparent 87%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 87.5%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')}),
            linear-gradient(150deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 12%, transparent 12.5%, transparent 87%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')} 87.5%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.5).toString(16).padStart(2, '0')}),
            linear-gradient(60deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')} 25%, transparent 25.5%, transparent 75%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')} 75%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')}),
            linear-gradient(60deg, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')} 25%, transparent 25.5%, transparent 75%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')} 75%, ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.35).toString(16).padStart(2, '0')})
          `,
          backgroundSize: '80px 140px',
          backgroundPosition: '0 0, 0 0, 40px 70px, 40px 70px, 0 0, 40px 70px',
        };
      case 'topography':
        return {
          backgroundColor: wallpaper.baseColor,
          backgroundImage: `
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 50px,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.2).toString(16).padStart(2, '0')} 50px,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.2).toString(16).padStart(2, '0')} 51px
            ),
            repeating-linear-gradient(
              90deg,
              transparent,
              transparent 50px,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.1).toString(16).padStart(2, '0')} 50px,
              ${wallpaper.patternColor}${Math.round(wallpaper.opacity * 255 * 0.1).toString(16).padStart(2, '0')} 51px
            )
          `,
        };
      case 'noise':
      case 'grain':
      default:
        return {
          backgroundColor: wallpaper.baseColor,
        };
    }
  };

  return (
    <motion.div
      className="absolute inset-0"
      style={getPatternStyle()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      {/* Grain overlay for noise/grain patterns */}
      {(wallpaper.pattern === 'noise' || wallpaper.pattern === 'grain') && (
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      )}
    </motion.div>
  );
};

// ============================================================================
// DYNAMIC ANIMATED BACKGROUND
// ============================================================================

const DynamicBackground = ({ wallpaper }: { wallpaper: DynamicWallpaper }) => {
  const speedMultiplier = wallpaper.speed === 'slow' ? 1 : wallpaper.speed === 'medium' ? 0.7 : 0.4;

  switch (wallpaper.style) {
    case 'aurora':
      return <AuroraAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
    case 'waves':
      return <WavesAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
    case 'morph':
      return <MorphAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
    case 'glow':
      return <GlowAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
    case 'particles':
      return <ParticlesAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
    default:
      return <GlowAnimation colors={wallpaper.colors} speed={speedMultiplier} />;
  }
};

// Aurora Animation
const AuroraAnimation = ({ colors, speed }: { colors: string[]; speed: number }) => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900" />
    {colors.map((color, i) => (
      <motion.div
        key={i}
        className="absolute w-full h-[60%] blur-3xl opacity-50"
        style={{
          background: `linear-gradient(180deg, transparent, ${color}, transparent)`,
          top: '20%',
        }}
        animate={{
          x: ['-20%', '20%', '-20%'],
          scaleY: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 15 * speed,
          repeat: Infinity,
          delay: i * 2,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

// Waves Animation
const WavesAnimation = ({ colors, speed }: { colors: string[]; speed: number }) => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div className="absolute inset-0" style={{ backgroundColor: colors[0] }} />
    {colors.slice(1).map((color, i) => (
      <motion.div
        key={i}
        className="absolute w-[200%] h-full"
        style={{
          background: `linear-gradient(180deg, transparent 40%, ${color}80 60%, transparent 80%)`,
          left: '-50%',
        }}
        animate={{
          x: ['-25%', '0%', '-25%'],
          y: [0, 20, 0],
        }}
        transition={{
          duration: (12 + i * 4) * speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

// Morph Animation
const MorphAnimation = ({ colors, speed }: { colors: string[]; speed: number }) => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {colors.map((color, i) => (
      <motion.div
        key={i}
        className="absolute rounded-full blur-3xl mix-blend-screen"
        style={{
          width: `${60 + i * 10}%`,
          height: `${60 + i * 10}%`,
          backgroundColor: color,
          opacity: 0.6 - i * 0.1,
        }}
        animate={{
          x: ['0%', '30%', '-20%', '0%'],
          y: ['0%', '-20%', '30%', '0%'],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{
          duration: (20 + i * 5) * speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    ))}
  </motion.div>
);

// Glow Animation
const GlowAnimation = ({ colors, speed }: { colors: string[]; speed: number }) => (
  <motion.div
    className="absolute inset-0 overflow-hidden"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    <div
      className="absolute inset-0"
      style={{
        background: `radial-gradient(ellipse at center, ${colors[0]}40, transparent 70%)`,
      }}
    />
    <motion.div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full blur-3xl"
      style={{
        background: `radial-gradient(ellipse at center, ${colors[0]}, transparent)`,
      }}
      animate={{
        scale: [1, 1.2, 1],
        opacity: [0.4, 0.7, 0.4],
      }}
      transition={{
        duration: 8 * speed,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
    />
    {colors.length > 1 && (
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] rounded-full blur-3xl"
        style={{
          background: `radial-gradient(ellipse at center, ${colors[1]}, transparent)`,
        }}
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 10 * speed,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    )}
  </motion.div>
);

// Particles Animation
const ParticlesAnimation = ({ colors, speed }: { colors: string[]; speed: number }) => {
  const particles = useMemo(() =>
    Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: (15 + Math.random() * 20) * speed,
      delay: Math.random() * 5,
      color: colors[Math.floor(Math.random() * colors.length)],
    })),
    [colors, speed]
  );

  return (
    <motion.div
      className="absolute inset-0 overflow-hidden bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            left: `${p.x}%`,
            top: `${p.y}%`,
            boxShadow: `0 0 ${p.size * 2}px ${p.color}`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, -15, 0],
            opacity: [0.3, 0.8, 0.3],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </motion.div>
  );
};

// ============================================================================
// IMAGE BACKGROUND
// ============================================================================

const ImageBackground = ({
  url,
  position,
  blur,
  brightness,
  saturation,
}: {
  url: string;
  position: { x: number; y: number };
  blur: number;
  brightness: number;
  saturation: number;
}) => (
  <motion.img
    src={url}
    alt=""
    className="absolute inset-0 w-full h-full object-cover"
    style={{
      objectPosition: `${position.x}% ${position.y}%`,
      filter: `blur(${blur}px) brightness(${brightness}%) saturate(${saturation}%)`,
    }}
    initial={{ scale: 1.1, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    exit={{ scale: 1.05, opacity: 0 }}
    transition={{ duration: 1, ease: 'easeOut' }}
  />
);

// ============================================================================
// SOLID COLOR BACKGROUND
// ============================================================================

const SolidBackground = ({ color }: { color: string }) => (
  <motion.div
    className="absolute inset-0"
    style={{ backgroundColor: color }}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  />
);

// ============================================================================
// MAIN BACKGROUND LAYER COMPONENT
// ============================================================================

export function BackgroundLayer() {
  const { currentBackground, isDark } = useTheme();

  const hasBackground = currentBackground?.enabled;
  const wallpaper = (currentBackground as any)?.wallpaper as Wallpaper | null;
  const image = currentBackground?.image;

  const renderBackground = () => {
    // If there's a wallpaper (gradient, mesh, pattern, dynamic, solid)
    if (wallpaper) {
      switch (wallpaper.type) {
        case 'gradient':
          return <GradientBackground wallpaper={wallpaper} />;
        case 'mesh':
          return <MeshGradientBackground wallpaper={wallpaper} />;
        case 'pattern':
          return <PatternBackground wallpaper={wallpaper} />;
        case 'dynamic':
          return <DynamicBackground wallpaper={wallpaper} />;
        case 'solid':
          return <SolidBackground color={wallpaper.color} />;
        default:
          return null;
      }
    }

    // If there's an image
    if (image?.url) {
      return (
        <ImageBackground
          url={image.url}
          position={currentBackground?.position || { x: 50, y: 50 }}
          blur={currentBackground?.blur || 0}
          brightness={currentBackground?.brightness || 100}
          saturation={currentBackground?.saturation || 100}
        />
      );
    }

    return null;
  };

  return (
    <AnimatePresence>
      {hasBackground && (
        <motion.div
          className="fixed inset-0 z-0 pointer-events-none overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Background content */}
          {renderBackground()}

          {/* Gradient overlay */}
          {currentBackground && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: getOverlayGradient(
                  currentBackground.overlayColor || 'theme',
                  currentBackground.overlayOpacity || 0,
                  currentBackground.customOverlayColor,
                  isDark
                ),
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            />
          )}

          {/* Subtle vignette for depth */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.15) 100%)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default BackgroundLayer;
