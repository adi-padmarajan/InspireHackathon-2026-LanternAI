import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { flameFlicker, shouldReduceMotion } from "@/lib/animations";

interface LanternLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  animate?: boolean;
}

const sizeClasses = {
  sm: "h-6 w-6",
  md: "h-10 w-10",
  lg: "h-14 w-14",
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

const glowSizeClasses = {
  sm: "w-8 h-8 blur-lg",
  md: "w-12 h-12 blur-xl",
  lg: "w-16 h-16 blur-2xl",
};

export const LanternLogo = ({
  className = "",
  size = "md",
  animate = true
}: LanternLogoProps) => {
  const reduceMotion = shouldReduceMotion();
  const shouldAnimate = animate && !reduceMotion;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Lantern icon with glow and animation */}
      <div className="relative">
        {/* Ambient glow behind the lamp */}
        <motion.div
          className={`absolute inset-0 ${glowSizeClasses[size]} bg-amber-400/30 rounded-full -translate-x-1 -translate-y-1`}
          animate={
            shouldAnimate
              ? {
                  opacity: [0.3, 0.5, 0.3],
                  scale: [1, 1.1, 1],
                }
              : {}
          }
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* The lamp icon with flame flicker */}
        <motion.div
          animate={shouldAnimate ? flameFlicker : {}}
          className="relative"
        >
          <Lamp
            className={`${sizeClasses[size]} text-amber-500 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]`}
          />
        </motion.div>
      </div>

      {/* Text block with subtle animation */}
      <motion.div
        className="flex flex-col leading-tight"
        initial={{ opacity: 0, x: -5 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <motion.span
          className={`${titleSizeClasses[size]} font-extrabold text-foreground`}
          whileHover={shouldAnimate ? {
            color: "hsl(38 95% 55%)",
            transition: { duration: 0.2 }
          } : {}}
        >
          Lantern
        </motion.span>
        <span className={`${subtitleSizeClasses[size]} font-normal text-muted-foreground`}>
          Your AI Companion
        </span>
      </motion.div>
    </div>
  );
};
