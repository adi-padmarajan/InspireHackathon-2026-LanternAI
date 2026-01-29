import { Lamp, Sparkles, Heart, Sun, Moon, CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerChild,
  floatingAnimation,
  glowPulse,
  springPresets,
  breathingAnimation,
} from "@/lib/animations";

interface WelcomeHeroProps {
  onGetStarted?: () => void;
}

const getTimeOfDay = () => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

const getGreeting = (timeOfDay: string) => {
  switch (timeOfDay) {
    case "morning":
      return { text: "Good morning", icon: Sun, subtext: "A fresh start to your day" };
    case "afternoon":
      return { text: "Good afternoon", icon: CloudSun, subtext: "Taking a moment for yourself" };
    case "evening":
      return { text: "Good evening", icon: Moon, subtext: "Winding down gently" };
    default:
      return { text: "Hello there", icon: Sparkles, subtext: "I'm here whenever you need" };
  }
};

export const WelcomeHero = ({ onGetStarted }: WelcomeHeroProps) => {
  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay);
  const TimeIcon = greeting.icon;

  return (
    <motion.div
      className="flex flex-col items-center justify-center py-8 md:py-12"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Lantern Icon with Glow */}
      <motion.div
        className="relative mb-6"
        variants={staggerChild}
      >
        {/* Animated glow behind lantern */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-amber-400/30 to-orange-400/20 rounded-full blur-3xl scale-150"
          animate={{
            scale: [1.5, 1.7, 1.5],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 p-6 rounded-full"
          animate={glowPulse}
          whileHover={{ scale: 1.1 }}
          transition={springPresets.gentle}
        >
          <motion.div animate={floatingAnimation}>
            <Lamp className="h-12 w-12 md:h-16 md:w-16 text-amber-600 dark:text-amber-400" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Greeting with Time Icon */}
      <motion.div
        className="flex items-center gap-2 mb-2"
        variants={staggerChild}
      >
        <motion.div
          animate={{
            rotate: timeOfDay === "morning" ? [0, 10, 0] : [0, -5, 5, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <TimeIcon className="h-5 w-5 text-primary" />
        </motion.div>
        <span className="text-sm font-medium text-primary">{greeting.text}</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-center mb-3"
        variants={staggerChild}
      >
        I'm{" "}
        <motion.span
          className="text-primary"
          whileHover={{
            scale: 1.05,
            textShadow: "0 0 20px hsl(38 95% 55% / 0.5)",
          }}
          transition={springPresets.snappy}
        >
          Lantern
        </motion.span>
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground text-center max-w-md mb-2"
        variants={staggerChild}
      >
        Your UVic companion
      </motion.p>

      {/* Subtext */}
      <motion.p
        className="text-sm text-muted-foreground/70 text-center"
        variants={staggerChild}
      >
        {greeting.subtext}
      </motion.p>

      {/* Warm Message */}
      <motion.div
        className="mt-8 p-4 md:p-6 bg-gradient-to-br from-accent/50 to-accent/30 dark:from-accent/30 dark:to-accent/10 rounded-2xl max-w-lg border border-primary/10"
        variants={staggerChild}
        whileHover={{
          scale: 1.02,
          boxShadow: "0 0 30px hsl(var(--primary) / 0.1)",
        }}
        transition={springPresets.gentle}
      >
        <div className="flex items-start gap-3">
          <motion.div
            className="flex-shrink-0 p-2 bg-primary/10 rounded-full"
            animate={breathingAnimation}
          >
            <Heart className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              I'm here to listen, help you sort through thoughts, and offer steady support. No judgment, just understanding.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="mt-8 flex flex-col items-center gap-2"
        variants={staggerChild}
      >
        <p className="text-xs text-muted-foreground">Start typing whenever you're ready</p>
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-3 bg-muted-foreground/50 rounded-full"
            animate={{ y: [0, 8, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
