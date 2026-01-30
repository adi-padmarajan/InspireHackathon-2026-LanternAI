import { motion } from "framer-motion";
import { shouldReduceMotion } from "@/lib/animations";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-14 w-14",
  lg: "h-20 w-20",
};

const titleSizeClasses = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-4xl",
};

const subtitleSizeClasses = {
  sm: "text-xs",
  md: "text-sm",
  lg: "text-base",
};

export const LanternLogo = ({
  className = "",
  size = "md",
  animate = true
}: LanternLogoProps) => {
  const reduceMotion = shouldReduceMotion();
  const shouldAnimate = animate && !reduceMotion;

  const getSize = () => {
    switch(size) {
      case 'sm': return 1;
      case 'lg': return 1.8;
      default: return 1.4;
    }
  };

  const sizeMult = getSize();

  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {/* Award-Winning Lantern Icon */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring", stiffness: 120 }}
      >
        {/* Ambient glow - large soft background */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.4) 0%, rgba(249,115,22,0.2) 40%, transparent 70%)',
            transform: 'scale(2.2)',
            filter: 'blur(8px)',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.6, 0.9, 0.6],
                  scale: [2.2, 2.5, 2.2],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Outer pulse ring */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
          style={{
            border: '2px solid rgba(251,191,36,0.5)',
            boxShadow: '0 0 20px rgba(251,191,36,0.3)',
          }}
          animate={
            shouldAnimate
              ? {
                  scale: [1, 1.4, 1],
                  opacity: [0.7, 0, 0.7],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />

        {/* Secondary ring - offset timing */}
        <motion.div
          className={`absolute inset-0 ${sizeClasses[size]} rounded-full`}
          style={{
            border: '1.5px solid rgba(249,115,22,0.4)',
          }}
          animate={
            shouldAnimate
              ? {
                  scale: [1.1, 1.6, 1.1],
                  opacity: [0.5, 0, 0.5],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
            delay: 0.4,
          }}
        />

        {/* Floating ember particles */}
        <motion.div
          className="absolute rounded-full"
          style={{ 
            width: `${6 * sizeMult}px`, 
            height: `${6 * sizeMult}px`,
            top: '-10%',
            left: '30%',
            background: 'radial-gradient(circle, #FCD34D 0%, #F59E0B 100%)',
            boxShadow: '0 0 8px #FBBF24',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.3, 1, 0.3],
                  y: [0, -8, 0],
                  scale: [0.8, 1.2, 0.8],
                }
              : {}
          }
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ 
            width: `${5 * sizeMult}px`, 
            height: `${5 * sizeMult}px`,
            top: '5%',
            right: '15%',
            background: 'radial-gradient(circle, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 0 6px #F97316',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.4, 0.9, 0.4],
                  y: [0, -6, 0],
                  x: [0, 3, 0],
                  scale: [0.9, 1.1, 0.9],
                }
              : {}
          }
          transition={{
            duration: 2.3,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ 
            width: `${4 * sizeMult}px`, 
            height: `${4 * sizeMult}px`,
            bottom: '25%',
            left: '5%',
            background: 'radial-gradient(circle, #FDE68A 0%, #FBBF24 100%)',
            boxShadow: '0 0 5px #FCD34D',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.2, 0.8, 0.2],
                  x: [0, -4, 0],
                  scale: [1, 1.3, 1],
                }
              : {}
          }
          transition={{
            duration: 2.7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.8,
          }}
        />

        {/* Main SVG - Bold, Clean, Award-Winning Design */}
        <svg
          viewBox="0 0 100 100"
          className={`${sizeClasses[size]} relative z-10`}
          fill="none"
        >
          <defs>
            {/* Frame gradient - more metallic feel */}
            <linearGradient id="frameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>

            {/* Core flame gradient - intense center */}
            <radialGradient id="flameCore" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF3C7" />
              <stop offset="55%" stopColor="#FCD34D" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.8" />
            </radialGradient>

            {/* Inner flame glow */}
            <radialGradient id="innerFlame" cx="50%" cy="35%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </radialGradient>

            {/* Strong glow filter */}
            <filter id="strongGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="blur1" />
              <feGaussianBlur stdDeviation="5" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Flame glow filter */}
            <filter id="flameGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="4" result="blur1" />
              <feGaussianBlur stdDeviation="8" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>

            {/* Drop shadow */}
            <filter id="dropShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#F59E0B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* LANTERN FRAME - Bold, Clean Lines */}
          {/* Top handle - elegant arc */}
          <path
            d="M 32 20 Q 50 4 68 20"
            stroke="url(#frameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />

          {/* Handle attachment points */}
          <circle cx="32" cy="20" r="2.5" fill="url(#frameGrad)" filter="url(#strongGlow)" />
          <circle cx="68" cy="20" r="2.5" fill="url(#frameGrad)" filter="url(#strongGlow)" />

          {/* Top cap - horizontal bar */}
          <path
            d="M 26 22 L 74 22"
            stroke="url(#frameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />

          {/* Left frame - slightly tapered */}
          <path
            d="M 28 22 L 30 68"
            stroke="url(#frameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />

          {/* Right frame - slightly tapered */}
          <path
            d="M 72 22 L 70 68"
            stroke="url(#frameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />

          {/* Bottom base */}
          <path
            d="M 30 68 L 70 68"
            stroke="url(#frameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />

          {/* Decorative crossbars */}
          <path
            d="M 29 35 L 71 35"
            stroke="url(#frameGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#strongGlow)"
          />
          <path
            d="M 29.5 55 L 70.5 55"
            stroke="url(#frameGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#strongGlow)"
          />

          {/* Center vertical support */}
          <path
            d="M 50 22 L 50 68"
            stroke="url(#frameGrad)"
            strokeWidth="2.5"
            opacity="0.5"
            filter="url(#strongGlow)"
          />

          {/* Bottom finial - ornamental */}
          <path
            d="M 50 68 L 50 80"
            stroke="url(#frameGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#strongGlow)"
          />
          <circle
            cx="50"
            cy="84"
            r="3.5"
            fill="url(#frameGrad)"
            filter="url(#dropShadow)"
          />

          {/* THE FLAME - Bold, Iconic, Recognizable */}
          <motion.g filter="url(#flameGlow)">
            {/* Outer flame aura */}
            <motion.ellipse
              cx="50"
              cy="45"
              rx="18"
              ry="22"
              fill="#F59E0B"
              opacity="0.5"
              animate={
                shouldAnimate
                  ? {
                      rx: [17, 20, 17],
                      ry: [21, 25, 21],
                      cy: [45, 42, 45],
                    }
                  : {}
              }
              transition={{
                duration: 1.8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Main flame body */}
            <motion.path
              d="M 50 28 
                 C 62 36, 65 48, 62 54 
                 C 60 60, 54 63, 50 63 
                 C 46 63, 40 60, 38 54 
                 C 35 48, 38 36, 50 28"
              fill="url(#flameCore)"
              animate={
                shouldAnimate
                  ? {
                      d: [
                        "M 50 28 C 62 36, 65 48, 62 54 C 60 60, 54 63, 50 63 C 46 63, 40 60, 38 54 C 35 48, 38 36, 50 28",
                        "M 50 24 C 65 34, 68 50, 64 56 C 61 62, 54 65, 50 65 C 46 65, 39 62, 36 56 C 32 50, 35 34, 50 24",
                        "M 50 28 C 62 36, 65 48, 62 54 C 60 60, 54 63, 50 63 C 46 63, 40 60, 38 54 C 35 48, 38 36, 50 28",
                      ],
                    }
                  : {}
              }
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Inner bright core */}
            <motion.ellipse
              cx="50"
              cy="46"
              rx="10"
              ry="14"
              fill="url(#innerFlame)"
              animate={
                shouldAnimate
                  ? {
                      rx: [9, 12, 9],
                      ry: [13, 16, 13],
                      cy: [46, 43, 46],
                    }
                  : {}
              }
              transition={{
                duration: 1.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />

            {/* Hot white center */}
            <motion.ellipse
              cx="50"
              cy="48"
              rx="5"
              ry="7"
              fill="#FFFFFF"
              opacity="0.95"
              animate={
                shouldAnimate
                  ? {
                      rx: [4, 6, 4],
                      ry: [6, 8, 6],
                      opacity: [0.9, 1, 0.9],
                    }
                  : {}
              }
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      {/* Premium Typography */}
      <motion.div
        className="flex flex-col leading-none"
        initial={{ opacity: 0, x: -15 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.4, type: "spring" }}
      >
        <motion.div className="relative">
          <motion.span
            className={`${titleSizeClasses[size]} font-black tracking-tight`}
            style={{
              background: 'linear-gradient(135deg, #FDE68A 0%, #FBBF24 25%, #F59E0B 50%, #EA580C 75%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 2px 4px rgba(251,191,36,0.3))',
            }}
            whileHover={
              shouldAnimate
                ? {
                    scale: 1.05,
                    transition: { duration: 0.2 },
                  }
                : {}
            }
          >
            Lantern
          </motion.span>
        </motion.div>
        <motion.span
          className={`${subtitleSizeClasses[size]} font-semibold tracking-widest uppercase mt-0.5`}
          style={{
            background: 'linear-gradient(90deg, #FBBF24 0%, #F59E0B 50%, #EA580C 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '0.15em',
          }}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.8, 1, 0.8],
                }
              : {}
          }
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          AI Companion
        </motion.span>
      </motion.div>
    </div>
  );
};
