import { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import type { FeedbackRequest } from '../lib/api';

interface FeedbackContext {
  playbook_id?: string;
  stage?: string;
  session_id?: string;
}

interface UseFeedbackReturn {
  submitting: boolean;
  submitted: boolean;
  error: string | null;
  submitFeedback: (request: FeedbackRequest) => Promise<boolean>;
  reset: () => void;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useFeedback(): UseFeedbackReturn {
  const { session } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitFeedback = useCallback(async (request: FeedbackRequest): Promise<boolean> => {
    setSubmitting(true);
    setError(null);

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      
      if (session?.access_token) {
        headers['Authorization'] = `Bearer ${session.access_token}`;
      }

      const response = await fetch(`${API_BASE}/api/feedback`, {
        method: 'POST',
        headers,
        body: JSON.stringify(request),
      });

      const data = await response.json();
      
      if (data.success) {
        setSubmitted(true);
        
        // Store last feedback rating locally
        if (request.rating) {
          localStorage.setItem('lastFeedbackRating', String(request.rating));
        }
        
        return true;
      } else {
        setError('Failed to submit feedback');
        return false;
      }
    } catch (err) {
      setError('Network error');
      return false;
    } finally {
      setSubmitting(false);
    }
  }, [session]);

  const reset = useCallback(() => {
    setSubmitted(false);
    setError(null);
  }, []);

  return { submitting, submitted, error, submitFeedback, reset };
}
