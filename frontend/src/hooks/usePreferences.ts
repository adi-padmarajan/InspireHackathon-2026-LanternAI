import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

interface UserPreferences {
  vibe: 'jokester' | 'cozy' | 'balanced' | null;
  coping_style: 'talking' | 'planning' | 'grounding' | null;
  routines: string[];
}

interface UsePreferencesReturn {
  preferences: UserPreferences | null;
  loading: boolean;
  error: string | null;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<boolean>;
  clearPreferences: () => Promise<boolean>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function usePreferences(): UsePreferencesReturn {
  const { session } = useAuth();
  const [preferences, setPreferences] = useState<UserPreferences | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async () => {
    if (!session?.access_token) return;

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/api/preferences`, {
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (data.success && data.data) {
        setPreferences({
          vibe: data.data.vibe || null,
          coping_style: data.data.coping_style || null,
          routines: data.data.routines || [],
        });
      }
    } catch (err) {
      setError('Failed to fetch preferences');
    } finally {
      setLoading(false);
    }
  }, [session]);

  const updatePreferences = useCallback(async (updates: Partial<UserPreferences>): Promise<boolean> => {
    if (!session?.access_token) return false;

    try {
      const response = await fetch(`${API_BASE}/api/preferences`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(prev => prev ? { ...prev, ...updates } : null);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to update preferences');
      return false;
    }
  }, [session]);

  const clearPreferences = useCallback(async (): Promise<boolean> => {
    if (!session?.access_token) return false;

    try {
      const response = await fetch(`${API_BASE}/api/profile`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      const data = await response.json();
      if (data.success) {
        setPreferences(null);
        return true;
      }
      return false;
    } catch (err) {
      setError('Failed to clear preferences');
      return false;
    }
  }, [session]);

  useEffect(() => {
    if (session?.access_token) {
      fetchPreferences();
    }
  }, [session, fetchPreferences]);

  return { preferences, loading, error, updatePreferences, clearPreferences };
}
