import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage = ({ message }: ChatMessageProps) => {
  return (
    <div className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          message.role === "user"
            ? "bg-primary text-primary-foreground rounded-br-md"
            : "bg-accent text-accent-foreground rounded-bl-md"
        }`}
      >
        <div className="whitespace-pre-wrap text-sm md:text-base leading-relaxed prose prose-sm dark:prose-invert max-w-none">
          {message.content.split('\n').map((line, i) => {
            // Handle bold text
            const formattedLine = line.replace(
              /\*\*(.*?)\*\*/g,
              '<strong>$1</strong>'
            );
            
            return (
              <p 
                key={i} 
                className={`${i > 0 ? 'mt-2' : ''} ${line.startsWith('•') || line.startsWith('-') ? 'ml-2' : ''}`}
                dangerouslySetInnerHTML={{ __html: formattedLine || '&nbsp;' }}
              />
            );
          })}
        </div>
        <p className="text-xs opacity-60 mt-2">
          {formatDistanceToNow(message.timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
