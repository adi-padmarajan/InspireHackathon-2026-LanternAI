import { useMemo } from "react";
import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { getPersonalizedGreeting } from "@/lib/greetings";
import { useWeather } from "@/hooks/useWeather";
import {
  staggerContainer,
  staggerChild,
  floatingAnimation,
  glowPulse,
  springPresets,
} from "@/lib/animations";
import { WarmGlow } from "@/components/AmbientBackground";

interface PersonalizedGreetingProps {
  userName?: string;
}

export const PersonalizedGreeting = ({ userName = "Adi" }: PersonalizedGreetingProps) => {
  const { weather, greetingWeather, isLoading } = useWeather();

  // Memoize greeting to prevent re-randomizing on every render
  const greeting = useMemo(
    () => getPersonalizedGreeting(userName, greetingWeather),
    [userName, greetingWeather]
  );

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {/* Lantern glow background */}
      <div className="relative flex flex-col items-center">
        {/* Ambient glow */}
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.2)] via-[hsl(var(--lantern-glow-soft)/0.1)] to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Lantern icon */}
        <motion.div
          className="relative mb-8"
          variants={staggerChild}
        >
          <WarmGlow intensity="strong" className="scale-150" />

          <motion.div
            className="relative bg-gradient-to-br from-accent to-accent/80 p-8 rounded-full"
            animate={glowPulse}
            whileHover={{ scale: 1.05 }}
            transition={springPresets.gentle}
          >
            <motion.div animate={floatingAnimation}>
              <Lamp className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Weather emoji with bounce */}
        <motion.div
          className="text-4xl mb-4"
          variants={staggerChild}
          whileHover={{
            scale: 1.3,
            rotate: [0, -5, 5, 0],
          }}
          transition={springPresets.bouncy}
        >
          {greeting.emoji}
        </motion.div>

        {/* Main greeting with staggered text reveal */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-center mb-3"
          variants={staggerChild}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...springPresets.gentle }}
          >
            {greeting.main}
          </motion.span>
          {userName && (
            <motion.span
              className="text-primary"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, ...springPresets.bouncy }}
              whileHover={{
                scale: 1.05,
                textShadow: "0 0 20px hsl(38 95% 55% / 0.5)",
              }}
            >
              , {userName}
            </motion.span>
          )}
        </motion.h1>

        {/* Sub greeting */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground text-center max-w-lg"
          variants={staggerChild}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {greeting.sub}
        </motion.p>

        {/* Live weather indicator */}
        {weather && !isLoading && (
          <motion.div
            className="mt-6"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7, ...springPresets.gentle }}
          >
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm text-muted-foreground text-sm"
              whileHover={{
                scale: 1.05,
                backgroundColor: "hsl(var(--accent) / 0.3)",
              }}
              transition={springPresets.snappy}
            >
              <motion.span
                animate={{ opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {weather.temperature}°C
              </motion.span>
              <span className="text-muted-foreground/60">·</span>
              <span>{weather.description}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>Victoria</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
