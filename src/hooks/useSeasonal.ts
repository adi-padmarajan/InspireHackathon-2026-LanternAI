import { useState, useEffect, useCallback } from "react";
import { api } from "@/lib/api";
import type { SeasonalContext } from "@/lib/api";

interface WeatherData {
  description?: string;
  temperature?: number;
  condition?: string;
}

interface UseSeasonalReturn {
  seasonalContext: SeasonalContext | null;
  loading: boolean;
  error: string | null;
  refreshSeasonal: (weather?: WeatherData, copingStyle?: string | null) => Promise<void>;
}

export function useSeasonal(initialCopingStyle?: string | null): UseSeasonalReturn {
  const [seasonalContext, setSeasonalContext] = useState<SeasonalContext | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshSeasonal = useCallback(
    async (weatherData?: WeatherData, copingStyle?: string | null) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.seasonal.context({
          weather: weatherData ?? null,
          location: "Victoria, BC",
          coping_style: copingStyle ?? initialCopingStyle ?? null,
        });

        if (response.success) {
          setSeasonalContext(response.data);
        } else {
          setError("Failed to fetch seasonal context");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    },
    [initialCopingStyle]
  );

  useEffect(() => {
    refreshSeasonal();
  }, [refreshSeasonal]);

  return { seasonalContext, loading, error, refreshSeasonal };
}
