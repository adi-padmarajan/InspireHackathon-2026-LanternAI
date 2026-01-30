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
} from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { AmbientBackground } from "@/components/AmbientBackground";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWeather } from "@/hooks/useWeather";
import { api } from "@/lib/api";
import { pageVariants, springPresets } from "@/lib/animations";
import { cn } from "@/lib/utils";

const moodOptions = [
  { value: "great", label: "Great", icon: Smile, color: "text-emerald-600", ring: "ring-emerald-200" },
  { value: "good", label: "Good", icon: Smile, color: "text-sky-600", ring: "ring-sky-200" },
  { value: "okay", label: "Okay", icon: Meh, color: "text-amber-600", ring: "ring-amber-200" },
  { value: "low", label: "Low", icon: Frown, color: "text-orange-600", ring: "ring-orange-200" },
  { value: "struggling", label: "Struggling", icon: CloudRain, color: "text-rose-600", ring: "ring-rose-200" },
] as const;

type MoodValue = (typeof moodOptions)[number]["value"];

interface ChecklistItem {
  id: string;
  text: string;
  done: boolean;
}

const createId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const WellnessPage = () => {
  const { currentBackground } = useTheme();
  const { user } = useAuth();
  const { weather } = useWeather();

  const [selectedMood, setSelectedMood] = useState<MoodValue | null>(null);
  const [note, setNote] = useState("");
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoggingMood, setIsLoggingMood] = useState(false);

  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [followUpQuestion, setFollowUpQuestion] = useState<string | null>(null);
  const [showChecklistPrompt, setShowChecklistPrompt] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);

  const [checklistTitle, setChecklistTitle] = useState<string | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>([]);
  const [isGeneratingChecklist, setIsGeneratingChecklist] = useState(false);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [checkInMessage, setCheckInMessage] = useState<string | null>(null);
  const [isCheckingIn, setIsCheckingIn] = useState(false);

  const [checklistMood, setChecklistMood] = useState<MoodValue | null>(null);
  const [checklistNote, setChecklistNote] = useState<string | null>(null);

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
    };
  }, [weather]);

  const resetSuggestions = useCallback(() => {
    setSuggestions([]);
    setFollowUpQuestion(null);
    setShowChecklistPrompt(false);
    setChecklistItems([]);
    setChecklistTitle(null);
    setCheckInMessage(null);
    setHasCheckedIn(false);
  }, []);

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
    } catch (error) {
      setStatusMessage("Could not log mood. Please try again.");
    } finally {
      setIsLoggingMood(false);
    }
  }, [note, selectedMood]);

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
      setShowChecklistPrompt(true);
    } catch (error) {
      setStatusMessage("Could not fetch suggestions. Please try again.");
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
    } catch (error) {
      setStatusMessage("Could not create checklist. Please try again.");
    } finally {
      setIsGeneratingChecklist(false);
    }
  }, [note, selectedMood, suggestions, weatherPayload]);

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
    hasCheckedIn,
    isCheckingIn,
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
      {!hasCustomBackground && <AmbientBackground />}

      {!hasCustomBackground && (
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background/80 via-background/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/40 to-transparent" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/40 to-transparent" />
        </div>
      )}

      <Navigation />

      <main className="flex-1 pt-16 relative z-10">
        <div className="max-w-5xl mx-auto w-full px-4 py-10 space-y-8">
          <motion.div
            className="text-center space-y-3"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={springPresets.gentle}
          >
            <h1 className="text-3xl md:text-4xl font-serif font-semibold text-foreground">
              Wellness Check-In
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              Welcome back, {greetingName}. How are you feeling today?
            </p>
            {weather && (
              <p className="text-xs text-muted-foreground/70">
                Victoria, BC | {weather.temperature}C | {weather.description}
              </p>
            )}
          </motion.div>

          <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-lg">Log your mood</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {moodOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = selectedMood === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setSelectedMood(option.value)}
                      className={cn(
                        "flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-sm transition",
                        "bg-background/60 hover:border-primary/40",
                        isSelected && "border-primary/60 ring-2",
                        isSelected && option.ring
                      )}
                    >
                      <Icon className={cn("h-5 w-5", option.color)} />
                      <span className="font-medium text-foreground/90">{option.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="space-y-2">
                <label className="text-sm text-muted-foreground">Optional note</label>
                <Textarea
                  value={note}
                  onChange={(event) => setNote(event.target.value)}
                  placeholder="Add a quick note if you would like..."
                  className="min-h-[90px]"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={handleLogMood}
                  disabled={!selectedMood || isLoggingMood}
                >
                  {isLoggingMood ? "Logging..." : "Log Mood"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleGetSuggestions}
                  disabled={!selectedMood || isLoadingSuggestions}
                >
                  {isLoadingSuggestions ? "Thinking..." : "Lantern Suggestions"}
                </Button>
                {statusMessage && (
                  <span className="text-sm text-muted-foreground">{statusMessage}</span>
                )}
              </div>
            </CardContent>
          </Card>

          {suggestions.length > 0 && (
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Lantern suggestions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <ul className="space-y-2 text-sm text-foreground/90">
                  {suggestions.map((suggestion, index) => (
                    <li key={`${suggestion}-${index}`} className="flex gap-2">
                      <span className="text-primary">-</span>
                      <span>{suggestion}</span>
                    </li>
                  ))}
                </ul>

                {followUpQuestion && showChecklistPrompt && (
                  <div className="rounded-xl border border-border/60 bg-background/60 p-4 space-y-3">
                    <p className="text-sm text-foreground/90">{followUpQuestion}</p>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        onClick={handleCreateChecklist}
                        disabled={isGeneratingChecklist}
                      >
                        {isGeneratingChecklist ? "Creating..." : "Yes, create a checklist"}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowChecklistPrompt(false)}
                      >
                        Not right now
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {checklistItems.length > 0 && (
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {checklistTitle || "Your checklist"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3"
                    >
                      <button
                        type="button"
                        onClick={() => handleToggleItem(item.id)}
                        className={cn(
                          "h-8 w-8 rounded-full border flex items-center justify-center",
                          item.done
                            ? "bg-primary text-primary-foreground border-primary"
                            : "border-border/60"
                        )}
                      >
                        {item.done && <Check className="h-4 w-4" />}
                      </button>
                      <Input
                        value={item.text}
                        onChange={(event) => handleUpdateItem(item.id, event.target.value)}
                        placeholder="Checklist item"
                        className={cn(
                          "flex-1",
                          item.done && "line-through text-muted-foreground"
                        )}
                      />
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemoveItem(item.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button type="button" variant="secondary" onClick={handleAddItem}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add item
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {checklistItems.filter((item) => item.done).length} / {checklistItems.length} done
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {(checkInMessage || isCheckingIn) && (
            <Card className="border-border/60 bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Lantern check-in</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground/90">
                  {isCheckingIn ? "Checking in..." : checkInMessage}
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default WellnessPage;
