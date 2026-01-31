import { useState, useEffect, useCallback } from "react";
import { api, getAuthToken } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import type { UserPreferences, PersonalizationContext } from "@/lib/api";

interface UsePreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<boolean>;
  clearPreferences: () => Promise<boolean>;
  getPersonalization: (playbookId: string) => Promise<PersonalizationContext | null>;
}

const isValidToken = () => {
  const token = getAuthToken();
  if (!token) return false;
  if (token.startsWith("demo-token")) return false;
  return true;
};

export function usePreferences(): UsePreferencesReturn {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!isValidToken()) {
      setPreferences(null);
      return;
    }

    setLoading(true);
    try {
      const response = await api.preferences.get();
      if (response.success) {
        setPreferences(response.data ?? null);
      } else {
        setError("Failed to fetch preferences");
      }
    } catch {
      setError("Failed to fetch preferences");
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>): Promise<boolean> => {
    if (!isValidToken()) return false;

    try {
      const response = await api.preferences.update(updates);
      if (response.success) {
        setPreferences((prev) => (prev ? { ...prev, ...updates } : (response.data ?? null)));
        return true;
      }
      return false;
    } catch {
      setError("Failed to update preferences");
      return false;
    }
  }, []);

  const clearPreferences = useCallback(async (): Promise<boolean> => {
    if (!isValidToken()) return false;

    try {
      const response = await api.preferences.clear();
      if (response.success) {
        setPreferences(null);
        return true;
      }
      return false;
    } catch {
      setError("Failed to clear preferences");
      return false;
    }
  }, []);

  const getPersonalization = useCallback(async (playbookId: string): Promise<PersonalizationContext | null> => {
    try {
      const response = await api.preferences.personalization(playbookId);
      if (response.success) {
        return response.data ?? null;
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  useEffect(() => {
    fetchPreferences();
  }, [fetchPreferences, user?.id]);

  return { preferences, loading, error, updatePreferences, clearPreferences, getPersonalization };
}
