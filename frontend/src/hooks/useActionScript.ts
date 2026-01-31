import { useState, useCallback } from 'react';
import { useEvents } from './useEvents';

type ScriptScenario = 'extension_request' | 'text_friend' | 'self_advocacy';
type ScriptTone = 'gentle' | 'direct' | 'warm';

interface ScriptContext {
  course?: string;
  deadline?: string;
  name?: string;
  topic?: string;
}

interface ScriptResult {
  title: string;
  script: string;
  checklist: string[];
  suggested_next_steps: string[];
}

interface UseActionScriptReturn {
  result: ScriptResult | null;
  loading: boolean;
  error: string | null;
  generateScript: (
    scenario: ScriptScenario,
    tone?: ScriptTone,
    context?: ScriptContext
  ) => Promise<ScriptResult | null>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useActionScript(): UseActionScriptReturn {
  const [result, setResult] = useState<ScriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logEvent } = useEvents();

  const generateScript = useCallback(async (
    scenario: ScriptScenario,
    tone: ScriptTone = 'gentle',
    context?: ScriptContext
  ): Promise<ScriptResult | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/actions/script`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ scenario, tone, context }),
      });

      const data = await response.json();
      
      if (data.success) {
        setResult(data.data);
        // Log script usage event
        logEvent('script_used', { script_scenario: scenario });
        return data.data;
      } else {
        setError('Failed to generate script');
        return null;
      }
    } catch (err) {
      setError('Network error');
      return null;
    } finally {
      setLoading(false);
    }
  }, [logEvent]);

  return { result, loading, error, generateScript };
}
