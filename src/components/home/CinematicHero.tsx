/**
 * CinematicHero - Apple-level hero section
 * Premium typography, heavy whitespace, emotional warmth
 */

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Lamp, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useWeatherContext } from "@/contexts/WeatherContext";
import { getGreeting, getTimeOfDay } from "@/lib/greetings";
import { toGreetingWeather } from "@/lib/weather";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CinematicHeroProps {
  userName?: string;
  isAuthenticated: boolean;
}

const formatWeatherDescription = (description: string) => {
  const lower = description.toLowerCase();
  if (lower === "clear sky" || lower === "clear night") return "clear skies";
  if (lower === "overcast") return "overcast skies";
  return lower;
};

const getTimeLabel = (timeOfDay: ReturnType<typeof getTimeOfDay>) => {
  switch (timeOfDay) {
    case "morning": return "this morning";
    case "afternoon": return "this afternoon";
    case "evening": return "this evening";
    default: return "tonight";
  }
};

export const CinematicHero = ({ userName, isAuthenticated }: CinematicHeroProps) => {
  const { weather, isLoading } = useWeatherContext();
  const [timeOfDay, setTimeOfDay] = useState(getTimeOfDay());

  useEffect(() => {
    const interval = setInterval(() => setTimeOfDay(getTimeOfDay()), 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const greetingWeather = weather ? toGreetingWeather(weather.condition) : "cloudy";
  const greeting = useMemo(
    () => getGreeting({ timeOfDay, weather: greetingWeather, userName }),
    [timeOfDay, greetingWeather, userName]
  );

  const weatherLine = useMemo(() => {
    if (!weather) {
      return isLoading ? "Reading Victoria's skies..." : "Victoria awaits.";
    }
    const description = formatWeatherDescription(weather.description);
    return `${description} · ${weather.temperature}°C`;
  }, [weather, isLoading]);

  return (
    <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 md:py-24">
      {/* Centered ambient glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <motion.div
          className="w-[800px] h-[800px] rounded-full blur-[200px]"
          style={{
            background: "radial-gradient(circle, hsl(var(--lantern-glow) / 0.12) 0%, hsl(var(--primary) / 0.04) 40%, transparent 70%)",
          }}
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.6, 0.8, 0.6],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Content container */}
      <div className="relative z-10 max-w-4xl mx-auto text-center space-y-8">
        {/* Luminous brand mark */}
        <motion.div
          className="inline-flex"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className={cn(
              "relative p-6 rounded-full",
              "bg-gradient-to-br from-accent/80 via-accent/60 to-accent/40",
              "shadow-2xl"
            )}
            animate={{
              boxShadow: [
                "0 0 60px hsl(var(--lantern-glow) / 0.25), 0 0 120px hsl(var(--lantern-glow) / 0.1)",
                "0 0 80px hsl(var(--lantern-glow) / 0.4), 0 0 150px hsl(var(--lantern-glow) / 0.15)",
                "0 0 60px hsl(var(--lantern-glow) / 0.25), 0 0 120px hsl(var(--lantern-glow) / 0.1)",
              ],
            }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ y: [0, -6, 0], rotate: [0, 3, 0, -3, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <Lamp className="h-12 w-12 md:h-16 md:w-16 text-primary drop-shadow-lg" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Main headline - Large serif typography */}
        <motion.div
          className="space-y-4"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: "easeOut" }}
        >
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold text-foreground tracking-tight leading-[1.1]">
            {greeting.main}
            {isAuthenticated && userName && (
              <span className="block md:inline">
                <span className="md:ml-3">,</span>{" "}
                <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
                  {userName}
                </span>
              </span>
            )}
            <span className="ml-3">{greeting.emoji}</span>
          </h1>

          <motion.p
            className="text-xl md:text-2xl lg:text-3xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            {greeting.sub}
          </motion.p>
        </motion.div>

        {/* Weather pill */}
        <motion.div
          className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-card/60 backdrop-blur-sm border border-border/50 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.5 }}
        >
          <span className="h-2 w-2 rounded-full bg-primary/60 animate-pulse" />
          <span className="text-sm font-medium text-foreground/70">
            Victoria, BC · {weatherLine}
          </span>
        </motion.div>

        {/* Quick action chips */}
        <motion.div
          className="flex flex-wrap items-center justify-center gap-4 pt-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
        >
          <Link to="/chat">
            <Button
              size="lg"
              className="gap-2 text-base h-12 px-8 rounded-full shadow-xl hover:shadow-2xl transition-all"
            >
              <Sparkles className="h-4 w-4" />
              Talk to Lantern
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link to="/wellness">
            <Button
              variant="outline"
              size="lg"
              className="gap-2 text-base h-12 px-8 rounded-full"
            >
              Wellness Check-In
            </Button>
          </Link>
        </motion.div>

        {/* Trust badge */}
        {!isAuthenticated && (
          <motion.p
            className="text-sm text-muted-foreground/50 pt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            Designed for UVic students, by UVic students
          </motion.p>
        )}
      </div>
    </section>
  );
};
