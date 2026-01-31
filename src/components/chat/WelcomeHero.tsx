import { Lamp, Sparkles, Heart, Sun, Moon, CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import {
  staggerContainer,
  staggerChild,
  floatingAnimation,
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
      className="flex flex-col items-center justify-center py-12 md:py-16"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Lantern Icon with refined glow */}
      <motion.div
        className="relative mb-8"
        variants={staggerChild}
      >
        {/* Ambient glow */}
        <motion.div
          className="absolute inset-0 rounded-full blur-[60px] scale-[2]"
          style={{
            background: "radial-gradient(circle, hsl(var(--lantern-glow) / 0.2) 0%, transparent 70%)",
          }}
          animate={{
            scale: [2, 2.2, 2],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="relative p-6 rounded-full bg-gradient-to-br from-accent/80 via-accent/60 to-accent/40 shadow-2xl"
          animate={{
            boxShadow: [
              "0 0 40px hsl(var(--lantern-glow) / 0.2)",
              "0 0 60px hsl(var(--lantern-glow) / 0.35)",
              "0 0 40px hsl(var(--lantern-glow) / 0.2)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity }}
          whileHover={{ scale: 1.05 }}
        >
          <motion.div animate={floatingAnimation}>
            <Lamp className="h-12 w-12 md:h-14 md:w-14 text-primary drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Greeting badge */}
      <motion.div
        className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-card/60 border border-border/40 backdrop-blur-sm"
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
          <TimeIcon className="h-4 w-4 text-primary" />
        </motion.div>
        <span className="text-sm font-medium text-foreground/80">{greeting.text}</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-center mb-4 tracking-tight"
        variants={staggerChild}
      >
        I'm{" "}
        <motion.span
          className="text-primary"
          whileHover={{
            scale: 1.02,
            textShadow: "0 0 30px hsl(var(--primary) / 0.4)",
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
        Your UVic wellness companion
      </motion.p>

      {/* Subtext */}
      <motion.p
        className="text-sm text-muted-foreground/60 text-center"
        variants={staggerChild}
      >
        {greeting.subtext}
      </motion.p>

      {/* Warm Message Card */}
      <motion.div
        className="mt-10 p-6 md:p-8 bg-card/50 backdrop-blur-sm rounded-3xl max-w-lg border border-border/40 shadow-xl"
        variants={staggerChild}
        whileHover={{
          scale: 1.01,
          boxShadow: "0 0 40px hsl(var(--primary) / 0.1)",
        }}
        transition={springPresets.gentle}
      >
        <div className="flex items-start gap-4">
          <motion.div
            className="flex-shrink-0 p-3 bg-accent/50 rounded-full"
            animate={breathingAnimation}
          >
            <Heart className="h-5 w-5 text-primary" />
          </motion.div>
          <div>
            <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
              I'm here to listen, help you sort through thoughts, and offer steady support. No judgment, just understanding.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="mt-10 flex flex-col items-center gap-3"
        variants={staggerChild}
      >
        <p className="text-sm text-muted-foreground/50">Start by telling me what you'd like to be called</p>
        <motion.div
          className="w-6 h-10 border-2 border-muted-foreground/20 rounded-full flex justify-center pt-2"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <motion.div
            className="w-1.5 h-2.5 bg-muted-foreground/40 rounded-full"
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
