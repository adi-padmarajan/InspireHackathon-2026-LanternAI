import { Lamp } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      {/* Avatar */}
      <div className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center bg-gradient-to-br from-lantern-glow/20 to-lantern-glow-soft/30 shadow-sm">
        <Lamp className="h-4 w-4 text-lantern-glow animate-pulse" />
      </div>

      {/* Typing Bubble */}
      <div className="flex flex-col items-start">
        <span className="text-xs font-medium mb-1.5 px-1 text-lantern-glow">
          Lantern
        </span>

        <div className="relative bg-card border border-border/50 rounded-2xl rounded-tl-md px-5 py-4 shadow-sm">
          {/* Animated Dots */}
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 bg-lantern-glow rounded-full animate-typing-dot-1" />
            <div className="w-2 h-2 bg-lantern-glow rounded-full animate-typing-dot-2" />
            <div className="w-2 h-2 bg-lantern-glow rounded-full animate-typing-dot-3" />
          </div>

          {/* Subtle text */}
          <div className="mt-2">
            <span className="text-xs text-muted-foreground/60">Thinking warmly...</span>
          </div>

          {/* Glow effect */}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-lantern-glow/10 to-lantern-glow-soft/10 rounded-2xl blur-xl animate-pulse" />
        </div>
      </div>
    </div>
  );
};
