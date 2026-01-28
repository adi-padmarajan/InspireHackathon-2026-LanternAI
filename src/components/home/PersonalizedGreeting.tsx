import { useMemo } from "react";
import { Sparkles, Sun, Moon, CloudSun } from "lucide-react";
import { motion } from "framer-motion";
import { getPersonalizedGreeting } from "@/lib/greetings";
import { useWeather } from "@/hooks/useWeather";
import { springPresets } from "@/lib/animations";

interface PersonalizedGreetingProps {
  userName?: string;
}

// Cinematic animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const fadeUpVariants = {
  hidden: {
    opacity: 0,
    y: 25,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.7,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const scaleInVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.34, 1.56, 0.64, 1]
    }
  }
};

// Get time-based icon
const getTimeIcon = () => {
  const hour = new Date().getHours();
  if (hour >= 6 && hour < 12) return Sun;
  if (hour >= 12 && hour < 18) return CloudSun;
  return Moon;
};

export const PersonalizedGreeting = ({ userName = "Friend" }: PersonalizedGreetingProps) => {
  const { weather, greetingWeather, isLoading } = useWeather();

  const greeting = useMemo(
    () => getPersonalizedGreeting(userName, greetingWeather),
    [userName, greetingWeather]
  );

  const TimeIcon = getTimeIcon();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="relative"
    >
      <div className="relative flex flex-col items-center text-center">
        {/* Cinematic icon with liquid glass effect */}
        <motion.div
          variants={scaleInVariants}
          className="relative mb-8"
        >
          {/* Outer glow ring */}
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                "0 0 40px hsl(var(--theme-glow) / 0.3), 0 0 80px hsl(var(--theme-glow) / 0.15)",
                "0 0 60px hsl(var(--theme-glow) / 0.45), 0 0 120px hsl(var(--theme-glow) / 0.25)",
                "0 0 40px hsl(var(--theme-glow) / 0.3), 0 0 80px hsl(var(--theme-glow) / 0.15)",
              ]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Icon container with liquid glass */}
          <motion.div
            className="relative liquid-icon-container p-6 md:p-8"
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={springPresets.bouncy}
          >
            {/* Floating icon */}
            <motion.div
              animate={{
                y: [0, -6, 0],
                rotate: [0, 3, 0, -3, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TimeIcon className="h-12 w-12 md:h-14 md:w-14 text-primary" strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Weather emoji with playful animation */}
        <motion.div
          variants={scaleInVariants}
          className="mb-6"
        >
          <motion.span
            className="text-5xl md:text-6xl inline-block cursor-default select-none"
            whileHover={{
              scale: 1.3,
              rotate: [0, -8, 8, -8, 0],
            }}
            transition={springPresets.bouncy}
          >
            {greeting.emoji}
          </motion.span>
        </motion.div>

        {/* Main greeting - cinematic typography */}
        <motion.h1
          variants={fadeUpVariants}
          className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold text-foreground mb-4 tracking-tight"
        >
          <span className="text-readable">{greeting.main}</span>
          {userName && (
            <>
              <span className="text-readable">, </span>
              <motion.span
                className="text-gradient-primary inline-block"
                whileHover={{
                  scale: 1.05,
                }}
                transition={springPresets.bouncy}
              >
                {userName}
              </motion.span>
            </>
          )}
        </motion.h1>

        {/* Sub greeting with elegant fade */}
        <motion.p
          variants={fadeUpVariants}
          className="text-xl md:text-2xl lg:text-3xl text-muted-foreground max-w-2xl leading-relaxed text-readable"
        >
          {greeting.sub}
        </motion.p>

        {/* Live weather badge with liquid glass */}
        {weather && !isLoading && (
          <motion.div
            variants={fadeUpVariants}
            className="mt-8"
          >
            <motion.div
              className="inline-flex items-center gap-3 px-5 py-2.5 liquid-weather-badge"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 4px 20px hsl(var(--theme-glow) / 0.15)",
              }}
              transition={springPresets.snappy}
            >
              <motion.div
                className="flex items-center gap-1.5"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Sparkles className="h-4 w-4 text-primary" />
                <span className="font-medium text-foreground">{weather.temperature}°C</span>
              </motion.div>
              <span className="w-px h-4 bg-border" />
              <span className="text-muted-foreground">{weather.description}</span>
              <span className="w-px h-4 bg-border" />
              <span className="text-muted-foreground text-sm">Victoria</span>
            </motion.div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
