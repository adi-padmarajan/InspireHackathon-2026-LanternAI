/**
 * CinematicHero
 */

import { useMemo } from "react";
import { Lamp, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { getPersonalizedGreeting } from "@/lib/greetings";
import { useWeather } from "@/hooks/useWeather";
import { SignInPrompt } from "@/components/home/SignInPrompt";

interface CinematicHeroProps {
  userName?: string;
  isAuthenticated: boolean;
}

// Cinematic spring presets
const spring = {
  gentle: { type: "spring" as const, stiffness: 100, damping: 20 },
  bouncy: { type: "spring" as const, stiffness: 300, damping: 15 },
};

export const CinematicHero = ({ userName, isAuthenticated }: CinematicHeroProps) => {
  const { weather, greetingWeather, isLoading } = useWeather();

  const greeting = useMemo(
    () => getPersonalizedGreeting(userName || "Friend", greetingWeather),
    [userName, greetingWeather]
  );

  return (
    <motion.div
      className="relative flex flex-col items-center text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* Cinematic ambient glow - Multiple layers for depth */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[600px] pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-[hsl(var(--lantern-glow)/0.15)] via-[hsl(var(--lantern-glow)/0.05)] to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute inset-12 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-2xl"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
      </div>

      {/* Lantern Icon with cinematic glow */}
      <motion.div
        className="relative mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, ...spring.bouncy }}
      >
        {/* Multi-layer glow effect */}
        <div className="absolute inset-0 scale-150">
          <motion.div
            className="absolute inset-0 bg-gradient-radial from-[hsl(var(--lantern-glow)/0.4)] to-transparent rounded-full blur-xl"
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.6, 0.9, 0.6],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Lantern container */}
        <motion.div
          className="relative bg-gradient-to-br from-accent via-accent/90 to-accent/70 p-7 md:p-9 rounded-full shadow-2xl"
          animate={{
            boxShadow: [
              "0 0 40px hsl(var(--lantern-glow) / 0.3), 0 20px 60px hsl(var(--lantern-glow) / 0.2)",
              "0 0 60px hsl(var(--lantern-glow) / 0.5), 0 25px 80px hsl(var(--lantern-glow) / 0.3)",
              "0 0 40px hsl(var(--lantern-glow) / 0.3), 0 20px 60px hsl(var(--lantern-glow) / 0.2)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          whileHover={{ scale: 1.08 }}
        >
          <motion.div
            animate={{
              y: [0, -6, 0],
              rotate: [0, 2, 0, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Lamp className="h-14 w-14 md:h-18 md:w-18 text-primary drop-shadow-lg" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Weather/Mood Emoji */}
      <motion.div
        className="text-5xl md:text-6xl mb-6"
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.4, ...spring.bouncy }}
        whileHover={{
          scale: 1.2,
          rotate: [0, -8, 8, 0],
          transition: { duration: 0.4 },
        }}
      >
        {greeting.emoji}
      </motion.div>

      {/* Main Headline */}
      <motion.h1
        className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground mb-4 tracking-tight"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        {greeting.main}
        {isAuthenticated && userName && (
          <motion.span
            className="text-primary"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, ...spring.bouncy }}
          >
            , {userName}
          </motion.span>
        )}
      </motion.h1>

      {/* Sub greeting */}
      <motion.p
        className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-2xl leading-relaxed"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        {greeting.sub}
      </motion.p>

      {/* Personal message for authenticated users */}
      {isAuthenticated && userName && (
        <motion.div
          className="mt-8 max-w-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          <p className="text-lg md:text-xl text-foreground/80 leading-relaxed">
            I'm <span className="text-primary font-semibold">Lantern</span>, and I'm always here whenever you need to chat, vent, or just hang out.{" "}
            <span className="text-foreground font-medium">What's on your mind today?</span>
          </p>
        </motion.div>
      )}

      {/* Sign in prompt for guests */}
      {!isAuthenticated && (
        <SignInPrompt />
      )}

      {/* Live weather indicator */}
      {weather && !isLoading && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
        >
          <motion.div
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/80 backdrop-blur-sm border border-border/50 shadow-lg"
            whileHover={{
              scale: 1.03,
              boxShadow: "0 10px 40px -10px hsl(var(--primary) / 0.2)",
            }}
            transition={spring.gentle}
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">{weather.temperature}°C</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm text-muted-foreground">{weather.description}</span>
            <span className="text-muted-foreground/40">·</span>
            <span className="text-sm text-muted-foreground">Victoria, BC</span>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};
