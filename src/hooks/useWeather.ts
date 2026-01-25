import { useState, useEffect } from "react";
import { fetchVictoriaWeather, WeatherData, toGreetingWeather } from "@/lib/weather";

interface UseWeatherResult {
  weather: WeatherData | null;
  isLoading: boolean;
  error: Error | null;
  greetingWeather: "sunny" | "cloudy" | "rainy" | "cold" | "warm";
  refetch: () => Promise<void>;
}

export function useWeather(): UseWeatherResult {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchWeather = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await fetchVictoriaWeather();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to fetch weather"));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();

    // Refresh weather every 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Default to cloudy if weather not loaded yet
  const greetingWeather = weather ? toGreetingWeather(weather.condition) : "cloudy";

  return {
    weather,
    isLoading,
    error,
    greetingWeather,
    refetch: fetchWeather,
  };
}
