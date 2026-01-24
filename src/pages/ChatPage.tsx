import { useState, useRef, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { WelcomeHero } from "@/components/chat/WelcomeHero";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { QuickActionCards } from "@/components/chat/QuickActionCards";
import { FloatingModeSelector, type ChatMode } from "@/components/chat/FloatingModeSelector";
import { EnhancedChatInput } from "@/components/chat/EnhancedChatInput";
import { getMoodBasedGreeting } from "@/lib/lanternAI";

const API_BASE_URL = "http://localhost:8000";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const ChatPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<ChatMode>("default");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = useCallback(async (text: string, currentMode: ChatMode) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text.trim(),
          mode: currentMode,
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.data?.message || "I'm here to help! Could you try rephrasing that?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error calling chat API:", error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please make sure the backend server is running on localhost:8000.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startChat = useCallback((initialMessage?: string) => {
    setHasStartedChat(true);

    // Add initial greeting from Lantern
    const hour = new Date().getHours();
    const timeGreeting = getMoodBasedGreeting(hour);

    const greetingMessage: Message = {
      id: "greeting",
      role: "assistant",
      content: `${timeGreeting}\n\nI'm Lantern, your UVic wellness companion. I'm here to listen and help with whatever you're going through - whether it's stress, making connections, navigating campus, or adjusting to life here.\n\nWhat would you like to talk about?`,
      timestamp: new Date(),
    };

    setMessages([greetingMessage]);

    // If there's an initial message (from quick action), send it after greeting
    if (initialMessage) {
      setTimeout(() => {
        sendMessageToAI(initialMessage, mode);
      }, 500);
    }
  }, [mode, sendMessageToAI]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Start chat if not started
    if (!hasStartedChat) {
      startChat(text);
      setInput("");
      return;
    }

    sendMessageToAI(text, mode);
    setInput("");
  }, [input, isLoading, hasStartedChat, mode, startChat, sendMessageToAI]);

  const handleQuickAction = useCallback((prompt: string) => {
    if (!hasStartedChat) {
      startChat(prompt);
    } else {
      setInput(prompt);
    }
  }, [hasStartedChat, startChat]);

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);

    if (hasStartedChat && newMode !== "default") {
      const modeMessages: Record<string, string> = {
        accessibility:
          "I've switched to accessibility mode. I'll prioritize accessible routes, elevator locations, and mobility support in my responses. How can I help you navigate campus?",
        international:
          "I've switched to international student mode. I'll provide extra context about Canadian culture, academic norms, and international resources. What questions do you have?",
      };

      const systemMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: modeMessages[newMode] || "",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setMode("default");
  };

  return (
    <div className="min-h-screen flex flex-col chat-ambient-bg">
      <Navigation />

      {/* Main Chat Container */}
      <main className="flex-1 pt-16 flex flex-col">
        <div className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
          {/* Mode Selector Header - Only show when chat has started */}
          {hasStartedChat && (
            <FloatingModeSelector
              mode={mode}
              onModeChange={handleModeChange}
              onNewChat={handleNewChat}
            />
          )}

          {/* Chat Content Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto chat-scroll px-4 md:px-6"
          >
            {!hasStartedChat ? (
              /* Welcome State */
              <div className="h-full flex flex-col">
                <WelcomeHero />
                <div className="flex-1 pb-4">
                  <QuickActionCards onSelect={handleQuickAction} />
                </div>
              </div>
            ) : (
              /* Chat Messages */
              <div className="py-6 space-y-6">
                {messages.map((message, index) => (
                  <ChatBubble
                    key={message.id}
                    message={message}
                    isLatest={
                      index === messages.length - 1 &&
                      message.role === "assistant"
                    }
                  />
                ))}

                {isLoading && <TypingIndicator />}

                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area - Fixed at bottom */}
          <div className="sticky bottom-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent pt-8">
            <EnhancedChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default ChatPage;
