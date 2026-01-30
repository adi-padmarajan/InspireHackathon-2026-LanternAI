/**
 * HeroTagline - Premium Apple-style hero section
 * Cinematic typography with elegant animations
 */

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lamp } from "lucide-react";
import { useWeatherContext } from "@/contexts/WeatherContext";
import { getGreeting, getTimeOfDay } from "@/lib/greetings";
import { toGreetingWeather } from "@/lib/weather";
import { cn } from "@/lib/utils";

interface HeroTaglineProps {
  userName?: string;
  isAuthenticated: boolean;
}

const formatWeatherDescription = (description: string) => {
  const lower = description.toLowerCase();
  if (lower === "clear sky" || lower === "clear night") return "clear skies";
  if (lower === "overcast") return "overcast skies";
  return lower;
};

const getTimeOfDayLabel = (timeOfDay: ReturnType<typeof getTimeOfDay>) => {
  switch (timeOfDay) {
    case "morning":
      return "this morning";
    case "afternoon":
      return "this afternoon";
    case "evening":
      return "this evening";
    default:
      return "tonight";
  }
};

const toSentenceCase = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export const HeroTagline = ({ userName, isAuthenticated }: HeroTaglineProps) => {
  const { weather, isLoading } = useWeatherContext();
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOfDay(getTimeOfDay());
    }, 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const greetingWeather = weather ? toGreetingWeather(weather.condition) : "cloudy";
  const greeting = useMemo(
    () => getGreeting({ timeOfDay, weather: greetingWeather, userName }),
    [timeOfDay, greetingWeather, userName]
  );

  const weatherLine = useMemo(() => {
    if (!weather) {
      return isLoading ? "Peeking at Victoria's skies for you..." : "Victoria skies are doing their thing today.";
    }

    const description = toSentenceCase(formatWeatherDescription(weather.description));
    const timeLabel = getTimeOfDayLabel(timeOfDay);

    return `${description} in Victoria ${timeLabel} · ${weather.temperature}C`;
  }, [weather, isLoading, timeOfDay]);

  const companionLine = isAuthenticated
    ? "I'm here for whatever is on your mind."
    : "Your 24/7 AI companion for holistic wellness and seasonal depression support.";

  return (
    <motion.section
      className="relative flex flex-col items-center justify-center text-center py-8 md:py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient glow - centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${30 + i * 20}%`,
              top: `${40 + i * 10}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Lantern Icon - Refined */}
      <motion.div
        className="relative mb-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={cn(
            "relative p-5 rounded-full",
            "bg-gradient-to-br from-accent via-accent/80 to-accent/50",
            "shadow-2xl border border-white/10"
          )}
          animate={{
            boxShadow: [
              "0 0 40px hsl(var(--lantern-glow) / 0.2), 0 0 80px hsl(var(--lantern-glow) / 0.1)",
              "0 0 60px hsl(var(--lantern-glow) / 0.35), 0 0 100px hsl(var(--lantern-glow) / 0.15)",
              "0 0 40px hsl(var(--lantern-glow) / 0.2), 0 0 80px hsl(var(--lantern-glow) / 0.1)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lamp className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main heading - Apple style large typography */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight mb-3 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
      >
        <span className="block">
          {greeting.main}
          {isAuthenticated && userName && (
            <>
              ,{" "}
              <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                {userName}
              </span>
            </>
          )}
          <span className="ml-2">{greeting.emoji}</span>
        </span>
      </motion.h1>

      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background/70 border border-border/60 backdrop-blur-md shadow-[0_10px_28px_-18px_rgba(0,0,0,0.75)] mb-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.38, duration: 0.5, ease: "easeOut" }}
      >
        <span className="h-2 w-2 rounded-full bg-primary/70 animate-pulse" />
        <span className="text-xs md:text-sm font-medium text-foreground/80">{weatherLine}</span>
      </motion.div>

      {/* Subtitle - refined spacing */}
      <motion.p
        className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        <span className="block">{greeting.sub}</span>
        <span className="block text-base md:text-lg text-muted-foreground/80 mt-2">
          {companionLine}
        </span>
      </motion.p>

      {/* Trust badge */}
      {!isAuthenticated && (
        <motion.p
          className="mt-6 text-sm text-muted-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.6 }}
        >
          Designed by UVic students, for UVic students
        </motion.p>
      )}
    </motion.section>
  );
};
