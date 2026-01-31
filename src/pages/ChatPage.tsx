import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { WelcomeHero } from "@/components/chat/WelcomeHero";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { EnhancedChatInput } from "@/components/chat/EnhancedChatInput";
import { TrustedResources } from "@/components/chat/TrustedResources";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FilmGrain, CinematicVignette, AmbientGradients } from "@/components/FilmGrain";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeather } from "@/hooks/useWeather";
import { useIsMobile } from "@/hooks/use-mobile";
import { pageVariants, springPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8000";
const DEFAULT_MODE = "wellness";

const PROFILE_KEY = "lantern_companion_profile";
const MEMORY_KEY = "lantern_companion_memory";
const FOLLOWUP_KEY = "lantern_companion_followup";
const SESSION_ID_KEY = "lantern_session_id";
const FOLLOW_UP_DELAY_MS = 4 * 60 * 60 * 1000;

type OnboardingStep = "name" | "vibe" | "handshake" | "ready";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface CompanionProfile {
  name?: string;
  vibe?: "jokester" | "cozy" | "balanced";
  drink?: string;
  onboardingComplete?: boolean;
}

interface CompanionMemory {
  lastTopic?: string;
  lastGoal?: string;
  lastInteractionAt?: number;
}

interface FollowUpPayload {
  dueAt: number;
  message: string;
}

const ONBOARDING_PROMPTS = {
  name: "Hey! I'm Lantern. I've been looking forward to meeting you. What should I call you?",
  vibe: (name?: string) =>
    `Nice to meet you${name ? `, ${name}` : ""}. Do you like someone who's a bit of a jokester, or more of a "warm tea and fuzzy blankets" kind of energy?`,
  handshake: 'Serious question: Coffee, tea, or "I\'m just naturally caffeinated"?',
};

const parseStored = <T,>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
};

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const createMessage = (role: Message["role"], content: string): Message => ({
  id: createId(),
  role,
  content,
  timestamp: new Date(),
});

const normalizeName = (text: string) => {
  const cleaned = text.replace(/[^a-zA-Z\s'-]/g, " ").trim();
  const name = cleaned.split(/\s+/)[0];
  if (!name) return "friend";
  return name.charAt(0).toUpperCase() + name.slice(1);
};

const detectVibe = (text: string): CompanionProfile["vibe"] => {
  const lower = text.toLowerCase();
  if (lower.includes("joke") || lower.includes("fun") || lower.includes("playful")) return "jokester";
  if (lower.includes("tea") || lower.includes("cozy") || lower.includes("warm") || lower.includes("blanket")) return "cozy";
  return "balanced";
};

const detectDrink = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes("coffee")) return "coffee";
  if (lower.includes("tea")) return "tea";
  if (lower.includes("caffeinated")) return "naturally caffeinated";
  return text.trim();
};

const extractMemoryUpdate = (text: string): Partial<CompanionMemory> => {
  const trimmed = text.trim();
  if (trimmed.length < 6) return {};

  const goalMatch = trimmed.match(/(?:i need to|i want to|i'm trying to|i have to|i'm nervous about|i'm excited about)\s+(.+)/i);
  const lastGoal = goalMatch?.[1]?.slice(0, 120);

  return {
    lastTopic: trimmed.length > 140 ? `${trimmed.slice(0, 140)}…` : trimmed,
    ...(lastGoal ? { lastGoal } : {}),
    lastInteractionAt: Date.now(),
  };
};

const buildFollowUpMessage = ({
  profile,
  memory,
  weather,
}: {
  profile: CompanionProfile;
  memory: CompanionMemory;
  weather: { description: string } | null;
}) => {
  const name = profile.name ? `, ${profile.name}` : "";
  if (memory.lastGoal) {
    return `Hey${name}. I was just thinking about ${memory.lastGoal}. How did it go?`;
  }
  if (memory.lastTopic) {
    return `Hey${name}. I was thinking about what you shared earlier. Want to pick it up from there?`;
  }
  if (weather?.description) {
    return `Hey${name}. It looks like ${weather.description.toLowerCase()} today. How's your day feeling?`;
  }
  return `Hey${name}. Just checking in. How are you holding up today?`;
};

const getSessionId = () => {
  if (typeof window === "undefined") return "session";
  const stored = localStorage.getItem(SESSION_ID_KEY);
  if (stored) return stored;
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  localStorage.setItem(SESSION_ID_KEY, id);
  return id;
};

const ChatPage = () => {
  const { currentBackground } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { weather } = useWeather();
  const initialProfile = parseStored<CompanionProfile>(
    typeof window === "undefined" ? null : localStorage.getItem(PROFILE_KEY),
    {}
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [profile, setProfile] = useState<CompanionProfile>(initialProfile);
  const [memory, setMemory] = useState<CompanionMemory>(
    parseStored<CompanionMemory>(
      typeof window === "undefined" ? null : localStorage.getItem(MEMORY_KEY),
      {}
    )
  );
  const [onboardingStep, setOnboardingStep] = useState<OnboardingStep>(
    initialProfile.onboardingComplete ? "ready" : "name"
  );

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const followUpTimeoutRef = useRef<number | null>(null);
  const sessionId = useMemo(() => getSessionId(), []);

  const hasCustomBackground =
    currentBackground?.enabled &&
    (currentBackground?.image || currentBackground?.wallpaper);

  const initialPrompt = useMemo(() => {
    if (initialProfile.onboardingComplete) {
      const name = initialProfile.name || user?.display_name;
      return `Welcome back${name ? `, ${name}` : ""}. What's on your mind today?`;
    }
    return ONBOARDING_PROMPTS.name;
  }, [initialProfile.onboardingComplete, initialProfile.name, user?.display_name]);

  useEffect(() => {
    if (messages.length === 0) {
      setMessages([createMessage("assistant", initialPrompt)]);
    }
  }, [initialPrompt, messages.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(MEMORY_KEY, JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    if (isAuthenticated && user?.display_name && !profile.name) {
      setProfile((prev) => ({ ...prev, name: user.display_name }));
    }
  }, [isAuthenticated, user?.display_name, profile.name]);

  useEffect(() => {
    const stored = parseStored<FollowUpPayload | null>(
      typeof window === "undefined" ? null : localStorage.getItem(FOLLOWUP_KEY),
      null
    );
    if (!stored) return;

    const remaining = stored.dueAt - Date.now();
    if (remaining <= 0) {
      setMessages((prev) => [...prev, createMessage("assistant", stored.message)]);
      if (typeof window !== "undefined") {
        localStorage.removeItem(FOLLOWUP_KEY);
      }
      return;
    }

    followUpTimeoutRef.current = window.setTimeout(() => {
      setMessages((prev) => [...prev, createMessage("assistant", stored.message)]);
      localStorage.removeItem(FOLLOWUP_KEY);
    }, remaining);

    return () => {
      if (followUpTimeoutRef.current) {
        window.clearTimeout(followUpTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const appendMessage = useCallback((message: Message) => {
    setMessages((prev) => [...prev, message]);
  }, []);

  const addAssistantMessage = useCallback(
    (content: string) => appendMessage(createMessage("assistant", content)),
    [appendMessage]
  );

  const addUserMessage = useCallback(
    (content: string) => appendMessage(createMessage("user", content)),
    [appendMessage]
  );

  const scheduleFollowUp = useCallback(
    (nextMemory: CompanionMemory) => {
      if (typeof window === "undefined") return;
      const message = buildFollowUpMessage({ profile, memory: nextMemory, weather });
      const payload: FollowUpPayload = {
        dueAt: Date.now() + FOLLOW_UP_DELAY_MS,
        message,
      };
      localStorage.setItem(FOLLOWUP_KEY, JSON.stringify(payload));

      if (followUpTimeoutRef.current) {
        window.clearTimeout(followUpTimeoutRef.current);
      }
      followUpTimeoutRef.current = window.setTimeout(() => {
        addAssistantMessage(message);
        localStorage.removeItem(FOLLOWUP_KEY);
      }, FOLLOW_UP_DELAY_MS);
    },
    [addAssistantMessage, profile, weather]
  );

  const sendMessageToAI = useCallback(
    async (text: string, memorySnapshot?: CompanionMemory) => {
      setIsLoading(true);

      const profilePayload = {
        preferred_name: profile.name,
        vibe: profile.vibe,
        drink: profile.drink,
      };

      const memoryPayload = memorySnapshot ?? memory;

      try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text.trim(),
            mode: DEFAULT_MODE,
            session_id: sessionId,
            profile: profilePayload,
            memory: {
              last_topic: memoryPayload.lastTopic,
              last_goal: memoryPayload.lastGoal,
              last_interaction_at: memoryPayload.lastInteractionAt,
            },
          }),
        });

        const data = await response.json();

        addAssistantMessage(
          data.data?.message || "I'm here with you. Want to try saying that another way?"
        );
      } catch (error) {
        console.error("Error calling chat API:", error);
        addAssistantMessage(
          "I'm having trouble connecting right now. Please make sure the backend server is running on localhost:8000."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [memory, profile, sessionId, addAssistantMessage]
  );

  const handleOnboardingResponse = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      addUserMessage(trimmed);

      if (onboardingStep === "name") {
        const name = normalizeName(trimmed);
        setProfile((prev) => ({ ...prev, name }));
        addAssistantMessage(ONBOARDING_PROMPTS.vibe(name));
        setOnboardingStep("vibe");
        return;
      }

      if (onboardingStep === "vibe") {
        const vibe = detectVibe(trimmed);
        setProfile((prev) => ({ ...prev, vibe }));
        addAssistantMessage(ONBOARDING_PROMPTS.handshake);
        setOnboardingStep("handshake");
        return;
      }

      if (onboardingStep === "handshake") {
        const drink = detectDrink(trimmed);
        const name = profile.name || user?.display_name || "friend";
        const vibe = profile.vibe;
        const vibeLine =
          vibe === "jokester"
            ? "I'll keep things playful when it fits."
            : vibe === "cozy"
              ? "I'll keep things warm and gentle."
              : "I'll keep things warm, steady, and flexible.";
        const drinkLine = drink ? `Noted on the ${drink}.` : "";

        setProfile((prev) => ({
          ...prev,
          drink,
          onboardingComplete: true,
        }));
        addAssistantMessage(
          `Love it, ${name}. ${vibeLine} ${drinkLine} What's on your mind today?`
        );
        setOnboardingStep("ready");
      }
    },
    [addAssistantMessage, addUserMessage, onboardingStep, profile.name, profile.vibe, user?.display_name]
  );

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text || isLoading) return;

    if (onboardingStep !== "ready") {
      handleOnboardingResponse(text);
      setInput("");
      return;
    }

    addUserMessage(text);
    const memoryUpdate = extractMemoryUpdate(text);
    const nextMemory = { ...memory, ...memoryUpdate };
    setMemory(nextMemory);
    scheduleFollowUp(nextMemory);
    sendMessageToAI(text, nextMemory);
    setInput("");
  }, [input, isLoading, onboardingStep, handleOnboardingResponse, addUserMessage, memory, scheduleFollowUp, sendMessageToAI]);

  const handleQuickSelect = useCallback(
    (value: string) => {
      if (isLoading) return;
      handleOnboardingResponse(value);
    },
    [handleOnboardingResponse, isLoading]
  );

  const onboardingOptions =
    onboardingStep === "vibe"
      ? [
          { label: "Jokester energy", value: "jokester" },
          { label: "Warm tea energy", value: "warm tea and fuzzy blankets" },
          { label: "A bit of both", value: "a bit of both" },
        ]
      : onboardingStep === "handshake"
        ? [
            { label: "Coffee", value: "coffee" },
            { label: "Tea", value: "tea" },
            { label: "Naturally caffeinated", value: "naturally caffeinated" },
          ]
        : null;

  const showWelcomeHero = onboardingStep !== "ready" && messages.length <= 2;
  const inputPlaceholder =
    onboardingStep === "name"
      ? "What should I call you?"
      : onboardingStep === "vibe"
        ? "Jokester or warm tea energy?"
        : onboardingStep === "handshake"
          ? "Coffee, tea, or naturally caffeinated?"
          : "Share what's on your mind...";

  const isMobile = useIsMobile();

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
      {/* Cinematic layers */}
      {!hasCustomBackground && <AmbientBackground />}
      <AmbientGradients />
      <CinematicVignette intensity={0.3} />
      <FilmGrain opacity={0.02} />

      {/* Edge gradients */}
      {!hasCustomBackground && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background/90 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <Navigation />

      <main className="flex-1 pt-16 flex relative z-10">
        {/* Split layout container */}
        <div className="flex-1 flex max-w-7xl mx-auto w-full">
          {/* Chat conversation - Left side */}
          <div className="flex-1 flex flex-col min-w-0">
            <div
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto chat-scroll px-4 md:px-8 lg:px-12"
            >
              <motion.div
                className="py-8 space-y-6 max-w-2xl mx-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                {showWelcomeHero && <WelcomeHero />}

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

                {onboardingOptions && (
                  <motion.div
                    className="flex flex-wrap gap-3 pt-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    {onboardingOptions.map((option) => (
                      <motion.button
                        key={option.label}
                        onClick={() => handleQuickSelect(option.value)}
                        className={cn(
                          "px-4 py-2 rounded-full text-sm",
                          "border border-border/60 bg-card/60 backdrop-blur-sm",
                          "text-foreground/80 hover:text-foreground",
                          "hover:bg-card/80 hover:border-border",
                          "transition-all duration-300"
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        {option.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </motion.div>
            </div>

            {/* Input area */}
            <motion.div
              className="sticky bottom-0 px-4 md:px-8 lg:px-12 pb-6 pt-4 bg-gradient-to-t from-background via-background/95 to-transparent"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, ...springPresets.gentle }}
            >
              <div className="max-w-2xl mx-auto">
                <EnhancedChatInput
                  value={input}
                  onChange={setInput}
                  onSend={handleSend}
                  isLoading={isLoading}
                  placeholder={inputPlaceholder}
                />
              </div>
            </motion.div>
          </div>

          {/* Resources sidebar - Right side (desktop only) */}
          {!isMobile && (
            <motion.aside
              className="hidden lg:block w-80 xl:w-96 shrink-0 border-l border-border/30 p-6 overflow-y-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <TrustedResources />
            </motion.aside>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default ChatPage;
