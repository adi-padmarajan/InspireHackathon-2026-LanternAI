import { useState, useEffect, useCallback } from 'react';
import type { SeasonalContext } from '../lib/api';

interface WeatherData {
  description?: string;
  temperature?: number;
  condition?: string;
}

interface UseSeasonalReturn {
  seasonalContext: SeasonalContext | null;
  loading: boolean;
  error: string | null;
  refreshSeasonal: (weather?: WeatherData, copingStyle?: string) => Promise<void>;
}

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function useSeasonal(initialCopingStyle?: string): UseSeasonalReturn {
  const [seasonalContext, setSeasonalContext] = useState<SeasonalContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSeasonal = useCallback(async (weatherData?: WeatherData, copingStyle?: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/api/context/seasonal`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather: weatherData || null,
          location: 'Victoria, BC',
          coping_style: copingStyle || initialCopingStyle,
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
  }, [initialCopingStyle]);

  useEffect(() => {
    refreshSeasonal();
  }, []);

  return { seasonalContext, loading, error, refreshSeasonal };
}
