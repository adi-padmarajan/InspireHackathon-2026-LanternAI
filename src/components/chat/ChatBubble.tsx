import React from "react";
import { formatDistanceToNow } from "date-fns";
import { Lamp, User, CheckCheck } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { messageVariants, springPresets } from "@/lib/animations";

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

/**
 * Parse bold markdown (**text**) into React elements safely without dangerouslySetInnerHTML.
 * This prevents XSS attacks by not using innerHTML.
 */
const parseBoldText = (text: string): React.ReactNode[] => {
  const parts: React.ReactNode[] = [];
  const regex = /\*\*(.*?)\*\*/g;
  let lastIndex = 0;
  let match;
  let keyIndex = 0;

  while ((match = regex.exec(text)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    // Add the bold text
    parts.push(
      <strong key={keyIndex++} className="font-semibold text-foreground">
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }

  // Add remaining text
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : [text];
};

const formatMessageContent = (content: string) => {
  return content.split('\n').map((line, i) => {
    // Check if it's a list item
    const isListItem = line.startsWith('•') || line.startsWith('-') || /^\d+\./.test(line);

    return (
      <p
        key={i}
        className={cn(
          i > 0 && 'mt-2',
          isListItem && 'pl-4 relative before:absolute before:left-0 before:content-[""] before:w-1.5 before:h-1.5 before:bg-primary/50 before:rounded-full before:top-2'
        )}
      >
        {line ? parseBoldText(line) : '\u00A0'}
      </p>
    );
  });
};

export const ChatBubble = ({ message, isLatest = false }: ChatBubbleProps) => {
  const isUser = message.role === "user";
  const isAssistant = message.role === "assistant";

  return (
    <motion.div
      className={cn(
        "flex gap-3 max-w-full",
        isUser ? "flex-row-reverse" : "flex-row"
      )}
      variants={isUser ? messageVariants.user : messageVariants.assistant}
      initial="hidden"
      animate="visible"
      layout
    >
      {/* Avatar with pulse on new message */}
      <motion.div
        className={cn(
          "flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300",
          isAssistant && "bg-gradient-to-br from-lantern-glow/20 to-lantern-glow-soft/30 shadow-sm",
          isUser && "bg-gradient-to-br from-primary/20 to-primary/10"
        )}
        animate={isLatest && isAssistant ? {
          scale: [1, 1.1, 1],
          boxShadow: [
            "0 0 0 0 rgba(232, 180, 95, 0)",
            "0 0 0 8px rgba(232, 180, 95, 0.2)",
            "0 0 0 0 rgba(232, 180, 95, 0)",
          ],
        } : {}}
        transition={{
          duration: 2,
          repeat: isLatest ? Infinity : 0,
          ease: "easeInOut",
        }}
      >
        {isAssistant ? (
          <Lamp className="h-4 w-4 text-lantern-glow" />
        ) : (
          <User className="h-4 w-4 text-primary" />
        )}
      </motion.div>

      {/* Message Content */}
      <div className={cn(
        "flex flex-col max-w-[80%] md:max-w-[75%]",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Name Label */}
        <motion.span
          className={cn(
            "text-xs font-medium mb-1.5 px-1",
            isAssistant ? "text-lantern-glow" : "text-primary"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {isAssistant ? "Lantern" : "You"}
        </motion.span>

        {/* Bubble */}
        <motion.div
          className={cn(
            "relative px-4 py-3 rounded-2xl",
            isAssistant && [
              "bg-card border border-border/50",
              "rounded-tl-md",
              "shadow-sm",
              isLatest && "ring-1 ring-primary/20"
            ],
            isUser && [
              "bg-gradient-to-br from-primary to-primary/90",
              "text-primary-foreground",
              "rounded-tr-md",
              "shadow-md"
            ]
          )}
          whileHover={{
            scale: 1.01,
            transition: springPresets.snappy,
          }}
        >
          {/* Message Text */}
          <div className={cn(
            "text-sm md:text-base leading-relaxed",
            isAssistant && "text-foreground/90",
            isUser && "text-primary-foreground"
          )}>
            {formatMessageContent(message.content)}
          </div>

          {/* Subtle glow for latest assistant message */}
          {isAssistant && isLatest && (
            <motion.div
              className="absolute inset-0 -z-10 bg-gradient-to-br from-lantern-glow/5 to-lantern-glow-soft/5 rounded-2xl blur-xl"
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* Timestamp and Status */}
        <motion.div
          className={cn(
            "flex items-center gap-1.5 mt-1.5 px-1",
            isUser ? "flex-row-reverse" : "flex-row"
          )}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <span className="text-[10px] text-muted-foreground/60">
            {formatDistanceToNow(message.timestamp, { addSuffix: true })}
          </span>
          {isUser && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, ...springPresets.bouncy }}
            >
              <CheckCheck className="h-3 w-3 text-primary/60" />
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
};
