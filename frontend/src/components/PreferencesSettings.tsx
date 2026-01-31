import React, { useState, useEffect } from 'react';
import { usePreferences } from '../hooks/usePreferences';
import { Save, Trash2, Loader2 } from 'lucide-react';

const vibeOptions = [
  { id: 'jokester', label: 'Jokester', description: 'Light humor and playful vibes' },
  { id: 'cozy', label: 'Cozy', description: 'Warm and nurturing energy' },
  { id: 'balanced', label: 'Balanced', description: 'Mix of both' },
] as const;

const copingOptions = [
  { id: 'talking', label: 'Talking it out', description: 'Process through conversation' },
  { id: 'planning', label: 'Making a plan', description: 'Action-oriented approach' },
  { id: 'grounding', label: 'Grounding first', description: 'Calm down before problem-solving' },
] as const;

const routineOptions = [
  'Morning check-in',
  'Evening reflection',
  'Study break reminders',
  'Meal reminders',
  'Sleep wind-down',
  'Weekend planning',
];

export const PreferencesSettings: React.FC = () => {
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
    setRoutines(prev =>
      prev.includes(routine)
        ? prev.filter(r => r !== routine)
        : [...prev, routine]
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Personalization</h3>
        <label className="flex items-center gap-2 text-sm text-slate-300">
          <input
            type="checkbox"
            checked={optIn}
            onChange={(e) => setOptIn(e.target.checked)}
            className="rounded border-white/20 bg-white/10 text-violet-500 focus:ring-violet-500"
          />
          Remember preferences
        </label>
      </div>

      {!optIn ? (
        <p className="text-sm text-slate-400">
          Your preferences won't be saved. Enable "Remember preferences" to personalize your experience.
        </p>
      ) : (
        <>
          {/* Vibe Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Your Vibe</label>
            <div className="grid grid-cols-1 gap-2">
              {vibeOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setVibe(option.id)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    vibe === option.id
                      ? 'bg-violet-500/20 border-violet-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Coping Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Coping Style</label>
            <div className="grid grid-cols-1 gap-2">
              {copingOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setCopingStyle(option.id)}
                  className={`text-left p-3 rounded-lg border transition-colors ${
                    copingStyle === option.id
                      ? 'bg-violet-500/20 border-violet-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <div className="font-medium text-white text-sm">{option.label}</div>
                  <div className="text-xs text-slate-400">{option.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Routines */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-slate-300">Preferred Routines</label>
            <div className="grid grid-cols-2 gap-2">
              {routineOptions.map((routine) => (
                <label
                  key={routine}
                  className={`flex items-center gap-2 p-2.5 rounded-lg border cursor-pointer transition-colors ${
                    routines.includes(routine)
                      ? 'bg-violet-500/20 border-violet-500/40'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={routines.includes(routine)}
                    onChange={() => toggleRoutine(routine)}
                    className="sr-only"
                  />
                  <span className={`text-sm ${routines.includes(routine) ? 'text-white' : 'text-slate-300'}`}>
                    {routine}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t border-white/10">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg font-medium text-white text-sm transition-colors"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saved ? 'Saved!' : 'Save Preferences'}
        </button>
        
        {optIn && preferences && (
          <button
            onClick={clearPreferences}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-lg font-medium text-red-300 text-sm transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        )}
      </div>
    </div>
  );
};
