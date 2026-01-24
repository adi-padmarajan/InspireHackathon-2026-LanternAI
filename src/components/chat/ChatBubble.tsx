import { formatDistanceToNow } from "date-fns";
import { Lamp, User, CheckCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatBubbleProps {
  message: Message;
  isLatest?: boolean;
}

const formatMessageContent = (content: string) => {
  return content.split('\n').map((line, i) => {
    // Handle bold text
    const formattedLine = line.replace(
      /\*\*(.*?)\*\*/g,
      '<strong class="font-semibold text-foreground">$1</strong>'
    );

    // Check if it's a list item
    const isListItem = line.startsWith('•') || line.startsWith('-') || line.match(/^\d+\./);

    return (
      <p
        key={i}
        className={cn(
          i > 0 && 'mt-2',
          isListItem && 'pl-4 relative before:absolute before:left-0 before:content-[""] before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full before:top-2'
        )}
        dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }}
      />
    );
  });
};

export const ChatBubble = ({ message, isLatest = false }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <div
      className={cn(
        "flex gap-3 max-w-full animate-fade-in",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
        isAssistant && "bg-gradient-to-br from-lantern-glow/20 to-lantern-glow-soft/30 shadow-sm",
        isUser && "bg-gradient-to-br from-primary/20 to-primary/10"
      )}>
        {isAssistant ? (
          <Lamp className="h-4 w-4 text-lantern-glow" />
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[80%] md:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Name Label */}
        <span className={cn(
          "text-xs font-medium mb-1.5 px-1",
          isAssistant ? "text-lantern-glow" : "text-primary"
        )}>
          {isAssistant ? "Lantern" : "You"}
        </span>

        {/* Bubble */}
        <div
          className={cn(
            "relative px-4 py-3 rounded-2xl transition-all duration-300",
            isAssistant && [
              "bg-card border border-border/50",
              "rounded-tl-md",
              "shadow-sm hover:shadow-md",
              isLatest && "ring-1 ring-primary/20"
            ],
            isUser && [
              "bg-gradient-to-br from-primary to-primary/90",
              "text-primary-foreground",
              "rounded-tr-md",
              "shadow-md"
            ]
          )}
        >
          {/* Message Text */}
          <div className={cn(
            "text-sm md:text-base leading-relaxed",
            isAssistant && "text-foreground/90",
            isUser && "text-primary-foreground"
          )}>
            {formatMessageContent(message.content)}
          </div>

          {/* Subtle glow for assistant messages */}
          {isAssistant && isLatest && (
            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-lantern-glow/5 to-lantern-glow-soft/5 rounded-2xl blur-xl" />
          )}
        </div>

        {/* Timestamp and Status */}
        <div className={cn(
          "flex items-center gap-1.5 mt-1.5 px-1",
          isUser ? "flex-row-reverse" : "flex-row"
        )}>
          <span className="text-[10px] text-muted-foreground/60">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          {isUser && (
            <CheckCheck className="h-3 w-3 text-primary/60" />
          )}
        </div>
      </div>
    </div>
  );
};
