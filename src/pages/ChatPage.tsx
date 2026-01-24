import { useState, useRef, useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { ModeToggle, QuickTopics, type ChatMode } from "@/components/chat/ModeToggle";
import { SuggestedPrompts } from "@/components/chat/SuggestedPrompts";
import { generateLanternResponse, getMoodBasedGreeting } from "@/lib/lanternAI";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const getInitialGreeting = (): string => {
  const hour = new Date().getHours();
  const timeGreeting = getMoodBasedGreeting(hour);
  
  return `Hello! I'm Lantern, your UVic wellness companion. 🌿✨

${timeGreeting}

I'm here to help you with:
• **Mental health** - Stress, anxiety, seasonal depression
• **Social support** - Making friends, joining clubs, social anxiety
• **Accessibility** - Campus navigation, accessible routes
• **International students** - Cultural adjustment, academic norms

What's on your mind?`;
};

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: getInitialGreeting(),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("default");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Generate AI response using the unified Lantern AI system
    setTimeout(() => {
      const response = generateLanternResponse(userMessage.content, mode);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 800);
  };

  const handlePromptClick = (prompt: string) => {
    setInput(prompt);
  };

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);
    
    // Add a system message about mode change
    if (newMode !== "default") {
      const modeMessage = newMode === "accessibility" 
        ? "🦽 Accessibility mode enabled. I'll prioritize accessible routes, elevator locations, and mobility support in my responses."
        : "🌍 International student mode enabled. I'll provide extra context about Canadian culture, academic norms, and international resources.";
      
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: modeMessage,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content: getInitialGreeting(),
        timestamp: new Date(),
      },
    ]);
    setMode("default");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-20 pb-8">
        <div className="container mx-auto px-4 h-full flex flex-col max-w-4xl">
          {/* Mode Toggles */}
          <ModeToggle 
            mode={mode} 
            onModeChange={handleModeChange} 
            onNewChat={handleNewChat} 
          />

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto forest-card p-4 md:p-6 mb-4 min-h-[400px] max-h-[60vh]">
            <div className="space-y-6">
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-accent text-accent-foreground rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span className="text-sm">Lantern is thinking...</span>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Quick Topics - Show only on first message */}
          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-muted-foreground mb-3">Quick topics:</p>
              <QuickTopics onSelect={handlePromptClick} />
            </div>
          )}

          {/* Suggested Prompts - Show when few messages */}
          {messages.length > 1 && messages.length < 4 && (
            <SuggestedPrompts onPromptClick={handlePromptClick} />
          )}

          {/* Input Area */}
          <ChatInput
            value={input}
            onChange={setInput}
            onSend={handleSend}
            isLoading={isLoading}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ChatPage;
