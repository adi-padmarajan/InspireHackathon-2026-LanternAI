// Live weather service for Victoria, BC using Open-Meteo API (free, no API key required)

// Victoria, BC coordinates
const VICTORIA_LAT = 48.4284;
const VICTORIA_LON = -123.3656;

export type WeatherCondition = "sunny" | "cloudy" | "rainy" | "cold" | "warm" | "snowy" | "stormy";

export interface WeatherData {
  condition: WeatherCondition;
  temperature: number; // Celsius
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  description: string;
  isDay: boolean;
  lastUpdated: Date;
}

// Weather code mapping from Open-Meteo WMO codes
// https://open-meteo.com/en/docs
function mapWeatherCode(code: number, temperature: number, isDay: boolean): { condition: WeatherCondition; description: string } {
  // Clear sky
  if (code === 0) {
    if (temperature < 5) return { condition: "cold", description: "Clear and cold" };
    if (temperature > 20) return { condition: "warm", description: "Clear and warm" };
    return { condition: "sunny", description: isDay ? "Clear sky" : "Clear night" };
  }

  // Mainly clear, partly cloudy
  if (code === 1 || code === 2) {
    if (temperature < 5) return { condition: "cold", description: "Partly cloudy and cold" };
    if (temperature > 20) return { condition: "warm", description: "Partly cloudy and warm" };
    return { condition: "sunny", description: "Partly cloudy" };
  }

  // Overcast
  if (code === 3) {
    if (temperature < 5) return { condition: "cold", description: "Overcast and cold" };
    return { condition: "cloudy", description: "Overcast" };
  }

  // Fog
  if (code >= 45 && code <= 48) {
    return { condition: "cloudy", description: "Foggy" };
  }

  // Drizzle
  if (code >= 51 && code <= 57) {
    return { condition: "rainy", description: "Light drizzle" };
  }

  // Rain
  if (code >= 61 && code <= 67) {
    if (code === 61) return { condition: "rainy", description: "Light rain" };
    if (code === 63) return { condition: "rainy", description: "Moderate rain" };
    return { condition: "rainy", description: "Heavy rain" };
  }

  // Snow
  if (code >= 71 && code <= 77) {
    return { condition: "snowy", description: "Snow" };
  }

  // Rain showers
  if (code >= 80 && code <= 82) {
    return { condition: "rainy", description: "Rain showers" };
  }

  // Snow showers
  if (code >= 85 && code <= 86) {
    return { condition: "snowy", description: "Snow showers" };
  }

  // Thunderstorm
  if (code >= 95 && code <= 99) {
    return { condition: "stormy", description: "Thunderstorm" };
  }

  // Default fallback
  return { condition: "cloudy", description: "Cloudy" };
}

// Cache key for localStorage
const WEATHER_CACHE_KEY = "lantern_weather_cache";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

interface CachedWeather {
  data: WeatherData;
  timestamp: number;
}

function getCachedWeather(): WeatherData | null {
  try {
    const cached = localStorage.getItem(WEATHER_CACHE_KEY);
    if (!cached) return null;

    const parsed: CachedWeather = JSON.parse(cached);
    const now = Date.now();

    // Check if cache is still valid
    if (now - parsed.timestamp < CACHE_DURATION_MS) {
      return {
        ...parsed.data,
        lastUpdated: new Date(parsed.data.lastUpdated),
      };
    }

    return null;
  } catch {
    return null;
  }
}

function setCachedWeather(data: WeatherData): void {
  try {
    const cached: CachedWeather = {
      data,
      timestamp: Date.now(),
    };
    localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(cached));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchVictoriaWeather(): Promise<WeatherData> {
  // Check cache first
  const cached = getCachedWeather();
  if (cached) {
    return cached;
  }

  try {
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude", VICTORIA_LAT.toString());
    url.searchParams.set("longitude", VICTORIA_LON.toString());
    url.searchParams.set("current", "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,is_day");
    url.searchParams.set("timezone", "America/Vancouver");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();
    const current = data.current;

    const temperature = current.temperature_2m;
    const isDay = current.is_day === 1;
    const { condition, description } = mapWeatherCode(current.weather_code, temperature, isDay);

    const weatherData: WeatherData = {
      condition,
      temperature: Math.round(temperature),
      feelsLike: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeed: Math.round(current.wind_speed_10m),
      description,
      isDay,
      lastUpdated: new Date(),
    };

    // Cache the result
    setCachedWeather(weatherData);

    return weatherData;
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    // Return fallback weather data
    return getFallbackWeather();
  }
}

function getFallbackWeather(): WeatherData {
  // Fallback based on typical Victoria weather patterns
  const month = new Date().getMonth();
  const hour = new Date().getHours();
  const isDay = hour >= 7 && hour < 20;

  let condition: WeatherCondition;
  let temperature: number;
  let description: string;

  // Victoria weather by season
  if (month >= 10 || month <= 2) {
    // Nov-Feb: Rainy/cold
    condition = Math.random() < 0.6 ? "rainy" : "cloudy";
    temperature = Math.round(5 + Math.random() * 5);
    description = condition === "rainy" ? "Light rain" : "Overcast";
  } else if (month >= 6 && month <= 8) {
    // Jun-Aug: Sunny/warm
    condition = Math.random() < 0.7 ? "sunny" : "warm";
    temperature = Math.round(18 + Math.random() * 8);
    description = "Clear sky";
  } else {
    // Spring/Fall: Mixed
    condition = Math.random() < 0.5 ? "cloudy" : "sunny";
    temperature = Math.round(10 + Math.random() * 8);
    description = condition === "cloudy" ? "Partly cloudy" : "Clear";
  }

  return {
    condition,
    temperature,
    feelsLike: temperature - 2,
    humidity: 70,
    windSpeed: 10,
    description,
    isDay,
    lastUpdated: new Date(),
  };
}

// Map weather condition to greeting weather type
export function toGreetingWeather(condition: WeatherCondition): "sunny" | "cloudy" | "rainy" | "cold" | "warm" {
  switch (condition) {
    case "sunny":
    case "warm":
      return "sunny";
    case "rainy":
    case "stormy":
      return "rainy";
    case "cold":
    case "snowy":
      return "cold";
    case "cloudy":
    default:
      return "cloudy";
  }
}
