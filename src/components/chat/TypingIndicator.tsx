import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { typingDot, springPresets, breathingAnimation } from "@/lib/animations";

export const TypingIndicator = () => {
  return (
    <motion.div
      className="flex gap-3"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={springPresets.gentle}
    >
      {/* Avatar with breathing pulse */}
      <motion.div
        className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-lantern-glow/20 to-lantern-glow-soft/30 shadow-sm"
        animate={breathingAnimation}
      >
        <Lamp className="h-4 w-4 text-lantern-glow" />
      </motion.div>

      {/* Typing Bubble */}
      <div className="flex flex-col items-start">
        <motion.span
          className="text-xs font-medium mb-1.5 px-1 text-lantern-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          Lantern
        </motion.span>

        <motion.div
          className="relative bg-card border border-border/50 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={springPresets.bouncy}
        >
          {/* Animated Dots - Framer Motion version */}
          <div className="flex items-center gap-1.5">
            {[0, 0.2, 0.4].map((delay, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-lantern-glow rounded-full"
                animate={typingDot(delay)}
              />
            ))}
          </div>

          {/* Subtle text */}
          <motion.div
            className="mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="text-xs text-muted-foreground/60">Thinking warmly...</span>
          </motion.div>

          {/* Animated glow effect */}
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-br from-lantern-glow/10 to-lantern-glow-soft/10 rounded-2xl blur-xl"
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};
