import { useEffect, useState, useMemo } from "react";
import { Lamp } from "lucide-react";
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
    <div 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      {/* Lantern glow background */}
      <div className="relative flex flex-col items-center">
      {/* Ambient glow - uses lantern-glow token from design system */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.2)] via-[hsl(var(--lantern-glow-soft)/0.1)] to-transparent rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Lantern icon */}
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.4)] to-[hsl(var(--lantern-glow-soft)/0.2)] rounded-full blur-2xl scale-150 animate-pulse-slow" />
        <div className="relative bg-gradient-to-br from-accent to-accent/80 p-8 rounded-full lantern-glow">
          <Lamp className="h-16 w-16 md:h-20 md:w-20 text-primary float-animation" />
        </div>
      </div>

        {/* Weather emoji */}
        <div className="text-4xl mb-4 animate-fade-in stagger-1">
          {greeting.emoji}
        </div>

        {/* Main greeting */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-center mb-3 animate-fade-in stagger-2">
          {greeting.main}
          {userName && (
            <span className="text-primary">, {userName}</span>
          )}
        </h1>

        {/* Sub greeting */}
        <p className="text-xl md:text-2xl text-muted-foreground text-center max-w-lg animate-fade-in stagger-3">
          {greeting.sub}
        </p>

        {/* Live weather indicator */}
        {weather && !isLoading && (
          <div className="mt-6 animate-fade-in stagger-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted/50 backdrop-blur-sm text-muted-foreground text-sm">
              <span>{weather.temperature}°C</span>
              <span className="text-muted-foreground/60">·</span>
              <span>{weather.description}</span>
              <span className="text-muted-foreground/60">·</span>
              <span>Victoria</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
