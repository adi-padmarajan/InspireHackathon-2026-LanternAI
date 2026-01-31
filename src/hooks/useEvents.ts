import { useCallback } from "react";
import { api } from "@/lib/api";
import type { EventRequest } from "@/lib/api";

export function useEvents() {
  const logEvent = useCallback(async (eventType: EventRequest["event_type"], payload?: EventRequest["payload"]) => {
    try {
      await api.events.log({
        event_type: eventType,
        payload,
      });
    } catch {
      // Silent fail for analytics
    }
  }, []);

  const logRoutineUsed = useCallback(
    async (routineId: string, playbookId?: string, completed?: boolean) => {
      await logEvent("routine_used", {
        routine_id: routineId,
        playbook_id: playbookId,
        completed,
      });
    },
    [logEvent]
  );

  const logRoutineRepeated = useCallback(
    async (routineId: string, playbookId?: string) => {
      await logEvent("routine_repeated", {
        routine_id: routineId,
        playbook_id: playbookId,
      });
    },
    [logEvent]
  );

  return { logEvent, logRoutineUsed, logRoutineRepeated };
}
