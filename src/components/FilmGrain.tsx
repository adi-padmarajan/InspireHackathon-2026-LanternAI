/**
 * FilmGrain - Cinematic film grain overlay
 * Adds subtle texture and atmospheric depth
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FilmGrainProps {
  opacity?: number;
  className?: string;
}

export const FilmGrain = ({ opacity = 0.03, className }: FilmGrainProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 pointer-events-none z-[100]",
        className
      )}
      style={{ opacity }}
    >
      {/* Film grain texture using SVG noise */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="film-grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.8"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
        <rect width="100%" height="100%" filter="url(#film-grain)" />
      </svg>
    </div>
  );
};

/**
 * CinematicVignette - Edge darkening for depth
 */
export const CinematicVignette = ({ intensity = 0.4 }: { intensity?: number }) => {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-[99]"
      style={{
        background: `radial-gradient(ellipse at center, transparent 0%, transparent 50%, rgba(0,0,0,${intensity}) 100%)`,
      }}
    />
  );
};

/**
 * AmbientGradients - Soft atmospheric color washes
 */
export const AmbientGradients = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-[1] overflow-hidden">
      {/* Top left warm glow */}
      <motion.div
        className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(var(--lantern-glow) / 0.08) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, 20, 0],
          y: [0, 10, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Bottom right cool accent */}
      <motion.div
        className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 rounded-full blur-[120px]"
        style={{
          background: "radial-gradient(circle, hsl(var(--primary) / 0.06) 0%, transparent 70%)",
        }}
        animate={{
          x: [0, -20, 0],
          y: [0, -10, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Center subtle wash */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full rounded-full blur-[200px]"
        style={{
          background: "radial-gradient(circle, hsl(var(--accent) / 0.03) 0%, transparent 50%)",
        }}
        animate={{
          scale: [1, 1.05, 1],
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};
