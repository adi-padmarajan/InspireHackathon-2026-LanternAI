import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Smile,
  Meh,
  Frown,
  CloudRain,
  Check,
  Plus,
  X,
  Sparkles,
  Heart,
  Sun,
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FilmGrain, CinematicVignette, AmbientGradients } from "@/components/FilmGrain";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { SeasonalBanner } from "@/components/SeasonalBanner";
import { FeedbackPrompt } from "@/components/FeedbackPrompt";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeather } from "@/hooks/useWeather";
import { useSeasonal } from "@/hooks/useSeasonal";
import { usePreferences } from "@/hooks/usePreferences";
import { useEvents } from "@/hooks/useEvents";
import { api } from "@/lib/api";
import { pageVariants, springPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

const moodOptions = [
  { value: "great", label: "Great", icon: Smile, gradient: "from-emerald-500/20 to-green-500/10", iconColor: "text-emerald-500" },
  { value: "good", label: "Good", icon: Smile, gradient: "from-sky-500/20 to-blue-500/10", iconColor: "text-sky-500" },
  { value: "okay", label: "Okay", icon: Meh, gradient: "from-amber-500/20 to-yellow-500/10", iconColor: "text-amber-500" },
  { value: "low", label: "Low", icon: Frown, gradient: "from-orange-500/20 to-amber-500/10", iconColor: "text-orange-500" },
  { value: "struggling", label: "Struggling", icon: CloudRain, gradient: "from-rose-500/20 to-pink-500/10", iconColor: "text-rose-500" },
] as const;

type MoodValue = (typeof moodOptions)[number]["value"];

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

interface ResourceCard {
  id: string;
  name: string;
  description: string;
  categories: string[];
  url: string;
  location?: string | null;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
// Normalize UVic resource URLs for external links
const normalizeResourceUrl = (url: string) => {
  if (!url) return "#";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/")) return `https://www.uvic.ca${url}`;
  return `https://www.uvic.ca/${url}`;
};

// Lightweight offline fallback suggestions when backend is unavailable
function getLocalSuggestions(
  mood: MoodValue,
  note: string,
  weather?: { description?: string; condition?: string; temperature?: number; windSpeed?: number; location?: string }
) {
  const text = note?.toLowerCase() || "";
  const desc = weather?.description || "";
  const condition = (weather?.condition || "").toLowerCase();
  const temp = typeof weather?.temperature === "number" ? weather!.temperature : undefined;
  const wind = typeof weather?.windSpeed === "number" ? weather!.windSpeed : undefined;

  const isRainy = /rain|drizzle|showers/i.test(desc) || condition.includes("rain");
  const isSnowy = /snow/i.test(desc) || condition.includes("snow");
  const isStormy = /thunder|storm/i.test(desc) || condition.includes("storm");
  const isSunny = /sun|clear/i.test(desc) || condition.includes("sunny") || condition.includes("warm");
  const isVeryCold = typeof temp === "number" ? temp <= 0 : false;
  const isWindy = typeof wind === "number" ? wind >= 35 : false; // ~km/h threshold
  const hasWeather = Boolean(weather && (weather.description || weather.condition));

  const outdoorOK = hasWeather && !isSnowy && !isStormy && !isVeryCold && !isWindy && !isRainy;

  const base: Record<MoodValue, string[]> = {
    great: [
      "Capture one win in a quick journal.",
      "Share a gratitude with someone who helped you.",
      outdoorOK ? "Do a 10‑minute outside jog or brisk walk." : (isSnowy || isVeryCold ? "Try an indoor mobility or yoga flow (10 minutes)." : "Take a short stretch break or stair walk indoors."),
      "Plan one fun micro‑reward for later.",
      "Help a peer or classmate with a small task.",
    ],
    good: [
      "Pick one next action and start a 15‑minute focus sprint.",
      outdoorOK ? "Walk a campus loop for 10 minutes." : (isRainy ? "Make tea and read 2 pages indoors." : "Do 3 songs of indoor dance/cardio."),
      "Hydrate and queue an energizing playlist.",
      "Tidy your workspace for 3 minutes.",
      "Send one check‑in message to a friend.",
    ],
    okay: [
      "Write down the smallest step that would help right now.",
      "Do 4‑7‑8 breathing for 3 cycles.",
      outdoorOK ? "Get fresh air for 5 minutes." : "Try an indoor stretch or mobility routine.",
      "List two tasks and choose one to start.",
      "Eat a light snack and sip water.",
    ],
    low: [
      "Be kind to yourself—today counts even with small steps.",
      "Text someone you trust just to say hello.",
      outdoorOK ? "Light walk with gentle music." : "Warm drink + cozy corner for 10 minutes.",
      "Try box breathing: 4 in, 4 hold, 4 out, 4 hold.",
      "Pick a single easy task and complete it.",
    ],
    struggling: [
      "You’re not alone—reach out to a friend or TA.",
      "Consider UVic Counselling resources in the Resources page.",
      "If you need immediate support, contact a crisis line in your area.",
      outdoorOK ? "Step outside briefly and breathe slowly." : "Stay warm, breathe slowly, and reduce stimulation for a bit.",
      "Break goals into tiny steps; start with a 2‑minute action.",
    ],
  };

  // Gentle tailoring if the note hints at exams or deadlines
  if (/exam|midterm|test|final|deadline|assignment/.test(text)) {
    base.okay.unshift("Make a 30‑60‑90 minute plan with tiny breaks.");
    base.low.unshift("Draft a micro‑plan: 20 minutes study, 5 rest.");
    base.struggling.unshift("Email your instructor or TA about one clear question.");
  }

  const suggestions = base[mood];
  const follow_up_question = "Want me to create a tiny checklist for today?";
  return { suggestions, follow_up_question };
}

// Offline mood history (per user) so logging works without the backend
const MOOD_HISTORY_KEY = "lantern_mood_history";
type LocalMoodEntry = { id: string; userId: string; mood: MoodValue; note?: string; timestamp: number };

function getLocalMoodHistory(userId: string): LocalMoodEntry[] {
  try {
    const raw = localStorage.getItem(MOOD_HISTORY_KEY);
    if (!raw) return [];
    const all: LocalMoodEntry[] = JSON.parse(raw);
    return all.filter((e) => e.userId === userId);
  } catch {
    return [];
  }
}

function appendLocalMoodEntry(entry: LocalMoodEntry) {
  try {
    const raw = localStorage.getItem(MOOD_HISTORY_KEY);
    const all: LocalMoodEntry[] = raw ? JSON.parse(raw) : [];
    all.push(entry);
    localStorage.setItem(MOOD_HISTORY_KEY, JSON.stringify(all));
  } catch {
    // ignore storage errors silently
  }
}

const WellnessPage = () => {
  const { currentBackground } = useTheme();
  const { user } = useAuth();
  const { weather } = useWeather();
  const { preferences } = usePreferences();
  const { seasonalContext, refreshSeasonal } = useSeasonal(preferences?.coping_style ?? null);
  const { logRoutineUsed, logEvent } = useEvents();

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoggingMood, setIsLoggingMood] = useState(false);
  const [retry, setRetry] = useState<null | (() => void)>(null);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [resourceSuggestions, setResourceSuggestions] = useState<ResourceCard[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [showChecklistPrompt, setShowChecklistPrompt] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const [checklistTitle, setChecklistTitle] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [unsyncedCount, setUnsyncedCount] = useState(0);

  const [checklistMood, setChecklistMood] = useState<MoodValue | null>(null);
  const [checklistNote, setChecklistNote] = useState<string | null>(null);
  const [feedbackRoutineId, setFeedbackRoutineId] = useState<string | null>(null);

  const hasCustomBackground =
    currentBackground?.enabled &&
    (currentBackground?.image || currentBackground?.wallpaper);

  const greetingName = user?.display_name || "there";

  const weatherPayload = useMemo(() => {
    if (!weather) {
      return { location: "Victoria, BC" };
    }
    return {
      description: weather.description,
      temperature: weather.temperature,
      condition: weather.condition,
      location: "Victoria, BC",
      // include wind for better activity gating
      windSpeed: (weather as any).windSpeed,
    } as const;
  }, [weather]);

  useEffect(() => {
    void refreshSeasonal(
      weather
        ? {
            description: weather.description,
            temperature: weather.temperature,
            condition: weather.condition,
          }
        : undefined,
      preferences?.coping_style ?? null
    );
  }, [preferences?.coping_style, refreshSeasonal, weather]);

  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setResourceSuggestions([]);
    setFollowUpQuestion(null);
    setShowChecklistPrompt(false);
    setChecklistItems([]);
    setChecklistTitle(null);
    setCheckInMessage(null);
    setHasCheckedIn(false);
    setFeedbackRoutineId(null);
  }, []);

  const goBackToMoods = useCallback(() => {
    resetSuggestions();
    setSelectedMood(null);
    setNote("");
    setStatusMessage(null);
  }, [resetSuggestions]);

  // Outbox utilities for offline mood syncing
  const MOOD_OUTBOX_KEY = "lantern_mood_outbox";
  const getOutbox = useCallback(() => {
    try {
      const raw = localStorage.getItem(MOOD_OUTBOX_KEY);
      return raw ? (JSON.parse(raw) as LocalMoodEntry[]) : [];
    } catch {
      return [];
    }
  }, []);

  const setOutbox = useCallback((items: LocalMoodEntry[]) => {
    try {
      localStorage.setItem(MOOD_OUTBOX_KEY, JSON.stringify(items));
      setUnsyncedCount(items.filter(i => i.userId === (user?.id || "demo-user")).length);
    } catch {}
  }, [user?.id]);

  const pushOutbox = useCallback((entry: LocalMoodEntry) => {
    const items = getOutbox();
    items.push(entry);
    setOutbox(items);
  }, [getOutbox, setOutbox]);

  useEffect(() => {
    // Initialize unsynced count on mount or user change
    setUnsyncedCount(getOutbox().filter(i => i.userId === (user?.id || "demo-user")).length);
  }, [getOutbox, user?.id]);

  const handleLogMood = useCallback(async () => {
    if (!selectedMood) {
      setStatusMessage("Select a mood first.");
      return;
    }
    setIsLoggingMood(true);
    setStatusMessage(null);
    try {
      await api.wellness.createMoodEntry(selectedMood, note.trim() || undefined);
      setStatusMessage("Mood logged. Lantern is here if you want suggestions.");
      setRetry(null);
    } catch (error) {
      // Fallback: log locally so the user isn't blocked
      const uid = (user?.id || "demo-user").toString();
      appendLocalMoodEntry({
        id: createId(),
        userId: uid,
        mood: selectedMood,
        note: note.trim() || undefined,
        timestamp: Date.now(),
      });
      pushOutbox({
        id: createId(),
        userId: uid,
        mood: selectedMood,
        note: note.trim() || undefined,
        timestamp: Date.now(),
      });
      setStatusMessage("Mood noted.");
      setRetry(() => () => handleLogMood());
    } finally {
      setIsLoggingMood(false);
    }
  }, [note, selectedMood, user?.id]);

  const handleGetSuggestions = useCallback(async () => {
    if (!selectedMood) {
      setStatusMessage("Select a mood to get personalized suggestions.");
      return;
    }
    setIsLoadingSuggestions(true);
    setStatusMessage(null);
    resetSuggestions();
    try {
      const response = await api.wellness.getSuggestions({
        mood: selectedMood,
        note: note.trim() || undefined,
        weather: weatherPayload,
      });
      setSuggestions(response.data.suggestions || []);
      setFollowUpQuestion(response.data.follow_up_question || "Want me to create a checklist?");
      setResourceSuggestions(response.data.resources || []);
      setShowChecklistPrompt(true);
      setRetry(null);
    } catch (error) {
      if (error instanceof Error && error.message === "Unauthorized") {
        // Don't show offline wording; prompt sign-in
        setStatusMessage("Please sign in to get suggestions.");
        setRetry(() => () => handleGetSuggestions());
      } else {
        // Provide tips silently without the "offline" phrasing
        const local = getLocalSuggestions(selectedMood, note, weatherPayload);
        setSuggestions(local.suggestions);
        setFollowUpQuestion(local.follow_up_question);
        setShowChecklistPrompt(true);
        setStatusMessage("Here are some quick tips.");
        setRetry(() => () => handleGetSuggestions());
      }
    } finally {
      setIsLoadingSuggestions(false);
    }
  }, [note, resetSuggestions, selectedMood, weatherPayload]);

  const handleCreateChecklist = useCallback(async () => {
    if (!selectedMood) return;
    setIsGeneratingChecklist(true);
    setShowChecklistPrompt(false);
    setCheckInMessage(null);
    setHasCheckedIn(false);
    try {
      const response = await api.wellness.createChecklist({
        mood: selectedMood,
        note: note.trim() || undefined,
        suggestions,
        weather: weatherPayload,
        max_items: 6,
      });
      const items = (response.data.items || []).map((text) => ({
        id: createId(),
        text,
        done: false,
      }));
      setChecklistTitle(response.data.title || "Your checklist");
      setChecklistItems(items);
      setChecklistMood(selectedMood);
      setChecklistNote(note.trim() || null);
      const routineId = `wellness-${selectedMood}-checklist`;
      setFeedbackRoutineId(routineId);
      void logRoutineUsed(routineId, "wellness", false);
      setRetry(null);
    } catch (error) {
      // Fallback: build a simple checklist from current suggestions
      const fallbackItems = (suggestions.length ? suggestions : getLocalSuggestions(selectedMood, note, weatherPayload).suggestions)
        .slice(0, 6)
        .map((text) => ({ id: createId(), text, done: false }));
      setChecklistTitle("Today’s Checklist");
      setChecklistItems(fallbackItems);
      setChecklistMood(selectedMood);
      setChecklistNote(note.trim() || null);
      setStatusMessage("Here’s a quick checklist to get you started.");
      setRetry(() => () => handleCreateChecklist());
    } finally {
      setIsGeneratingChecklist(false);
    }
  }, [logRoutineUsed, note, selectedMood, suggestions, weatherPayload]);

  const handleToggleItem = useCallback((id: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, done: !item.done } : item))
    );
  }, []);

  const handleUpdateItem = useCallback((id: string, value: string) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, text: value } : item))
    );
  }, []);

  const handleRemoveItem = useCallback((id: string) => {
    setChecklistItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const handleAddItem = useCallback(() => {
    setChecklistItems((prev) => [
      ...prev,
      { id: createId(), text: "", done: false },
    ]);
  }, []);

  const handleSeasonalSuggestion = useCallback(
    (suggestionId: string) => {
      if (!seasonalContext) return;
      const suggestion = seasonalContext.suggestions.find((item) => item.id === suggestionId);
      if (!suggestion) return;
      setNote(suggestion.text);
    },
    [seasonalContext]
  );

  const checklistComplete =
    checklistItems.length > 0 && checklistItems.every((item) => item.done);

  const handleCheckIn = useCallback(async () => {
    if (!checklistComplete || hasCheckedIn || isCheckingIn) return;
    const mood = checklistMood || selectedMood;
    if (!mood) return;

    setIsCheckingIn(true);
    try {
      const summary = checklistItems
        .map((item) => item.text)
        .filter(Boolean)
        .join("; ");
      const response = await api.wellness.generateCheckIn({
        mood,
        note: checklistNote || note.trim() || undefined,
        weather: weatherPayload,
        checklist_summary: summary || undefined,
      });
      setCheckInMessage(response.data.message);
      setHasCheckedIn(true);
      if (feedbackRoutineId) {
        void logRoutineUsed(feedbackRoutineId, "wellness", true);
      }
    } catch (error) {
      setCheckInMessage("You made it through that checklist. How are you feeling now?");
      setHasCheckedIn(true);
    } finally {
      setIsCheckingIn(false);
    }
  }, [
    checklistComplete,
    checklistItems,
    checklistMood,
    checklistNote,
    feedbackRoutineId,
    hasCheckedIn,
    isCheckingIn,
    logRoutineUsed,
    note,
    selectedMood,
    weatherPayload,
  ]);

  useEffect(() => {
    if (checklistComplete && !hasCheckedIn) {
      handleCheckIn();
    }
  }, [checklistComplete, handleCheckIn, hasCheckedIn]);

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

      <main className="flex-1 pt-16 relative z-10">
        <div className="max-w-4xl mx-auto w-full px-4 md:px-8 py-12 md:py-16 space-y-12">
          {/* Hero section */}
          <motion.header
            className="text-center space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex p-4 rounded-full bg-accent/50 mb-4"
              animate={{
                boxShadow: [
                  "0 0 30px hsl(var(--primary) / 0.1)",
                  "0 0 50px hsl(var(--primary) / 0.2)",
                  "0 0 30px hsl(var(--primary) / 0.1)",
                ],
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              <Heart className="h-8 w-8 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold text-foreground tracking-tight">
              Wellness Check-In
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-lg mx-auto">
              Welcome back, {greetingName}. Take a moment to check in with yourself.
            </p>
            {weather && (
              <p className="text-sm text-muted-foreground/60 font-mono">
                Victoria, BC · {weather.temperature}°C · {weather.description}
              </p>
            )}
            {seasonalContext && (
              <div className="flex justify-center">
                <SeasonalBanner
                  context={seasonalContext}
                  onSuggestionClick={handleSeasonalSuggestion}
                  onSunsetClick={() => setNote("Quick loop before it gets dark.")}
                  showSuggestions
                />
              </div>
            )}
          </motion.header>

          {/* Mood Selection Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-serif flex items-center gap-2">
                  <Sun className="h-5 w-5 text-primary" />
                  How are you feeling?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Mood buttons - Playbook style */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                  </Button>
                  {unsyncedCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="rounded-full text-muted-foreground"
                      onClick={async () => {
                        const uid = (user?.id || "demo-user").toString();
                        const outboxAll = getOutbox();
                        const mine = outboxAll.filter(i => i.userId === uid);
                        let remaining = outboxAll.filter(i => i.userId !== uid);
                        for (const item of mine) {
                          try {
                            await api.wellness.createMoodEntry(item.mood, item.note);
                          } catch {
                            remaining.push(item);
                          }
                        }
                    {resourceSuggestions.length > 0 && (
                      <div className="space-y-3">
                        <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                          UVic Resources
                        </h3>
                        <div className="grid gap-3">
                          {resourceSuggestions.map((resource, index) => (
                            <motion.a
                              key={resource.id}
                              href={normalizeResourceUrl(resource.url)}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={() =>
                                logEvent("resource_clicked", {
                                  resource_id: resource.id,
                                  resource_type: "wellness_suggestion",
                                })
                              }
                              className={cn(
                                "block p-4 rounded-2xl",
                                "bg-background/40 border border-border/30",
                                "hover:bg-background/60 hover:border-border/60",
                                "transition-all duration-300"
                              )}
                              initial={{ opacity: 0, y: 8 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.08 }}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-medium text-foreground">{resource.name}</p>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    {resource.description}
                                  </p>
                                  {resource.location && (
                                    <p className="text-[10px] text-muted-foreground/70 mt-2">
                                      {resource.location}
                                    </p>
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground/70">↗</span>
                              </div>
                            </motion.a>
                          ))}
                        </div>
                      </div>
                    )}
                      }}
                    >
                      Sync {unsyncedCount} saved {unsyncedCount === 1 ? "mood" : "moods"}
                    </Button>
                  )}
                  {statusMessage && (
                    <div className="text-sm text-muted-foreground flex items-center gap-2">
                      <button
                        type="button"
                        className={cn(
                          /sync/i.test(statusMessage) ? "underline decoration-dotted cursor-pointer hover:text-foreground" : ""
                        )}
                        onClick={() => {
                          if (/sync/i.test(statusMessage)) {
                            goBackToMoods();
                          }
                        }}
                      >
                        {statusMessage}
                      </button>
                      {retry && (
                        <Button
                          variant="link"
                          size="sm"
                          className="px-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            retry();
                            setRetry(null);
                          }}
                        >
                          Retry
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Suggestions Card */}
          {(suggestions.length > 0 || resourceSuggestions.length > 0) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-serif flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Lantern Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
<<<<<<< HEAD
                  {suggestions.length > 0 && (
                    <ul className="space-y-3">
                      {suggestions.map((suggestion, index) => (
                        <motion.li
                          key={`${suggestion}-${index}`}
                          className="flex gap-3 items-start p-4 rounded-xl bg-background/40 border border-border/30"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                          <span className="text-foreground/90">{suggestion}</span>
                        </motion.li>
                      ))}
                    </ul>
                  )}

                  {resourceSuggestions.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-foreground/80 uppercase tracking-wide">
                        UVic Resources
                      </h3>
                      <div className="grid gap-3">
                        {resourceSuggestions.map((resource, index) => (
                          <motion.a
                            key={resource.id}
                            href={normalizeResourceUrl(resource.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() =>
                              logEvent("resource_clicked", {
                                resource_id: resource.id,
                                resource_type: "wellness_suggestion",
                              })
                            }
                            className={cn(
                              "block p-4 rounded-2xl",
                              "bg-background/40 border border-border/30",
                              "hover:bg-background/60 hover:border-border/60",
                              "transition-all duration-300"
                            )}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.08 }}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div>
                                <p className="font-medium text-foreground">{resource.name}</p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {resource.description}
                                </p>
                                {resource.location && (
                                  <p className="text-[10px] text-muted-foreground/70 mt-2">
                                    {resource.location}
                                  </p>
                                )}
                              </div>
                              <span className="text-xs text-muted-foreground/70">↗</span>
                            </div>
                          </motion.a>
                        ))}
                      </div>
                    </div>
                  )}
=======
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">Personalized ideas based on your mood and Victoria weather.</p>
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={goBackToMoods}>Back to moods</Button>
                  </div>
                  <ul className="space-y-3">
                    {suggestions.map((suggestion, index) => (
                      <motion.li
                        key={`${suggestion}-${index}`}
                        className="flex gap-3 items-start p-4 rounded-xl bg-background/40 border border-border/30"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="h-2 w-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span className="text-foreground/90">{suggestion}</span>
                      </motion.li>
                    ))}
                  </ul>
>>>>>>> f4f9663 (Updated wellness router and wellness page)

                  {followUpQuestion && showChecklistPrompt && (
                    <div className="p-6 rounded-2xl bg-accent/30 border border-primary/20 space-y-4">
                      <p className="text-foreground/90 font-medium">{followUpQuestion}</p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleCreateChecklist}
                          disabled={isGeneratingChecklist}
                          className="rounded-full"
                        >
                          {isGeneratingChecklist ? "Creating..." : "Yes, create a checklist"}
                        </Button>
                        <Button
                          variant="ghost"
                          onClick={() => setShowChecklistPrompt(false)}
                          className="rounded-full"
                        >
                          Not right now
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Checklist Card */}
          {checklistItems.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-border/40 bg-card/50 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-4">
                    <CardTitle className="text-xl font-serif">
                      {checklistTitle || "Your Checklist"}
                    </CardTitle>
                    <Button variant="ghost" size="sm" className="rounded-full" onClick={goBackToMoods}>Back to moods</Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {checklistItems.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center gap-4 p-4 rounded-xl bg-background/40 border border-border/30"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <motion.button
                          type="button"
                          onClick={() => handleToggleItem(item.id)}
                          className={cn(
                            "h-8 w-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-all",
                            item.done
                              ? "bg-primary border-primary text-primary-foreground"
                              : "border-border/60 hover:border-primary/50"
                          )}
                          whileTap={{ scale: 0.9 }}
                        >
                          {item.done && <Check className="h-4 w-4" />}
                        </motion.button>
                        <Input
                          value={item.text}
                          onChange={(event) => handleUpdateItem(item.id, event.target.value)}
                          placeholder="Checklist item"
                          className={cn(
                            "flex-1 bg-transparent border-0 focus-visible:ring-0 px-0",
                            item.done && "line-through text-muted-foreground"
                          )}
                        />
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          onClick={() => handleRemoveItem(item.id)}
                          className="shrink-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </motion.div>
                    ))}
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleAddItem}
                      className="rounded-full gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add item
                    </Button>
                    <span className="text-sm text-muted-foreground font-mono">
                      {checklistItems.filter((item) => item.done).length} / {checklistItems.length} complete
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Check-in Message Card */}
          {(checkInMessage || isCheckingIn) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-primary/30 bg-gradient-to-br from-accent/40 to-accent/20 backdrop-blur-sm shadow-xl">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-serif flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    Lantern Check-In
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg text-foreground/90 leading-relaxed">
                    {isCheckingIn ? "Checking in..." : checkInMessage}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {feedbackRoutineId && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <FeedbackPrompt
                routineId={feedbackRoutineId}
                playbookId="wellness"
                onDismiss={() => setFeedbackRoutineId(null)}
              />
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default WellnessPage;
