import { RefreshCw, ChevronDown, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { type ChatMode, allModes, getModeConfig } from "@/lib/chatModes";

// Re-export ChatMode for backward compatibility
export type { ChatMode } from "@/lib/chatModes";

interface FloatingModeSelectorProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  onNewChat: () => void;
}

export const FloatingModeSelector = ({
  mode,
  onModeChange,
  onNewChat,
}: FloatingModeSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const currentMode = getModeConfig(mode);

  return (
    <div className="sticky top-16 z-40 flex items-center justify-between gap-3 px-4 py-3 bg-card border-b border-border/50">
      {/* Mode Selector */}
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg",
            "bg-accent/50 hover:bg-accent transition-colors duration-200",
            "text-sm font-medium text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary/30"
          )}
        >
          <currentMode.icon className={cn("h-4 w-4", currentMode.iconColor)} />
          <span>{currentMode.shortLabel}</span>
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <div className="absolute top-full left-0 mt-2 w-72 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-scale-in max-h-[70vh] overflow-y-auto">
              <div className="p-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Support Modes
                </div>
                {allModes.map((modeOption) => (
                  <button
                    key={modeOption.id}
                    onClick={() => {
                      onModeChange(modeOption.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg",
                      "transition-colors duration-200",
                      "hover:bg-accent/50",
                      mode === modeOption.id && "bg-accent"
                    )}
                  >
                    {/* Icon */}
                    <div
                      className={cn(
                        "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center",
                        mode === modeOption.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <modeOption.icon className="h-4 w-4" />
                    </div>

                    {/* Text */}
                    <div className="flex-1 text-left min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {modeOption.label}
                        </span>
                        {mode === modeOption.id && (
                          <Check className="h-3 w-3 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                        {modeOption.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewChat}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg",
          "text-sm text-muted-foreground hover:text-foreground",
          "hover:bg-accent/50 transition-colors duration-200",
          "focus:outline-none focus:ring-2 focus:ring-primary/30"
        )}
      >
        <RefreshCw className="h-4 w-4" />
        <span className="hidden sm:inline">New Chat</span>
      </button>
    </div>
  );
};
