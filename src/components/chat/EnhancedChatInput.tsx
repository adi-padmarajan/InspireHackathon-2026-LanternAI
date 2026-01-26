import { Send, Sparkles, Phone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useState, useRef, useEffect } from "react";
import { springPresets } from "@/lib/animations";

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
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={springPresets.gentle}
    >
      {/* Animated ambient glow when focused */}
      <AnimatePresence>
        {isFocused && (
          <motion.div
            className="absolute inset-0 -z-10 bg-gradient-to-t from-primary/10 to-transparent rounded-3xl blur-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </AnimatePresence>

      {/* Main Input Container */}
      <motion.div
        className={cn(
          "relative bg-card border rounded-2xl transition-colors duration-300",
          isFocused
            ? "border-primary/30 shadow-lg shadow-primary/5"
            : "border-border/50 shadow-sm"
        )}
        animate={{
          boxShadow: isFocused
            ? "0 10px 40px -10px hsl(var(--primary) / 0.15)"
            : "0 2px 10px -5px hsl(0 0% 0% / 0.1)",
        }}
        transition={{ duration: 0.3 }}
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
            <AnimatePresence>
              {value.length > 200 && (
                <motion.div
                  className="absolute bottom-0 right-0 text-[10px] text-muted-foreground/50"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 5 }}
                >
                  {value.length}/500
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Send Button with animations */}
          <motion.button
            onClick={onSend}
            disabled={!value.trim() || isLoading}
            className={cn(
              "flex-shrink-0 p-3 rounded-xl",
              "transition-colors duration-300",
              "focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2 focus:ring-offset-card",
              value.trim() && !isLoading
                ? "bg-gradient-to-br from-primary to-primary/90 text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            )}
            whileHover={value.trim() && !isLoading ? { scale: 1.1 } : {}}
            whileTap={value.trim() && !isLoading ? { scale: 0.95 } : {}}
            transition={springPresets.snappy}
            aria-label="Send message"
          >
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div
                  key="loading"
                  initial={{ rotate: 0, opacity: 0 }}
                  animate={{ rotate: 360, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{
                    rotate: { duration: 1, repeat: Infinity, ease: "linear" },
                  }}
                >
                  <Sparkles className="h-5 w-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Send className="h-5 w-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </motion.div>

      {/* Crisis Support Footer */}
      <motion.div
        className="flex items-center justify-center gap-2 mt-3 px-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60">
          <span>Need immediate support?</span>
          <motion.a
            href="tel:1-800-784-2433"
            className={cn(
              "inline-flex items-center gap-1 font-medium",
              "text-primary/80 hover:text-primary transition-colors",
              "focus:outline-none focus:underline"
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Phone className="h-3 w-3" />
            <span>1-800-784-2433</span>
          </motion.a>
          <span className="text-muted-foreground/40">(Crisis Line BC)</span>
        </div>
      </motion.div>
    </motion.div>
  );
};
