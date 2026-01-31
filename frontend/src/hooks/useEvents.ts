import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

type EventType = 'playbook_started' | 'resource_clicked' | 'script_used';

interface EventPayload {
  playbook_id?: string;
  resource_id?: string;
  resource_type?: string;
  script_scenario?: string;
  extra?: Record<string, unknown>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useEvents() {
  const { session } = useAuth();

  const logEvent = useCallback(async (
    eventType: EventType,
    payload?: EventPayload
  ): Promise<void> => {
    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      await fetch(`${API_BASE}/api/events`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ event_type: eventType, payload }),
      });
    } catch (err) {
      // Silently fail - don't break UX for analytics
      console.warn('Failed to log event:', eventType);
    }
  }, [session]);

  return { logEvent };
}
