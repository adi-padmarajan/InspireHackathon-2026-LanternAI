import { useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { EventRequest } from '../lib/api';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useEvents() {
  const { session } = useAuth();

  const logEvent = useCallback(async (request: EventRequest): Promise<void> => {
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
        body: JSON.stringify(request),
      });
    } catch (err) {
      // Silently fail - don't break UX for analytics
      console.warn('Failed to log event:', request.event_type);
    }
  }, [session]);

  const logRoutineUsed = useCallback(async (
    routineId: string,
    playbookId?: string,
    completed?: boolean
  ): Promise<void> => {
    await logEvent({
      event_type: 'routine_used',
      payload: {
        routine_id: routineId,
        playbook_id: playbookId,
        completed,
      },
    });
  }, [logEvent]);

  const logRoutineRepeated = useCallback(async (
    routineId: string,
    playbookId?: string
  ): Promise<void> => {
    await logEvent({
      event_type: 'routine_repeated',
      payload: {
        routine_id: routineId,
        playbook_id: playbookId,
      },
    });
  }, [logEvent]);

  return { logEvent, logRoutineUsed, logRoutineRepeated };
}
