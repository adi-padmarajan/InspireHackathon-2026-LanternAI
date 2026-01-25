import { createContext, useContext, useEffect, ReactNode } from "react";
import { useWeather } from "@/hooks/useWeather";
import { WeatherData, WeatherCondition } from "@/lib/weather";

interface WeatherContextType {
  weather: WeatherData | null;
  isLoading: boolean;
  condition: WeatherCondition | null;
}

const WeatherContext = createContext<WeatherContextType>({
  weather: null,
  isLoading: true,
  condition: null,
});

export function useWeatherContext() {
  return useContext(WeatherContext);
}

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const { weather, isLoading } = useWeather();

  // Apply weather-based class to document root for theming
  useEffect(() => {
    const root = document.documentElement;

    // Remove all weather classes first
    root.classList.remove(
      "weather-sunny",
      "weather-cloudy",
      "weather-rainy",
      "weather-cold",
      "weather-snowy",
      "weather-stormy",
      "weather-warm"
    );

    // Add current weather class
    if (weather?.condition) {
      root.classList.add(`weather-${weather.condition}`);
    }

    // Cleanup on unmount
    return () => {
      root.classList.remove(
        "weather-sunny",
        "weather-cloudy",
        "weather-rainy",
        "weather-cold",
        "weather-snowy",
        "weather-stormy",
        "weather-warm"
      );
    };
  }, [weather?.condition]);

  return (
    <WeatherContext.Provider
      value={{
        weather,
        isLoading,
        condition: weather?.condition || null,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
}
