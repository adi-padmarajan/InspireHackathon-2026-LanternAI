import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { WelcomeHero } from "@/components/chat/WelcomeHero";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { EnhancedChatInput } from "@/components/chat/EnhancedChatInput";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useTheme } from "@/contexts/ThemeContext";
import { pageVariants, springPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8000";
const DEFAULT_MODE = "wellness";

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
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const { currentBackground } = useTheme();

  // Check if custom background (image or wallpaper) is active
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = useCallback(
    async (text: string) => {
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
            mode: DEFAULT_MODE,
          }),
        });

        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            data.data?.message ||
            "I'm here to help! Could you try rephrasing that?",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Error calling chat API:", error);
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            "I'm having trouble connecting right now. Please make sure the backend server is running on localhost:8000.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const startChat = useCallback(
    (initialMessage?: string) => {
      setHasStartedChat(true);

      const greetingMessage: Message = {
        id: "greeting",
        role: "assistant",
        content: "Hi, I’m Lantern. I’m here to listen and support you. What’s on your mind?",
        timestamp: new Date(),
      };

      setMessages([greetingMessage]);

      // If there's an initial message (from quick prompt), send it after greeting
      if (initialMessage) {
        setTimeout(() => {
          sendMessageToAI(initialMessage);
        }, 500);
      }
    },
    [sendMessageToAI]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;

    // Start chat if not started (using current mode)
    if (!hasStartedChat) {
      startChat(text);
      setInput("");
      return;
    }

    sendMessageToAI(text);
    setInput("");
  }, [input, isLoading, hasStartedChat, startChat, sendMessageToAI]);

  return (
    <motion.div
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Theme-aware ambient background - hide when custom background is active */}
      {!hasCustomBackground && <AmbientBackground />}

      {/* Cinematic gradient overlays for depth */}
      {!hasCustomBackground && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background/80 via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/40 to-transparent" />
        </div>
      )}

      <Navigation />

      {/* Main Chat Container */}
      <main className="flex-1 pt-16 flex flex-col relative z-10">
        <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full">
          {/* Chat Content Area */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto chat-scroll px-4 md:px-6"
          >
            <AnimatePresence mode="wait">
              {!hasStartedChat ? (
                /* Welcome State with Mode Selection */
                <motion.div
                  key="welcome"
                  className="h-full flex flex-col py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <WelcomeHero />
                </motion.div>
              ) : (
                /* Chat Messages */
                <motion.div
                  key="chat"
                  className="py-6 space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <AnimatePresence>
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
                  </AnimatePresence>

                  <AnimatePresence>
                    {isLoading && <TypingIndicator />}
                  </AnimatePresence>

                  <div ref={messagesEndRef} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Input Area - Fixed at bottom */}
          <motion.div
            className="sticky bottom-0 p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent pt-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, ...springPresets.gentle }}
          >
            <EnhancedChatInput
              value={input}
              onChange={setInput}
              onSend={handleSend}
              isLoading={isLoading}
            />
          </motion.div>
        </div>
      </main>
    </motion.div>
  );
};

export default ChatPage;
