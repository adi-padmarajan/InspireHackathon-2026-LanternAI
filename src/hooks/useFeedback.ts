import { useState, useCallback } from "react";
import { api } from "@/lib/api";
import type { FeedbackRequest } from "@/lib/api";

interface UseFeedbackReturn {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  submitFeedback: (request: FeedbackRequest) => Promise<boolean>;
  reset: () => void;
}

export function useFeedback(): UseFeedbackReturn {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (request: FeedbackRequest): Promise<boolean> => {
    setSubmitting(true);
    setError(null);
    try {
      const response = await api.feedback.submit(request);
      if (response.success) {
        setSubmitted(true);
        if (request.rating) {
          localStorage.setItem("lastFeedbackRating", String(request.rating));
        }
        return true;
      }
      setError("Failed to submit feedback");
      return false;
    } catch {
      setError("Network error");
      return false;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setSubmitted(false);
    setError(null);
  }, []);

  return { submitting, submitted, error, submitFeedback, reset };
}
