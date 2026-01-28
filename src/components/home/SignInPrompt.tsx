import { useNavigate } from "react-router-dom";
import { Sparkles, Star, Wand2 } from "lucide-react";
import { motion } from "framer-motion";
import { LoginButton } from "@/components/auth";
import { springPresets } from "@/lib/animations";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.15,
    }
  }
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.7,
    filter: "blur(12px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Floating stars decoration
const FloatingStars = () => (
  <div className="absolute inset-0 pointer-events-none overflow-hidden">
    {[...Array(5)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute"
        style={{
          left: `${15 + i * 18}%`,
          top: `${20 + (i % 2) * 60}%`,
        }}
        animate={{
          y: [0, -15, 0],
          opacity: [0.3, 0.7, 0.3],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 3 + i * 0.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.3,
        }}
      >
        <Star
          className="text-primary/40"
          size={8 + i * 2}
          fill="currentColor"
        />
      </motion.div>
    ))}
  </div>
);

export const SignInPrompt = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <FloatingStars />

      <div className="relative flex flex-col items-center text-center">
        {/* Cinematic icon with breathing glow */}
        <motion.div
          variants={scaleInVariants}
          className="relative mb-10"
        >
          {/* Outer glow animation */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 50px hsl(var(--theme-glow) / 0.25), 0 0 100px hsl(var(--theme-glow) / 0.1)",
                "0 0 70px hsl(var(--theme-glow) / 0.4), 0 0 140px hsl(var(--theme-glow) / 0.2)",
                "0 0 50px hsl(var(--theme-glow) / 0.25), 0 0 100px hsl(var(--theme-glow) / 0.1)",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Icon container */}
          <motion.div
            className="relative liquid-icon-container p-7 md:p-9"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            transition={springPresets.bouncy}
          >
            <motion.div
              animate={{
                y: [0, -8, 0],
                rotate: [0, 5, 0, -5, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Wand2 className="h-14 w-14 md:h-16 md:w-16 text-primary" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Welcome emoji with playful bounce */}
        <motion.div
          variants={scaleInVariants}
          className="mb-6"
        >
          <motion.span
            className="text-6xl md:text-7xl inline-block cursor-default select-none"
            animate={{
              rotate: [0, -10, 10, -10, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut",
            }}
            whileHover={{
              scale: 1.3,
            }}
          >
            👋
          </motion.span>
        </motion.div>

        {/* Main heading - cinematic typography */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground mb-4 tracking-tight"
        >
          <span className="text-readable">Sign in </span>
          <motion.span
            className="text-gradient-primary inline-block"
            whileHover={{ scale: 1.05 }}
            transition={springPresets.bouncy}
          >
            to get started
          </motion.span>
        </motion.h1>

        {/* Sub message */}
        <motion.p
          variants={fadeUpVariants}
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-xl leading-relaxed mb-10 text-readable"
        >
          Your personal companion is waiting to meet you
        </motion.p>

        {/* Login button with liquid styling */}
        <motion.div
          variants={fadeUpVariants}
          className="relative"
        >
          {/* Button glow effect */}
          <motion.div
            className="absolute inset-0 rounded-2xl blur-xl opacity-40"
            style={{
              background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--theme-glow)) 100%)",
            }}
            animate={{
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.98 }}
            transition={springPresets.snappy}
          >
            <LoginButton variant="lantern" onSuccess={() => navigate("/")} />
          </motion.div>
        </motion.div>

        {/* Trust indicators */}
        <motion.div
          variants={fadeUpVariants}
          className="mt-10 flex items-center justify-center gap-6 text-muted-foreground/70"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary/60" />
            <span className="text-sm">Powered by AI</span>
          </div>
          <span className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm">Secure & Private</span>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};
