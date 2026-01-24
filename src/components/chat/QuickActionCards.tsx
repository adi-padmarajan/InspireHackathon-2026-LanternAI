import {
  Brain,
  Sun,
  Users,
  Heart,
  Accessibility,
  Globe,
  MapPin,
  Coffee,
  type LucideIcon
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Topic {
  icon: LucideIcon;
  label: string;
  description: string;
  prompt: string;
  gradient: string;
  iconColor: string;
}

const topics: Topic[] = [
  {
    icon: Brain,
    label: "Stress & Anxiety",
    description: "Feeling overwhelmed or stressed",
    prompt: "I'm feeling really stressed and anxious lately",
    gradient: "from-violet-500/10 to-purple-500/10 hover:from-violet-500/20 hover:to-purple-500/20",
    iconColor: "text-violet-600 dark:text-violet-400"
  },
  {
    icon: Sun,
    label: "Seasonal Blues",
    description: "Dark days affecting mood",
    prompt: "The dark winter days are affecting my mood",
    gradient: "from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20",
    iconColor: "text-amber-600 dark:text-amber-400"
  },
  {
    icon: Users,
    label: "Making Friends",
    description: "Connection & belonging",
    prompt: "I'm having trouble making friends at university",
    gradient: "from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/20 hover:to-teal-500/20",
    iconColor: "text-emerald-600 dark:text-emerald-400"
  },
  {
    icon: Heart,
    label: "Social Anxiety",
    description: "Worried about social situations",
    prompt: "I want to join clubs but I feel too anxious",
    gradient: "from-rose-500/10 to-pink-500/10 hover:from-rose-500/20 hover:to-pink-500/20",
    iconColor: "text-rose-600 dark:text-rose-400"
  },
  {
    icon: Accessibility,
    label: "Campus Access",
    description: "Accessible routes & support",
    prompt: "I need help finding accessible routes on campus",
    gradient: "from-blue-500/10 to-cyan-500/10 hover:from-blue-500/20 hover:to-cyan-500/20",
    iconColor: "text-blue-600 dark:text-blue-400"
  },
  {
    icon: Globe,
    label: "International Support",
    description: "Cultural adjustment help",
    prompt: "As an international student, I'm confused about Canadian academic culture",
    gradient: "from-indigo-500/10 to-blue-500/10 hover:from-indigo-500/20 hover:to-blue-500/20",
    iconColor: "text-indigo-600 dark:text-indigo-400"
  },
];

interface QuickActionCardsProps {
  onSelect: (prompt: string) => void;
}

export const QuickActionCards = ({ onSelect }: QuickActionCardsProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-xs font-medium text-muted-foreground px-2">How can I help you today?</span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {topics.map((topic, index) => (
          <button
            key={topic.label}
            onClick={() => onSelect(topic.prompt)}
            className={cn(
              "group relative flex flex-col items-start p-4 rounded-xl",
              "bg-gradient-to-br border border-border/50",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.02] hover:shadow-lg hover:border-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background",
              topic.gradient,
              "animate-fade-in",
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Icon Container */}
            <div className={cn(
              "p-2.5 rounded-lg bg-background/80 shadow-sm mb-3",
              "group-hover:shadow-md transition-shadow duration-300"
            )}>
              <topic.icon className={cn("h-5 w-5", topic.iconColor)} />
            </div>

            {/* Text Content */}
            <h3 className="font-semibold text-sm text-foreground mb-1 text-left">
              {topic.label}
            </h3>
            <p className="text-xs text-muted-foreground text-left leading-relaxed">
              {topic.description}
            </p>

            {/* Hover Arrow */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <svg
                className="w-4 h-4 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
