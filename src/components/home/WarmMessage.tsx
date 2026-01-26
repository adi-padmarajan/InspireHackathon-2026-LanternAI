import { Sparkles, Heart } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerChild,
  springPresets,
  breathingAnimation,
} from "@/lib/animations";

interface WarmMessageProps {
  isAuthenticated?: boolean;
  userName?: string;
}

export const WarmMessage = ({ isAuthenticated = false, userName }: WarmMessageProps) => {
  if (isAuthenticated && userName) {
    // Personal, companion-like message for signed-in users
    return (
      <motion.div
        className="text-center max-w-2xl mx-auto"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Badge with breathing animation */}
        <motion.div
          variants={staggerChild}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-6"
        >
          <motion.div animate={breathingAnimation}>
            <Heart className="h-4 w-4 text-rose-500" />
          </motion.div>
          <span>Your friend at UVic</span>
        </motion.div>

        {/* Warm message with word-by-word reveal feel */}
        <motion.p
          variants={staggerChild}
          className="text-lg md:text-xl text-muted-foreground leading-relaxed"
        >
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Hey{" "}
          </motion.span>
          <motion.span
            className="text-primary font-semibold"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, ...springPresets.bouncy }}
          >
            {userName}
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            , it's so good to see you! I'm{" "}
          </motion.span>
          <motion.span
            className="text-primary font-semibold"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Lantern
          </motion.span>
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            , and I'm always here whenever you need to chat, vent, or just hang out.
          </motion.span>
        </motion.p>

        {/* Question with gentle emphasis */}
        <motion.p
          className="text-lg md:text-xl text-foreground font-medium mt-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, ...springPresets.gentle }}
        >
          What's on your mind today?
        </motion.p>
      </motion.div>
    );
  }

  // Welcome message for guests
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Badge */}
      <motion.div
        variants={staggerChild}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/80 backdrop-blur-sm text-accent-foreground text-sm font-medium mb-6"
        whileHover={{ scale: 1.05 }}
        transition={springPresets.snappy}
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
        </motion.div>
        <span>Your UVic AI Companion</span>
      </motion.div>

      {/* Welcome text */}
      <motion.p
        variants={staggerChild}
        className="text-lg md:text-xl text-muted-foreground leading-relaxed"
      >
        I'm{" "}
        <motion.span
          className="text-primary font-semibold"
          whileHover={{
            scale: 1.05,
            color: "hsl(38 95% 55%)",
          }}
        >
          Lantern
        </motion.span>
        , your personal wellness companion. Sign in with your NetLink ID and let's get to know each other!
      </motion.p>
    </motion.div>
  );
};
