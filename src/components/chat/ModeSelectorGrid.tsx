/**
 * Mode Selector Grid
 * Displayed on the welcome screen to let users choose their support mode
 */

import { cn } from "@/lib/utils";
import { type ChatMode, allModes } from "@/lib/chatModes";

interface ModeSelectorGridProps {
  onSelectMode: (mode: ChatMode) => void;
}

export const ModeSelectorGrid = ({ onSelectMode }: ModeSelectorGridProps) => {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="text-sm font-medium text-muted-foreground px-2">
          Choose your support mode
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {allModes.map((mode, index) => (
          <button
            key={mode.id}
            onClick={() => onSelectMode(mode.id)}
            className={cn(
              "group relative flex flex-col items-start p-4 rounded-xl",
              "bg-gradient-to-br border border-border/50",
              "transition-all duration-300 ease-out",
              "hover:scale-[1.02] hover:shadow-lg hover:border-primary/20",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-background",
              mode.gradient,
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            {/* Icon Container */}
            <div
              className={cn(
                "p-2.5 rounded-lg bg-background/80 shadow-sm mb-3",
                "group-hover:shadow-md transition-shadow duration-300"
              )}
            >
              <mode.icon className={cn("h-5 w-5", mode.iconColor)} />
            </div>

            {/* Text Content */}
            <h3 className="font-semibold text-sm text-foreground mb-1 text-left">
              {mode.label}
            </h3>
            <p className="text-xs text-muted-foreground text-left leading-relaxed line-clamp-2">
              {mode.description}
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
