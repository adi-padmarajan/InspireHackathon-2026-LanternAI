/**
 * AmbientBackground Component
 * Creates a warm, living atmosphere with floating particles
 * Gives the companion-like "breathing" presence to the UI
 */

import { motion } from "framer-motion";
import { useMemo } from "react";
import { shouldReduceMotion } from "@/lib/animations";

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface AmbientBackgroundProps {
  particleCount?: number;
  variant?: "fireflies" | "orbs" | "subtle";
  className?: string;
}

export const AmbientBackground = ({
  particleCount = 15,
  variant = "fireflies",
  className = "",
}: AmbientBackgroundProps) => {
  const reduceMotion = shouldReduceMotion();

  // Generate random particles
  const particles = useMemo<Particle[]>(() => {
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      size: variant === "orbs"
        ? Math.random() * 200 + 100
        : Math.random() * 4 + 2,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 5,
      opacity: variant === "subtle"
        ? Math.random() * 0.15 + 0.05
        : Math.random() * 0.4 + 0.2,
    }));
  }, [particleCount, variant]);

  if (reduceMotion) {
    // Static fallback for reduced motion
    return (
      <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
        {variant === "orbs" && (
          <>
            <div
              className="absolute w-96 h-96 rounded-full blur-3xl opacity-10"
              style={{
                background: "radial-gradient(circle, hsl(38 95% 55%) 0%, transparent 70%)",
                top: "10%",
                left: "20%",
              }}
            />
            <div
              className="absolute w-80 h-80 rounded-full blur-3xl opacity-10"
              style={{
                background: "radial-gradient(circle, hsl(258 89% 66%) 0%, transparent 70%)",
                bottom: "20%",
                right: "15%",
              }}
            />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Gradient orbs - large ambient glows */}
      {variant === "orbs" && (
        <>
          <motion.div
            className="absolute w-96 h-96 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(38 95% 55% / 0.15) 0%, transparent 70%)",
              top: "5%",
              left: "10%",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute w-80 h-80 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(258 89% 66% / 0.1) 0%, transparent 70%)",
              bottom: "10%",
              right: "5%",
            }}
            animate={{
              x: [0, -40, 0],
              y: [0, -20, 0],
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 2,
            }}
          />
          <motion.div
            className="absolute w-64 h-64 rounded-full blur-3xl"
            style={{
              background: "radial-gradient(circle, hsl(38 90% 60% / 0.08) 0%, transparent 70%)",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />
        </>
      )}

      {/* Floating particles - fireflies or subtle dots */}
      {(variant === "fireflies" || variant === "subtle") &&
        particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              background: variant === "fireflies"
                ? "radial-gradient(circle, hsl(38 95% 55%) 0%, hsl(38 95% 55% / 0) 70%)"
                : "radial-gradient(circle, hsl(258 89% 66% / 0.5) 0%, transparent 70%)",
              boxShadow: variant === "fireflies"
                ? `0 0 ${particle.size * 3}px hsl(38 95% 55% / 0.5)`
                : "none",
            }}
            animate={{
              y: [0, -150, 0],
              x: [0, Math.random() * 60 - 30, 0],
              opacity: [0, particle.opacity, 0],
              scale: [0.5, 1.2, 0.5],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
    </div>
  );
};

/**
 * GlowOrb Component
 * A single animated glowing orb for accent areas
 */
interface GlowOrbProps {
  color?: "warm" | "primary" | "accent";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const GlowOrb = ({
  color = "warm",
  size = "md",
  className = "",
}: GlowOrbProps) => {
  const reduceMotion = shouldReduceMotion();

  const colorMap = {
    warm: "hsl(38 95% 55%)",
    primary: "hsl(258 89% 66%)",
    accent: "hsl(152 45% 35%)",
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

/**
 * WarmGlow Component
 * Creates a warm lantern-like glow effect behind elements
 */
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
        background: "radial-gradient(circle, hsl(38 95% 55%) 0%, transparent 60%)",
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
