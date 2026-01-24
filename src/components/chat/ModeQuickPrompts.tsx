/**
 * Mode-Specific Quick Prompts
 * Shows contextual quick action buttons based on the active chat mode
 */

import { cn } from "@/lib/utils";
import { type ChatMode, getModeConfig } from "@/lib/chatModes";
import { ArrowRight } from "lucide-react";

interface ModeQuickPromptsProps {
  mode: ChatMode;
  onSelectPrompt: (prompt: string) => void;
}

export const ModeQuickPrompts = ({
  mode,
  onSelectPrompt,
}: ModeQuickPromptsProps) => {
  const config = getModeConfig(mode);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center gap-2">
        <config.icon className={cn("h-4 w-4", config.iconColor)} />
        <span className="text-sm font-medium text-foreground">
          Quick options
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {config.quickPrompts.map((prompt, index) => (
          <button
            key={prompt.label}
            onClick={() => onSelectPrompt(prompt.prompt)}
            className={cn(
              "group flex items-center justify-between p-3 rounded-lg",
              "bg-accent/30 hover:bg-accent/50 border border-border/30",
              "transition-all duration-200 ease-out",
              "hover:border-primary/20 hover:shadow-sm",
              "focus:outline-none focus:ring-2 focus:ring-primary/30",
              "text-left",
              "animate-fade-in"
            )}
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">
                {prompt.label}
              </p>
              <p className="text-xs text-muted-foreground truncate mt-0.5">
                {prompt.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
          </button>
        ))}
      </div>
    </div>
  );
};
