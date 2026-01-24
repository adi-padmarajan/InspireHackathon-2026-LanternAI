import { Send, Sparkles, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";

interface EnhancedChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const EnhancedChatInput = ({
  value,
  onChange,
  onSend,
  isLoading,
}: EnhancedChatInputProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className="relative">
      {/* Ambient glow when focused */}
      {isFocused && (
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/5 to-transparent rounded-3xl blur-xl" />
      )}

      {/* Main Input Container */}
      <div
        className={cn(
          "relative bg-card border rounded-2xl transition-all duration-300",
          isFocused
            ? "border-primary/30 shadow-lg shadow-primary/5"
            : "border-border/50 shadow-sm"
        )}
      >
        {/* Input Area */}
        <div className="flex items-end gap-3 p-3">
          {/* Textarea */}
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              placeholder="Share what's on your mind..."
              rows={1}
              className={cn(
                "w-full resize-none bg-transparent",
                "text-foreground placeholder:text-muted-foreground/60",
                "text-sm md:text-base leading-relaxed",
                "focus:outline-none",
                "min-h-[24px] max-h-[150px]",
                "py-2 px-1"
              )}
              aria-label="Message input"
            />

            {/* Character hint for long messages */}
            {value.length > 200 && (
              <div className="absolute bottom-0 right-0 text-[10px] text-muted-foreground/50">
                {value.length}/500
              </div>
            )}
          </div>

          {/* Send Button */}
          <button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              "flex-shrink-0 p-3 rounded-xl",
              "transition-all duration-300 ease-out",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-card",
              value.trim() && !isLoading
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            aria-label="Send message"
          >
            {isLoading ? (
              <Sparkles className="h-5 w-5 animate-pulse" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Crisis Support Footer */}
      <div className="flex items-center justify-center gap-2 mt-3 px-2">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <span>Need immediate support?</span>
          <a
            href="tel:1-800-784-2433"
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              "text-primary/80 hover:text-primary transition-colors",
              "focus:outline-none focus:underline"
            )}
          >
            <Phone className="h-3 w-3" />
            <span>1-800-784-2433</span>
          </a>
          <span className="text-muted-foreground/40">(Crisis Line BC)</span>
        </div>
      </div>
    </div>
  );
};
