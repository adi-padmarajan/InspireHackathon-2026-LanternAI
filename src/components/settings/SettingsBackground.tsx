/**
 * SettingsBackground Component
 * Nature-themed animated background for the Settings page
 */

import { motion } from 'framer-motion';
import { useMemo } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

// Floating leaf particle
const FloatingLeaf = ({ 
  delay, 
  duration, 
  startX, 
  size 
}: { 
  delay: number; 
  duration: number; 
  startX: number; 
  size: number;
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        left: `${startX}%`,
        bottom: '-20px',
        width: size,
        height: size,
      }}
      initial={{ y: 0, opacity: 0, rotate: 0 }}
      animate={{
        y: [0, -800],
        opacity: [0, 0.6, 0.6, 0],
        rotate: [0, 360],
        x: [0, Math.sin(startX) * 50, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-full h-full"
        style={{ color: currentTheme.particles.baseColor }}
      >
        <path
          d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c1.5 0 3-.3 4.3-.9-1.5-2.1-2.3-4.6-2.3-7.1 0-5 2.9-9.3 7-11.4C19 2.2 15.6 2 12 2z"
          fill="currentColor"
          opacity={0.3}
        />
      </svg>
    </motion.div>
  );
};

// Glowing orb
const GlowingOrb = ({ 
  x, 
  y, 
  size, 
  delay 
}: { 
  x: number; 
  y: number; 
  size: number; 
  delay: number;
}) => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, ${currentTheme.particles.baseColor}40, transparent 70%)`,
      }}
      animate={{
        scale: [1, 1.3, 1],
        opacity: [0.3, 0.6, 0.3],
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut" as const,
      }}
    />
  );
};

// Subtle wave pattern
const WavePattern = () => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      className="absolute inset-0 overflow-hidden pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <svg
        className="absolute bottom-0 w-full h-48"
        viewBox="0 0 1440 320"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={`${currentTheme.particles.baseColor}10`}
          animate={{
            d: [
              "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,192L48,181.3C96,171,192,149,288,160C384,171,480,213,576,218.7C672,224,768,192,864,176C960,160,1056,160,1152,170.7C1248,181,1344,203,1392,213.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,160L48,170.7C96,181,192,203,288,192C384,181,480,139,576,138.7C672,139,768,181,864,186.7C960,192,1056,160,1152,149.3C1248,139,1344,149,1392,154.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut" as const,
          }}
        />
        <motion.path
          d="M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,186.7C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill={`${currentTheme.particles.baseColor}05`}
          animate={{
            d: [
              "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,186.7C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,256L48,245.3C96,235,192,213,288,197.3C384,181,480,171,576,181.3C672,192,768,224,864,234.7C960,245,1056,235,1152,213.3C1248,192,1344,160,1392,144L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
              "M0,224L48,213.3C96,203,192,181,288,186.7C384,192,480,224,576,229.3C672,235,768,213,864,186.7C960,160,1056,128,1152,128C1248,128,1344,160,1392,176L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",
            ],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut" as const,
            delay: 1,
          }}
        />
      </svg>
    </motion.div>
  );
};

// Grid pattern overlay
const GridPattern = () => {
  const { currentTheme } = useTheme();
  
  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        backgroundImage: `
          linear-gradient(${currentTheme.particles.baseColor}08 1px, transparent 1px),
          linear-gradient(90deg, ${currentTheme.particles.baseColor}08 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  );
};

export const SettingsBackground = () => {
  const leaves = useMemo(() => 
    Array.from({ length: 8 }, (_, i) => ({
      id: i,
      delay: i * 2,
      duration: 12 + Math.random() * 6,
      startX: (i * 12.5) + Math.random() * 10,
      size: 12 + Math.random() * 8,
    })), 
  []);

  const orbs = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      id: i,
      x: 10 + i * 20,
      y: 20 + (i % 3) * 25,
      size: 80 + Math.random() * 60,
      delay: i * 0.5,
    })), 
  []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Base gradient */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      />
      
      {/* Grid pattern */}
      <GridPattern />
      
      {/* Glowing orbs */}
      {orbs.map((orb) => (
        <GlowingOrb key={orb.id} {...orb} />
      ))}
      
      {/* Floating leaves */}
      {leaves.map((leaf) => (
        <FloatingLeaf key={leaf.id} {...leaf} />
      ))}
      
      {/* Wave pattern at bottom */}
      <WavePattern />
      
      {/* Top gradient fade */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-background to-transparent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
      
      {/* Vignette effect */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 40%, hsl(var(--background)) 100%)',
        }}
      />
    </div>
  );
};

export default SettingsBackground;
