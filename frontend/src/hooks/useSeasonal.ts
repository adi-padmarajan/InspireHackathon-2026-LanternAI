import { useState, useEffect, useCallback } from 'react';

interface WeatherData {
  description?: string;
  temperature?: number;
  condition?: string;
}

interface SeasonalContext {
  tone: 'cozy' | 'uplifting' | 'gentle';
  suggestions: string[];
  sunset_alert: boolean;
  tags: string[];
}

interface UseSeasonalReturn {
  seasonalContext: SeasonalContext | null;
  loading: boolean;
  error: string | null;
  refreshSeasonal: (weather?: WeatherData) => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useSeasonal(weather?: WeatherData): UseSeasonalReturn {
  const [seasonalContext, setSeasonalContext] = useState<SeasonalContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSeasonal = useCallback(async (weatherData?: WeatherData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/context/seasonal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: weatherData || weather || null,
          location: 'Victoria, BC',
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSeasonalContext(data.data);
      } else {
        setError('Failed to fetch seasonal context');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  }, [weather]);

  useEffect(() => {
    refreshSeasonal();
  }, []);

  return { seasonalContext, loading, error, refreshSeasonal };
}
