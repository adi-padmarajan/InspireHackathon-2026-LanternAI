/**
 * Mode Selector Grid
 * Displayed on the welcome screen to let users choose their support mode
 */

import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { type ChatMode, allModes } from "@/lib/chatModes";
import { staggerContainer, springPresets } from "@/lib/animations";

interface ModeSelectorGridProps {
  onSelectMode: (mode: ChatMode) => void;
}

// Card animation variants with 3D effect
const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -15,
    scale: 0.95,
  },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export const ModeSelectorGrid = ({ onSelectMode }: ModeSelectorGridProps) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="w-full">
      {/* Section header */}
      <motion.div
        className="flex items-center gap-2 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <motion.span
          className="text-sm font-medium text-muted-foreground px-2"
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Choose your support mode
        </motion.span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </motion.div>

      {/* Grid with 3D perspective */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3"
        style={{ perspective: 1000 }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {allModes.map((mode, index) => (
          <motion.button
            key={mode.id}
            custom={index}
            variants={cardVariants}
            onClick={() => onSelectMode(mode.id)}
            onHoverStart={() => setHoveredIndex(index)}
            onHoverEnd={() => setHoveredIndex(null)}
            className={cn(
              "group relative flex flex-col items-start p-4 rounded-xl",
              "bg-gradient-to-br border border-border/50",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background",
              mode.gradient,
              "overflow-hidden"
            )}
            style={{ transformStyle: "preserve-3d" }}
            whileHover={{
              scale: 1.03,
              rotateY: 2,
              rotateX: -2,
              z: 20,
              transition: springPresets.snappy,
            }}
            whileTap={{ scale: 0.98 }}
          >
            {/* Animated background glow on hover */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-xl"
              initial={{ opacity: 0 }}
              animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
              transition={{ duration: 0.3 }}
            />

            {/* Icon Container with hover animation */}
            <motion.div
              className="p-2.5 rounded-lg bg-background/80 shadow-sm mb-3 relative z-10"
              whileHover={{
                scale: 1.15,
                rotate: [0, -5, 5, 0],
                boxShadow: "0 0 20px hsl(var(--primary) / 0.3)",
              }}
              transition={springPresets.bouncy}
            >
              <mode.icon className={cn("h-5 w-5", mode.iconColor)} />
            </motion.div>

            {/* Text Content */}
            <h3 className="font-semibold text-sm text-foreground mb-1 text-left relative z-10">
              {mode.label}
            </h3>
            <p className="text-xs text-muted-foreground text-left leading-relaxed line-clamp-2 relative z-10">
              {mode.description}
            </p>

            {/* Hover Arrow with smooth animation */}
            <motion.div
              className="absolute bottom-4 right-4"
              initial={{ opacity: 0, x: -10 }}
              animate={{
                opacity: hoveredIndex === index ? 1 : 0,
                x: hoveredIndex === index ? 0 : -10,
              }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </motion.div>

            {/* Shimmer effect on hover */}
            <motion.div
              className="absolute inset-0 -z-10"
              initial={{ x: "-100%", opacity: 0 }}
              animate={{
                x: hoveredIndex === index ? "100%" : "-100%",
                opacity: hoveredIndex === index ? 0.3 : 0,
              }}
              transition={{ duration: 0.6 }}
              style={{
                background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.1), transparent)",
              }}
            />
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};
