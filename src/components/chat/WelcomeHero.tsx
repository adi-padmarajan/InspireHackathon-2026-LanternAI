import { Lamp, Sparkles, Heart, Sun, Moon, CloudSun } from "lucide-react";
import { useEffect, useState } from "react";

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
  const [isVisible, setIsVisible] = useState(false);
  const timeOfDay = getTimeOfDay();
  const greeting = getGreeting(timeOfDay);
  const TimeIcon = greeting.icon;

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className={`flex flex-col items-center justify-center py-8 md:py-12 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      {/* Lantern Icon with Glow */}
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-gradient-to-b from-amber-400/30 to-orange-400/20 rounded-full blur-3xl scale-150 animate-pulse-slow" />
        <div className="relative bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/40 dark:to-orange-900/40 p-6 rounded-full lantern-glow-soft">
          <Lamp className="h-12 w-12 md:h-16 md:w-16 text-amber-600 dark:text-amber-400 float-animation" />
        </div>
      </div>

      {/* Greeting with Time Icon */}
      <div className="flex items-center gap-2 mb-2 animate-fade-in stagger-1">
        <TimeIcon className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium text-primary">{greeting.text}</span>
      </div>

      {/* Main Title */}
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-semibold text-center mb-3 animate-fade-in stagger-2">
        I'm <span className="text-primary">Lantern</span>
      </h1>

      {/* Subtitle */}
      <p className="text-lg md:text-xl text-muted-foreground text-center max-w-md mb-2 animate-fade-in stagger-3">
        Your UVic wellness companion
      </p>

      {/* Subtext */}
      <p className="text-sm text-muted-foreground/70 text-center animate-fade-in stagger-4">
        {greeting.subtext}
      </p>

      {/* Warm Message */}
      <div className="mt-8 p-4 md:p-6 bg-gradient-to-br from-accent/50 to-accent/30 dark:from-accent/30 dark:to-accent/10 rounded-2xl max-w-lg animate-fade-in stagger-4 border border-primary/10">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 p-2 bg-primary/10 rounded-full">
            <Heart className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              I'm here to support you with <strong>mental health</strong>, <strong>social connections</strong>, <strong>campus accessibility</strong>, and <strong>international student needs</strong>. No judgment, just understanding.
            </p>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="mt-8 flex flex-col items-center gap-2 animate-fade-in stagger-4">
        <p className="text-xs text-muted-foreground">Choose a topic below or just start typing</p>
        <div className="w-6 h-10 border-2 border-muted-foreground/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
};
