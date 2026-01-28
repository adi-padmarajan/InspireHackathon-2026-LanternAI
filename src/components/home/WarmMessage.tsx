import { Sparkles, Heart, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { springPresets } from "@/lib/animations";

interface WarmMessageProps {
  isAuthenticated?: boolean;
  userName?: string;
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    }
  }
};

const fadeInVariants = {
  hidden: {
    opacity: 0,
    y: 15,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const badgeVariants = {
  hidden: {
    opacity: 0,
    scale: 0.9,
    y: -10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

export const WarmMessage = ({ isAuthenticated = false, userName }: WarmMessageProps) => {
  if (isAuthenticated && userName) {
    return (
      <motion.div
        className="text-center max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Companion badge with liquid styling */}
        <motion.div
          variants={badgeVariants}
          className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 liquid-badge"
        >
          <motion.div
            animate={{
              scale: [1, 1.15, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Heart className="h-4 w-4 text-rose-500" fill="currentColor" />
          </motion.div>
          <span className="text-sm font-medium text-accent-foreground">Your friend at UVic</span>
        </motion.div>

        {/* Main message with beautiful typography */}
        <motion.div
          variants={fadeInVariants}
          className="space-y-4"
        >
          <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed text-readable">
            <span>Hey </span>
            <motion.span
              className="text-gradient-primary font-semibold"
              whileHover={{ scale: 1.05 }}
              transition={springPresets.bouncy}
            >
              {userName}
            </motion.span>
            <span>, it's so good to see you! I'm </span>
            <motion.span
              className="text-primary font-semibold"
              whileHover={{
                textShadow: "0 0 20px hsl(var(--theme-glow) / 0.5)",
              }}
            >
              Lantern
            </motion.span>
            <span>, and I'm always here whenever you need to chat, vent, or just hang out.</span>
          </p>

          {/* Call to action question */}
          <motion.p
            variants={fadeInVariants}
            className="text-xl md:text-2xl lg:text-3xl text-foreground font-serif font-semibold pt-2"
          >
            <motion.span
              className="inline-flex items-center gap-2"
              whileHover={{ scale: 1.02 }}
              transition={springPresets.gentle}
            >
              <Zap className="h-5 w-5 md:h-6 md:w-6 text-primary" />
              <span className="text-readable">What's on your mind today?</span>
            </motion.span>
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  // Guest welcome message
  return (
    <motion.div
      className="text-center max-w-2xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* AI Companion badge */}
      <motion.div
        variants={badgeVariants}
        className="inline-flex items-center gap-2.5 px-5 py-2.5 mb-8 liquid-badge"
      >
        <motion.div
          animate={{
            rotate: [0, 15, -15, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <Sparkles className="h-4 w-4 text-amber-500" />
        </motion.div>
        <span className="text-sm font-medium text-accent-foreground">Your UVic AI Companion</span>
      </motion.div>

      {/* Welcome text */}
      <motion.p
        variants={fadeInVariants}
        className="text-lg md:text-xl lg:text-2xl text-muted-foreground leading-relaxed text-readable"
      >
        <span>I'm </span>
        <motion.span
          className="text-gradient-primary font-semibold"
          whileHover={{
            scale: 1.05,
          }}
          transition={springPresets.bouncy}
        >
          Lantern
        </motion.span>
        <span>, your personal wellness companion. Sign in with your NetLink ID and let's get to know each other!</span>
      </motion.p>

      {/* Subtle encouragement */}
      <motion.div
        variants={fadeInVariants}
        className="mt-6 flex items-center justify-center gap-2 text-muted-foreground/80"
      >
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="flex items-center gap-1.5"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-sm">Always here for you</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
