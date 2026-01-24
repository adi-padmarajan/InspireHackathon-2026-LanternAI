import { useState, useRef, useEffect, useCallback } from "react";
import { Navigation } from "@/components/Navigation";
import { WelcomeHero } from "@/components/chat/WelcomeHero";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { ModeSelectorGrid } from "@/components/chat/ModeSelectorGrid";
import { ModeQuickPrompts } from "@/components/chat/ModeQuickPrompts";
import { FloatingModeSelector } from "@/components/chat/FloatingModeSelector";
import { EnhancedChatInput } from "@/components/chat/EnhancedChatInput";
import { type ChatMode, getModeConfig } from "@/lib/chatModes";

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
  const [mode, setMode] = useState<ChatMode>("wellness");
  const [hasStartedChat, setHasStartedChat] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessageToAI = useCallback(
    async (text: string, currentMode: ChatMode) => {
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
    (selectedMode: ChatMode, initialMessage?: string) => {
      setMode(selectedMode);
      setHasStartedChat(true);

      // Get mode-specific greeting
      const modeConfig = getModeConfig(selectedMode);

      const greetingMessage: Message = {
        id: "greeting",
        role: "assistant",
        content: modeConfig.greeting,
        timestamp: new Date(),
      };

      setMessages([greetingMessage]);

      // If there's an initial message (from quick prompt), send it after greeting
      if (initialMessage) {
        setTimeout(() => {
          sendMessageToAI(initialMessage, selectedMode);
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
      startChat(mode, text);
      setInput("");
      return;
    }

    sendMessageToAI(text, mode);
    setInput("");
  }, [input, isLoading, hasStartedChat, mode, startChat, sendMessageToAI]);

  const handleModeSelect = useCallback(
    (selectedMode: ChatMode) => {
      startChat(selectedMode);
    },
    [startChat]
  );

  const handleQuickPrompt = useCallback(
    (prompt: string) => {
      if (hasStartedChat) {
        // If chat is already started, just send the message
        sendMessageToAI(prompt, mode);
      }
    },
    [hasStartedChat, mode, sendMessageToAI]
  );

  const handleModeChange = (newMode: ChatMode) => {
    setMode(newMode);

    if (hasStartedChat) {
      const modeConfig = getModeConfig(newMode);
      const systemMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: `I've switched to **${modeConfig.label}** mode. ${modeConfig.description}.\n\nHow can I help you now?`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setHasStartedChat(false);
    setMode("wellness");
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
              /* Welcome State with Mode Selection */
              <div className="h-full flex flex-col py-6">
                <WelcomeHero />
                <div className="flex-1 pb-4 mt-6">
                  <ModeSelectorGrid onSelectMode={handleModeSelect} />
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

                {/* Show quick prompts after greeting */}
                {messages.length === 1 &&
                  messages[0].role === "assistant" &&
                  !isLoading && (
                    <div className="mt-4">
                      <ModeQuickPrompts
                        mode={mode}
                        onSelectPrompt={handleQuickPrompt}
                      />
                    </div>
                  )}

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
