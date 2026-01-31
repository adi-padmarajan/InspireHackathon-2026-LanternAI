import { useState, useEffect } from "react";
import { Save, Trash2, Loader2 } from "lucide-react";
import { usePreferences } from "@/hooks/usePreferences";
import { cn } from "@/lib/utils";

const vibeOptions = [
  { id: "jokester", label: "Jokester", description: "Light humor and playful vibes" },
  { id: "cozy", label: "Cozy", description: "Warm and nurturing energy" },
  { id: "balanced", label: "Balanced", description: "A mix of both" },
] as const;

const copingOptions = [
  { id: "talking", label: "Talking it out", description: "Process through conversation" },
  { id: "planning", label: "Making a plan", description: "Action-oriented steps" },
  { id: "grounding", label: "Grounding first", description: "Calm down before problem-solving" },
] as const;

const routineOptions = [
  "Morning check-in",
  "Evening reflection",
  "Study break reminders",
  "Meal reminders",
  "Sleep wind-down",
  "Weekend planning",
];

export const PreferencesSettings = () => {
  const { preferences, loading, updatePreferences, clearPreferences } = usePreferences();

  const [vibe, setVibe] = useState<string | null>(null);
  const [copingStyle, setCopingStyle] = useState<string | null>(null);
  const [routines, setRoutines] = useState<string[]>([]);
  const [optIn, setOptIn] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (preferences) {
      setVibe(preferences.vibe);
      setCopingStyle(preferences.coping_style);
      setRoutines(preferences.routines || []);
      setOptIn(true);
    }
  }, [preferences]);

  const handleSave = async () => {
    if (!optIn) {
      await clearPreferences();
      return;
    }

    setSaving(true);
    const success = await updatePreferences({
      vibe: vibe as any,
      coping_style: copingStyle as any,
      routines,
    });
    setSaving(false);

    if (success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const toggleRoutine = (routine: string) => {
    setRoutines((prev) =>
      prev.includes(routine) ? prev.filter((r) => r !== routine) : [...prev, routine]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Personalization</h3>
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="rounded border-border bg-background text-primary focus:ring-primary"
          />
          Remember preferences
        </label>
      </div>

      {!optIn ? (
        <p className="text-sm text-muted-foreground">
          Your preferences won't be saved. Enable "Remember preferences" to personalize your experience.
        </p>
      ) : (
        <>
          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Your Vibe</label>
            <div className="grid grid-cols-1 gap-2">
              {vibeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setVibe(option.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border transition-colors",
                    vibe === option.id
                      ? "bg-primary/10 border-primary/40"
                      : "bg-card/40 border-border/40 hover:bg-card/70"
                  )}
                >
                  <div className="font-medium text-foreground text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Coping Style</label>
            <div className="grid grid-cols-1 gap-2">
              {copingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setCopingStyle(option.id)}
                  className={cn(
                    "text-left p-3 rounded-xl border transition-colors",
                    copingStyle === option.id
                      ? "bg-primary/10 border-primary/40"
                      : "bg-card/40 border-border/40 hover:bg-card/70"
                  )}
                >
                  <div className="font-medium text-foreground text-sm">{option.label}</div>
                  <div className="text-xs text-muted-foreground">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-muted-foreground">Preferred Routines</label>
            <div className="grid grid-cols-2 gap-2">
              {routineOptions.map((routine) => (
                <label
                  key={routine}
                  className={cn(
                    "flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-colors",
                    routines.includes(routine)
                      ? "bg-primary/10 border-primary/40"
                      : "bg-card/40 border-border/40 hover:bg-card/70"
                  )}
                >
                  <input
                    type="checkbox"
                    checked={routines.includes(routine)}
                    onChange={() => toggleRoutine(routine)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "text-sm",
                      routines.includes(routine) ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {routine}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-border/40">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 rounded-lg font-medium text-primary-foreground text-sm transition-colors"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saved ? "Saved!" : "Save Preferences"}
        </button>

        {optIn && preferences && (
          <button
            onClick={clearPreferences}
            className="flex items-center gap-2 px-4 py-2 bg-destructive/10 hover:bg-destructive/20 border border-destructive/30 rounded-lg font-medium text-destructive text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        )}
      </div>
    </div>
  );
};
