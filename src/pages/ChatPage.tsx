import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { WelcomeHero } from "@/components/chat/WelcomeHero";
import { ChatBubble } from "@/components/chat/ChatBubble";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { EnhancedChatInput } from "@/components/chat/EnhancedChatInput";
import { TrustedResources } from "@/components/chat/TrustedResources";
import { SeasonalBanner } from "@/components/SeasonalBanner";
import { PersonalizationPill } from "@/components/PersonalizationPill";
import { RepeatRoutineChip } from "@/components/RepeatRoutineChip";
import { FeedbackPrompt } from "@/components/FeedbackPrompt";
import { ActionScriptPanel } from "@/components/ActionScriptPanel";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FilmGrain, CinematicVignette, AmbientGradients } from "@/components/FilmGrain";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeather } from "@/hooks/useWeather";
import { usePreferences } from "@/hooks/usePreferences";
import { useSeasonal } from "@/hooks/useSeasonal";
import { useEvents } from "@/hooks/useEvents";
import { useIsMobile } from "@/hooks/use-mobile";
import { pageVariants, springPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

const API_BASE_URL = "http://localhost:8000";

const PROFILE_KEY = "lantern_companion_profile";
const MEMORY_KEY = "lantern_companion_memory";
const FOLLOWUP_KEY = "lantern_companion_followup";
const SESSION_ID_KEY = "lantern_session_id";
const PLAYBOOK_STATE_KEY = "lantern_playbook_state";
const FOLLOW_UP_DELAY_MS = 4 * 60 * 60 * 1000;
const RESPONSE_DELAY_MS = 1000;

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

type PlaybookStage = "vent" | "triage" | "plan";

interface PlaybookState {
  playbook_id?: string;
  stage?: PlaybookStage;
  context?: Record<string, unknown> | null;
}

interface ResourceCard {
  id: string;
  name: string;
  description: string;
  categories: string[];
  url?: string;
  location?: string | null;
}

interface PlaybookResponse {
  playbook_id: string;
  stage: PlaybookStage;
  validation: string;
  triage_question?: string | null;
  action_title: string;
  actions: string[];
  resource_ids: string[];
  resources: ResourceCard[];
  next_state: PlaybookState;
}

const PLAYBOOK_CHIPS = [
  { id: "overwhelmed", label: "Overwhelmed", prompt: "I'm feeling overwhelmed with school right now." },
  { id: "anxious", label: "Anxious", prompt: "I'm feeling anxious and on edge." },
  { id: "lonely", label: "Lonely", prompt: "I'm feeling lonely and disconnected." },
  { id: "burnout", label: "Burnout", prompt: "I'm burned out and exhausted." },
] as const;

const CRISIS_PATTERNS: RegExp[] = [
  /\bsuicide\b/i,
  /\bsuicidal\b/i,
  /\bkill myself\b/i,
  /\bend my life\b/i,
  /\bwant to die\b/i,
  /\bdon't want to live\b/i,
  /\bdo not want to live\b/i,
  /\bdont want to live\b/i,
  /\bself[- ]?harm\b/i,
  /\bhurt myself\b/i,
  /\bcut myself\b/i,
  /\boverdose\b/i,
  /\bend it all\b/i,
  /\bending it all\b/i,
  /\btake my life\b/i,
  /\bwish i was dead\b/i,
  /\bcan't go on\b/i,
  /\bcant go on\b/i,
  /\bno reason to live\b/i,
];

const isCrisisText = (text: string) => {
  const trimmed = text.trim();
  if (!trimmed) return false;
  return CRISIS_PATTERNS.some((pattern) => pattern.test(trimmed));
};

const wait = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const NEXT_STEP_CHIPS: Record<PlaybookStage, Array<{ id: string; label: string; prompt?: string }>> = {
  vent: [
    { id: "academics", label: "Academics", prompt: "It's mostly academics." },
    { id: "personal", label: "Personal", prompt: "It's mostly personal stuff." },
    { id: "everything", label: "Everything", prompt: "It feels like everything at once." },
  ],
  triage: [
    { id: "today", label: "Mini plan today", prompt: "A mini plan for today would help." },
    { id: "week", label: "Mini plan week", prompt: "A mini plan for this week would help." },
    { id: "onestep", label: "Just one step", prompt: "Just one small next step please." },
  ],
  plan: [
    { id: "another", label: "Another step", prompt: "Can you give me one more small step?" },
    { id: "resources", label: "Resources", prompt: "Any campus resources for this?" },
    { id: "reset", label: "Reset", prompt: undefined },
  ],
};

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
  if (isCrisisText(trimmed)) {
    return { lastInteractionAt: Date.now() };
  }

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
  const safeGoal = memory.lastGoal && !isCrisisText(memory.lastGoal) ? memory.lastGoal : null;
  const safeTopic = memory.lastTopic && !isCrisisText(memory.lastTopic) ? memory.lastTopic : null;
  if (safeGoal) {
    return `Hey${name}. I was just thinking about ${safeGoal}. How did it go?`;
  }
  if (safeTopic) {
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
  const { preferences, getPersonalization } = usePreferences();
  const { seasonalContext, refreshSeasonal } = useSeasonal(preferences?.coping_style ?? null);
  const { logRoutineUsed, logRoutineRepeated } = useEvents();
  const initialProfile = parseStored<CompanionProfile>(
    typeof window === "undefined" ? null : localStorage.getItem(PROFILE_KEY),
    {}
  );

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const initialPlaybookState = parseStored<PlaybookState | null>(
    typeof window === "undefined" ? null : localStorage.getItem(PLAYBOOK_STATE_KEY),
    null
  );
  const [playbookState, setPlaybookState] = useState<PlaybookState | null>(initialPlaybookState);
  const [suggestedResources, setSuggestedResources] = useState<ResourceCard[]>([]);
  const [repeatSuggestion, setRepeatSuggestion] = useState<{
    routineId: string;
    message?: string | null;
    playbookId: string;
  } | null>(null);
  const [feedbackTarget, setFeedbackTarget] = useState<{
    routineId: string;
    playbookId?: string;
    actionId?: string;
  } | null>(null);
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

  const seasonalWeatherPayload = useMemo(() => {
    if (!weather) return undefined;
    return {
      description: weather.description,
      temperature: weather.temperature,
      condition: weather.condition,
    };
  }, [weather]);

  useEffect(() => {
    void refreshSeasonal(seasonalWeatherPayload, preferences?.coping_style ?? null);
  }, [preferences?.coping_style, refreshSeasonal, seasonalWeatherPayload]);

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
    if (typeof window === "undefined") return;
    if (playbookState) {
      localStorage.setItem(PLAYBOOK_STATE_KEY, JSON.stringify(playbookState));
    } else {
      localStorage.removeItem(PLAYBOOK_STATE_KEY);
    }
  }, [playbookState]);

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
    if (isCrisisText(stored.message)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem(FOLLOWUP_KEY);
      }
      return;
    }

    const remaining = stored.dueAt - Date.now();
    if (remaining <= 0) {
      void addAssistantMessageWithDelay(stored.message);
      if (typeof window !== "undefined") {
        localStorage.removeItem(FOLLOWUP_KEY);
      }
      return;
    }

    followUpTimeoutRef.current = window.setTimeout(() => {
      void addAssistantMessageWithDelay(stored.message);
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

  const addAssistantMessageWithDelay = useCallback(
    async (content: string) => {
      await wait(RESPONSE_DELAY_MS);
      addAssistantMessage(content);
    },
    [addAssistantMessage]
  );

  const addUserMessage = useCallback(
    (content: string) => appendMessage(createMessage("user", content)),
    [appendMessage]
  );

  const resetPlaybook = useCallback(() => {
    setPlaybookState(null);
    setSuggestedResources([]);
    setRepeatSuggestion(null);
    setFeedbackTarget(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem(PLAYBOOK_STATE_KEY);
    }
  }, []);

  const formatPlaybookMessage = useCallback((payload: PlaybookResponse) => {
    const lines: string[] = [];
    if (payload.validation) {
      lines.push(payload.validation.trim());
    }
    if (payload.triage_question) {
      lines.push("", payload.triage_question.trim());
    }
    if (payload.action_title) {
      lines.push("", `**${payload.action_title}**`);
    }
    if (payload.actions?.length) {
      payload.actions.forEach((action) => {
        if (action) {
          lines.push(`• ${action}`);
        }
      });
    }
    return lines.join("\n");
  }, []);

  const scheduleFollowUp = useCallback(
    (nextMemory: CompanionMemory) => {
      if (typeof window === "undefined") return;
      if (
        (nextMemory.lastGoal && isCrisisText(nextMemory.lastGoal)) ||
        (nextMemory.lastTopic && isCrisisText(nextMemory.lastTopic))
      ) {
        return;
      }
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
        void addAssistantMessageWithDelay(message);
        localStorage.removeItem(FOLLOWUP_KEY);
      }, FOLLOW_UP_DELAY_MS);
    },
    [addAssistantMessageWithDelay, profile, weather]
  );

  const clearFollowUp = useCallback(() => {
    if (followUpTimeoutRef.current) {
      window.clearTimeout(followUpTimeoutRef.current);
      followUpTimeoutRef.current = null;
    }
    if (typeof window !== "undefined") {
      localStorage.removeItem(FOLLOWUP_KEY);
    }
  }, []);

  const sendMessageToPlaybook = useCallback(
    async (
      text: string,
      memorySnapshot?: CompanionMemory,
      stateOverride?: PlaybookState
    ) => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/api/playbooks/run`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: text.trim(),
            state: stateOverride ?? playbookState ?? undefined,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data?.data) {
          throw new Error(data?.error || "Playbook request failed");
        }

        const payload = data.data as PlaybookResponse;
        await wait(RESPONSE_DELAY_MS);
        if (payload.playbook_id === "crisis") {
          clearFollowUp();
        }
        if (payload.playbook_id === "gemini") {
          setPlaybookState(null);
          setSuggestedResources([]);
          setRepeatSuggestion(null);
          setFeedbackTarget(null);
        } else if (payload.playbook_id === "crisis") {
          setPlaybookState(payload.next_state ?? null);
          setSuggestedResources(payload.resources ?? []);
          setRepeatSuggestion(null);
          setFeedbackTarget(null);
        } else {
          setPlaybookState(payload.next_state ?? null);
          setSuggestedResources(payload.resources ?? []);

          if (payload.stage === "plan") {
            const routineId = `${payload.playbook_id}-plan`;
            setFeedbackTarget({ routineId, playbookId: payload.playbook_id });
            void logRoutineUsed(routineId, payload.playbook_id, false);
          } else {
            setFeedbackTarget(null);
          }

          const personalization = await getPersonalization(payload.playbook_id);
          if (personalization?.suggested_routine_id) {
            setRepeatSuggestion({
              routineId: personalization.suggested_routine_id,
              message: personalization.repeat_suggestion,
              playbookId: payload.playbook_id,
            });
          } else {
            setRepeatSuggestion(null);
          }
        }
        addAssistantMessage(formatPlaybookMessage(payload));
      } catch (error) {
        console.error("Error calling playbook API:", error);
        await addAssistantMessageWithDelay(
          "I'm having trouble reaching the playbook engine right now. Please try again in a moment."
        );
      } finally {
        setIsLoading(false);
      }
    },
    [
      addAssistantMessage,
      addAssistantMessageWithDelay,
      clearFollowUp,
      formatPlaybookMessage,
      getPersonalization,
      logRoutineUsed,
      playbookState,
    ]
  );

  const handleOnboardingResponse = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;

      addUserMessage(trimmed);

      if (onboardingStep === "name") {
        const name = normalizeName(trimmed);
        setProfile((prev) => ({ ...prev, name }));
        void addAssistantMessageWithDelay(ONBOARDING_PROMPTS.vibe(name));
        setOnboardingStep("vibe");
        return;
      }

      if (onboardingStep === "vibe") {
        const vibe = detectVibe(trimmed);
        setProfile((prev) => ({ ...prev, vibe }));
        void addAssistantMessageWithDelay(ONBOARDING_PROMPTS.handshake);
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
        resetPlaybook();
        void addAssistantMessageWithDelay(
          `Love it, ${name}. ${vibeLine} ${drinkLine} What's on your mind today?`
        );
        setOnboardingStep("ready");
      }
    },
    [
      addAssistantMessageWithDelay,
      addUserMessage,
      onboardingStep,
      profile.name,
      profile.vibe,
      resetPlaybook,
      user?.display_name,
    ]
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
    if (isCrisisText(text)) {
      clearFollowUp();
    } else {
      scheduleFollowUp(nextMemory);
    }
    sendMessageToPlaybook(text, nextMemory);
    setInput("");
  }, [
    input,
    isLoading,
    onboardingStep,
    handleOnboardingResponse,
    addUserMessage,
    clearFollowUp,
    memory,
    scheduleFollowUp,
    sendMessageToPlaybook,
  ]);

  const handlePlaybookChip = useCallback(
    (chip: (typeof PLAYBOOK_CHIPS)[number]) => {
      if (isLoading || onboardingStep !== "ready") return;
      const message = chip.prompt;
      const overrideState: PlaybookState = {
        playbook_id: chip.id,
        stage: "vent",
        context: null,
      };
      addUserMessage(message);
      const memoryUpdate = extractMemoryUpdate(message);
      const nextMemory = { ...memory, ...memoryUpdate };
      setMemory(nextMemory);
      if (isCrisisText(message)) {
        clearFollowUp();
      } else {
        scheduleFollowUp(nextMemory);
      }
      sendMessageToPlaybook(message, nextMemory, overrideState);
    },
    [
      addUserMessage,
      clearFollowUp,
      isLoading,
      memory,
      onboardingStep,
      scheduleFollowUp,
      sendMessageToPlaybook,
    ]
  );

  const handleNextStepChip = useCallback(
    (chip: { id: string; label: string; prompt?: string }) => {
      if (isLoading || onboardingStep !== "ready") return;
      if (chip.id === "reset") {
        resetPlaybook();
        return;
      }
      if (!chip.prompt) return;
      addUserMessage(chip.prompt);
      const memoryUpdate = extractMemoryUpdate(chip.prompt);
      const nextMemory = { ...memory, ...memoryUpdate };
      setMemory(nextMemory);
      if (isCrisisText(chip.prompt)) {
        clearFollowUp();
      } else {
        scheduleFollowUp(nextMemory);
      }
      sendMessageToPlaybook(chip.prompt, nextMemory);
    },
    [
      addUserMessage,
      clearFollowUp,
      isLoading,
      memory,
      onboardingStep,
      resetPlaybook,
      scheduleFollowUp,
      sendMessageToPlaybook,
    ]
  );

  const handleRepeatRoutine = useCallback(() => {
    if (!repeatSuggestion || isLoading || onboardingStep !== "ready") return;
    const message = "Let's repeat that routine.";
    addUserMessage(message);
    const memoryUpdate = extractMemoryUpdate(message);
    const nextMemory = { ...memory, ...memoryUpdate };
    setMemory(nextMemory);
    if (isCrisisText(message)) {
      clearFollowUp();
    } else {
      scheduleFollowUp(nextMemory);
    }
    void logRoutineRepeated(repeatSuggestion.routineId, repeatSuggestion.playbookId);
    sendMessageToPlaybook(message, nextMemory, {
      playbook_id: repeatSuggestion.playbookId,
      stage: "plan",
      context: playbookState?.context ?? null,
    });
  }, [
    addUserMessage,
    clearFollowUp,
    isLoading,
    logRoutineRepeated,
    memory,
    onboardingStep,
    playbookState?.context,
    repeatSuggestion,
    scheduleFollowUp,
    sendMessageToPlaybook,
  ]);

  const playbookIndicator = useMemo(() => {
    if (!playbookState?.playbook_id) return null;
    const name = playbookState.playbook_id
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");
    const stageLabel = playbookState.stage
      ? playbookState.stage.charAt(0).toUpperCase() + playbookState.stage.slice(1)
      : "Vent";
    return { name, stageLabel };
  }, [playbookState?.playbook_id, playbookState?.stage]);

  const nextStepChips = useMemo(() => {
    if (!playbookState?.stage || playbookState.playbook_id === "crisis") return [];
    return NEXT_STEP_CHIPS[playbookState.stage] || [];
  }, [playbookState?.playbook_id, playbookState?.stage]);

  const handleQuickSelect = useCallback(
    (value: string) => {
      if (isLoading) return;
      handleOnboardingResponse(value);
    },
    [handleOnboardingResponse, isLoading]
  );

  const handleSeasonalSuggestion = useCallback(
    (suggestionId: string) => {
      if (!seasonalContext) return;
      const suggestion = seasonalContext.suggestions.find((item) => item.id === suggestionId);
      if (!suggestion) return;
      setInput(suggestion.text);
    },
    [seasonalContext]
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
                {seasonalContext && (
                  <motion.div
                    className="rounded-2xl bg-card/60 border border-border/40 p-4 backdrop-blur-sm"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    <SeasonalBanner
                      context={seasonalContext}
                      onSunsetClick={() => setInput("Quick loop before it gets dark.")}
                      onSuggestionClick={handleSeasonalSuggestion}
                      showSuggestions
                    />
                  </motion.div>
                )}

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

                {onboardingStep === "ready" && playbookState?.playbook_id && nextStepChips.length > 0 && (
                  <motion.div
                    className="flex flex-wrap gap-2 pt-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    {nextStepChips.map((chip) => (
                      <motion.button
                        key={chip.id}
                        onClick={() => handleNextStepChip(chip)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs md:text-sm",
                          "border border-border/60 bg-card/70 backdrop-blur-sm",
                          "text-foreground/80 hover:text-foreground",
                          "hover:bg-card/90 hover:border-border",
                          "transition-all duration-300"
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {repeatSuggestion && onboardingStep === "ready" && (
                  <motion.div
                    className="pt-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    <RepeatRoutineChip
                      routineId={repeatSuggestion.routineId}
                      message={repeatSuggestion.message ?? undefined}
                      onRepeat={handleRepeatRoutine}
                    />
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

                {onboardingStep === "ready" && (
                  <motion.div
                    className="mt-4 flex flex-wrap gap-2"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    {PLAYBOOK_CHIPS.map((chip) => (
                      <motion.button
                        key={chip.id}
                        onClick={() => handlePlaybookChip(chip)}
                        className={cn(
                          "px-3 py-1.5 rounded-full text-xs md:text-sm",
                          "border border-border/60 bg-card/70 backdrop-blur-sm",
                          "text-foreground/80 hover:text-foreground",
                          "hover:bg-card/90 hover:border-border",
                          "transition-all duration-300"
                        )}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        disabled={isLoading}
                      >
                        {chip.label}
                      </motion.button>
                    ))}
                  </motion.div>
                )}

                {feedbackTarget && playbookState?.playbook_id && playbookState.stage === "plan" && (
                  <motion.div
                    className="mt-4"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={springPresets.gentle}
                  >
                    <FeedbackPrompt
                      routineId={feedbackTarget.routineId}
                      playbookId={feedbackTarget.playbookId}
                      actionId={feedbackTarget.actionId}
                      onDismiss={() => setFeedbackTarget(null)}
                      showRepeat={false}
                    />
                  </motion.div>
                )}

                {playbookIndicator && (
                  <motion.div
                    className="mt-3 flex items-center justify-between text-xs text-muted-foreground/70"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                  >
                    <span className="uppercase tracking-wide">Playbook</span>
                    <div className="flex items-center gap-2">
                      <PersonalizationPill copingStyle={preferences?.coping_style ?? null} />
                      <span className="px-2 py-1 rounded-full border border-border/40 bg-card/60 text-foreground/80">
                        {playbookIndicator.name} · {playbookIndicator.stageLabel}
                      </span>
                      <button
                        type="button"
                        onClick={resetPlaybook}
                        className={cn(
                          "px-2 py-1 rounded-full border border-border/40 bg-card/40",
                          "text-muted-foreground/80 hover:text-foreground",
                          "hover:bg-card/70 transition-colors"
                        )}
                      >
                        Reset
                      </button>
                    </div>
                  </motion.div>
                )}
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
              <TrustedResources suggestedResources={suggestedResources} />
              <div className="mt-6">
                <ActionScriptPanel />
              </div>
            </motion.aside>
          )}
        </div>
      </main>
    </motion.div>
  );
};

export default ChatPage;
