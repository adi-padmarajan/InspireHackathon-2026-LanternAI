import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { ActionScriptContext, ActionScriptResult } from "@/lib/api";
import { useEvents } from "@/hooks/useEvents";

type ScriptScenario = "extension_request" | "text_friend" | "self_advocacy";
type ScriptTone = "gentle" | "direct" | "warm";

interface UseActionScriptReturn {
  result: ActionScriptResult | null;
  loading: boolean;
  error: string | null;
  generateScript: (
    scenario: ScriptScenario,
    tone?: ScriptTone,
    context?: ActionScriptContext
  ) => Promise<ActionScriptResult | null>;
}

export function useActionScript(): UseActionScriptReturn {
  const [result, setResult] = useState<ActionScriptResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logEvent } = useEvents();

  const generateScript = useCallback(
    async (
      scenario: ScriptScenario,
      tone: ScriptTone = "gentle",
      context?: ActionScriptContext
    ): Promise<ActionScriptResult | null> => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.actions.script({ scenario, tone, context });
        if (response.success) {
          setResult(response.data);
          await logEvent("script_used", { script_scenario: scenario });
          return response.data;
        }
        setError("Failed to generate script");
        return null;
      } catch {
        setError("Network error");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [logEvent]
  );

  return { result, loading, error, generateScript };
}
