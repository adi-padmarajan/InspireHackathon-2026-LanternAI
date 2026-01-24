import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
}

export const ChatInput = ({ value, onChange, onSend, isLoading }: ChatInputProps) => {
  return (
    <div className="forest-card p-4">
      <div className="flex gap-3">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && onSend()}
          placeholder="Type your message..."
          className="flex-1 bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <Button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          variant="lantern"
          size="lg"
          className="px-6"
        >
          <Send className="h-5 w-5" />
        </Button>
      </div>
      <p className="text-xs text-muted-foreground mt-3 text-center">
        Lantern is here to support you. For immediate crisis support, please contact{" "}
        <a href="tel:1-800-784-2433" className="text-primary hover:underline font-medium">
          1-800-784-2433
        </a>{" "}
        (Crisis Line BC).
      </p>
    </div>
  );
};
