import { useEffect, useState, useMemo } from "react";
import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { getPersonalizedGreeting } from "@/lib/greetings";
import { useWeather } from "@/hooks/useWeather";

interface PersonalizedGreetingProps {
  userName?: string;
}

export const PersonalizedGreeting = ({ userName = "Adi" }: PersonalizedGreetingProps) => {
  const { weather, greetingWeather, isLoading } = useWeather();
  const [isVisible, setIsVisible] = useState(false);

  // Memoize greeting to prevent re-randomizing on every render
  const greeting = useMemo(
    () => getPersonalizedGreeting(userName, greetingWeather),
    [userName, greetingWeather]
  );

  useEffect(() => {
    // Fade in animation
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Lantern glow background */}
      <div className="relative flex flex-col items-center">
        {/* Ambient glow - uses lantern-glow token from design system */}
        <motion.div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.2)] via-[hsl(var(--lantern-glow-soft)/0.1)] to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />
      
        {/* Lantern icon with interactive effects */}
        <motion.div 
          className="relative mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer glow ring */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.4)] to-[hsl(var(--lantern-glow-soft)/0.2)] rounded-full blur-2xl scale-150"
            animate={{ 
              scale: [1.5, 1.7, 1.5],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Inner glow pulse */}
          <motion.div 
            className="absolute inset-0 bg-[hsl(var(--lantern-glow)/0.3)] rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          <motion.div 
            className="relative bg-gradient-to-br from-accent to-accent/80 p-8 rounded-full lantern-glow"
            animate={{ 
              boxShadow: [
                "0 0 60px hsl(38 95% 55% / 0.4), 0 0 120px hsl(38 95% 55% / 0.2)",
                "0 0 80px hsl(38 95% 55% / 0.5), 0 0 160px hsl(38 95% 55% / 0.3)",
                "0 0 60px hsl(38 95% 55% / 0.4), 0 0 120px hsl(38 95% 55% / 0.2)"
              ]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Lamp className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Weather emoji */}
        <motion.div 
          className="text-4xl mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          {greeting.emoji}
        </motion.div>

        {/* Main greeting */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          {greeting.main}
          {userName && (
            <span className="text-primary">, {userName}</span>
          )}
        </motion.h1>

        {/* Sub greeting */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground text-center max-w-lg"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {greeting.sub}
        </motion.p>

        {/* Live weather indicator */}
        {weather && !isLoading && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm text-muted-foreground text-sm">
              <span>{weather.temperature}°C</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{weather.description}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>Victoria</span>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};
