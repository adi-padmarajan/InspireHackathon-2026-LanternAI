/**
 * Logo Component - Lantern Brand Logo (Compact)
 * Award-winning, bold, and recognizable from afar
 */

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false }) => {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      {/* Award-Winning Compact Lantern Icon */}
      <motion.div
        className="relative"
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 h-11 w-11 rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(251,191,36,0.35) 0%, rgba(249,115,22,0.15) 50%, transparent 70%)',
            transform: 'scale(2)',
            filter: 'blur(6px)',
          }}
          animate={{
            opacity: [0.5, 0.8, 0.5],
            scale: [2, 2.3, 2],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Pulse ring */}
        <motion.div
          className="absolute inset-0 h-11 w-11 rounded-full"
          style={{
            border: '2px solid rgba(251,191,36,0.5)',
            boxShadow: '0 0 15px rgba(251,191,36,0.25)',
          }}
          animate={{
            scale: [1, 1.35, 1],
            opacity: [0.6, 0, 0.6],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeOut",
          }}
        />
        
        {/* Floating embers */}
        <motion.div
          className="absolute rounded-full"
          style={{ 
            width: '5px', 
            height: '5px',
            top: '-5%',
            left: '35%',
            background: 'radial-gradient(circle, #FCD34D 0%, #F59E0B 100%)',
            boxShadow: '0 0 6px #FBBF24',
          }}
          animate={{
            opacity: [0.3, 0.9, 0.3],
            y: [0, -5, 0],
          }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute rounded-full"
          style={{ 
            width: '4px', 
            height: '4px',
            top: '8%',
            right: '18%',
            background: 'radial-gradient(circle, #FB923C 0%, #EA580C 100%)',
            boxShadow: '0 0 5px #F97316',
          }}
          animate={{
            opacity: [0.3, 0.8, 0.3],
            y: [0, -4, 0],
            x: [0, 2, 0],
          }}
          transition={{
            duration: 2.1,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.4,
          }}
        />

        {/* Main SVG - Bold, Clean Design */}
        <svg
          viewBox="0 0 100 100"
          className="relative z-10 h-11 w-11"
          style={{ filter: 'drop-shadow(0 2px 8px rgba(251,191,36,0.4))' }}
          fill="none"
        >
          <defs>
            <linearGradient id="logoFrameGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FCD34D" />
              <stop offset="50%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#DC2626" />
            </linearGradient>
            <radialGradient id="logoFlameCore" cx="50%" cy="40%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="25%" stopColor="#FEF3C7" />
              <stop offset="55%" stopColor="#FCD34D" />
              <stop offset="85%" stopColor="#F59E0B" />
              <stop offset="100%" stopColor="#EA580C" stopOpacity="0.8" />
            </radialGradient>
            <radialGradient id="logoInnerFlame" cx="50%" cy="35%" r="40%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#FEF9C3" />
              <stop offset="100%" stopColor="#FBBF24" stopOpacity="0" />
            </radialGradient>
            <filter id="logoGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2" result="blur1" />
              <feGaussianBlur stdDeviation="4" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="logoFlameGlow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="3" result="blur1" />
              <feGaussianBlur stdDeviation="6" result="blur2" />
              <feMerge>
                <feMergeNode in="blur2" />
                <feMergeNode in="blur1" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* LANTERN FRAME */}
          {/* Top handle */}
          <path
            d="M 32 20 Q 50 4 68 20"
            stroke="url(#logoFrameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          
          {/* Handle attachment points */}
          <circle cx="32" cy="20" r="2.5" fill="url(#logoFrameGrad)" filter="url(#logoGlow)" />
          <circle cx="68" cy="20" r="2.5" fill="url(#logoFrameGrad)" filter="url(#logoGlow)" />
          
          {/* Top cap */}
          <path
            d="M 26 22 L 74 22"
            stroke="url(#logoFrameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          
          {/* Left frame */}
          <path
            d="M 28 22 L 30 68"
            stroke="url(#logoFrameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          
          {/* Right frame */}
          <path
            d="M 72 22 L 70 68"
            stroke="url(#logoFrameGrad)"
            strokeWidth="3.5"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          
          {/* Bottom base */}
          <path
            d="M 30 68 L 70 68"
            stroke="url(#logoFrameGrad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          
          {/* Crossbars */}
          <path
            d="M 29 35 L 71 35"
            stroke="url(#logoFrameGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#logoGlow)"
          />
          <path
            d="M 29.5 55 L 70.5 55"
            stroke="url(#logoFrameGrad)"
            strokeWidth="2"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#logoGlow)"
          />
          
          {/* Center vertical */}
          <path
            d="M 50 22 L 50 68"
            stroke="url(#logoFrameGrad)"
            strokeWidth="2.5"
            opacity="0.5"
            filter="url(#logoGlow)"
          />
          
          {/* Bottom finial */}
          <path
            d="M 50 68 L 50 80"
            stroke="url(#logoFrameGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            filter="url(#logoGlow)"
          />
          <circle
            cx="50"
            cy="84"
            r="3.5"
            fill="url(#logoFrameGrad)"
            filter="url(#logoGlow)"
          />

          {/* THE FLAME */}
          <motion.g filter="url(#logoFlameGlow)">
            {/* Outer flame aura */}
            <motion.ellipse
              cx="50"
              cy="45"
              rx="18"
              ry="22"
              fill="#F59E0B"
              opacity="0.5"
              animate={{
                rx: [17, 20, 17],
                ry: [21, 25, 21],
                cy: [45, 42, 45],
              }}
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
              fill="url(#logoFlameCore)"
              animate={{
                d: [
                  "M 50 28 C 62 36, 65 48, 62 54 C 60 60, 54 63, 50 63 C 46 63, 40 60, 38 54 C 35 48, 38 36, 50 28",
                  "M 50 24 C 65 34, 68 50, 64 56 C 61 62, 54 65, 50 65 C 46 65, 39 62, 36 56 C 32 50, 35 34, 50 24",
                  "M 50 28 C 62 36, 65 48, 62 54 C 60 60, 54 63, 50 63 C 46 63, 40 60, 38 54 C 35 48, 38 36, 50 28",
                ],
              }}
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
              fill="url(#logoInnerFlame)"
              animate={{
                rx: [9, 12, 9],
                ry: [13, 16, 13],
                cy: [46, 43, 46],
              }}
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
              animate={{
                rx: [4, 6, 4],
                ry: [6, 8, 6],
                opacity: [0.9, 1, 0.9],
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </motion.g>
        </svg>
      </motion.div>

      {!iconOnly && (
        <motion.div
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15, duration: 0.35 }}
        >
          <span 
            className="font-black text-lg tracking-tight"
            style={{
              background: 'linear-gradient(135deg, #FDE68A 0%, #FBBF24 25%, #F59E0B 50%, #EA580C 75%, #DC2626 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              filter: 'drop-shadow(0 1px 3px rgba(251,191,36,0.25))',
            }}
          >
            Lantern
          </span>
        </motion.div>
      )}
    </div>
  );
};
