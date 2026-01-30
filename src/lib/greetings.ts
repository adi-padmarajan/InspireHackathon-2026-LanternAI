// Dynamic greeting system based on time of day and live weather conditions

export type GreetingWeather = "sunny" | "cloudy" | "rainy" | "cold" | "warm";

export interface GreetingContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  weather: GreetingWeather;
  userName?: string;
}

export const getTimeOfDay = (): GreetingContext["timeOfDay"] => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

export const getGreetingContext = (
  userName?: string,
  weather: GreetingWeather = "cloudy"
): GreetingContext => ({
  timeOfDay: getTimeOfDay(),
  weather,
  userName,
});

interface GreetingMessage {
  main: string;
  sub: string;
  emoji: string;
}

const greetings: Record<string, GreetingMessage[]> = {
  // Time-based greetings - friendly, companion-like
  "morning-sunny": [
    { main: "Morning, sunshine", sub: "Feels like a fresh-start kind of day", emoji: "☀️" },
    { main: "Hey, rise and glow", sub: "I saved you the first sip of coffee", emoji: "🌅" },
  ],
  "morning-cloudy": [
    { main: "Morning, friend", sub: "Clouds can't dim your vibe today", emoji: "☁️" },
    { main: "Hey, good morning", sub: "Soft skies, steady heart, let's take it slow", emoji: "🌤️" },
  ],
  "morning-rainy": [
    { main: "Rainy morning, huh", sub: "I've got you, cozy vibes and warm tea", emoji: "🌧️" },
    { main: "Hey, it's a drizzly start", sub: "We can still make today gentle", emoji: "☔" },
  ],
  "morning-cold": [
    { main: "Brr, chilly morning", sub: "Bundle up, I'll keep you company", emoji: "❄️" },
    { main: "Hey, cold out there", sub: "Warm drink plus hoodie equals we've got this", emoji: "🧣" },
  ],
  "afternoon-sunny": [
    { main: "Hey, bright afternoon", sub: "If you can, steal a little sunshine", emoji: "☀️" },
    { main: "Good afternoon, you", sub: "Golden light looks good on you", emoji: "🌞" },
  ],
  "afternoon-cloudy": [
    { main: "Hey there", sub: "Midday check-in, how's your heart?", emoji: "⛅" },
    { main: "Afternoon, friend", sub: "I'm right here for a quick reset", emoji: "🌥️" },
  ],
  "afternoon-rainy": [
    { main: "Rainy afternoon", sub: "Perfect excuse for a cozy break", emoji: "🌧️" },
    { main: "Hey, it's pouring", sub: "Let's keep it soft and slow today", emoji: "☔" },
  ],
  "afternoon-cold": [
    { main: "Cold afternoon", sub: "Stay warm, I'm cheering you on", emoji: "🧥" },
    { main: "Hey, crisp out there", sub: "Maybe a warm drink and a tiny walk?", emoji: "🧣" },
  ],
  "evening-sunny": [
    { main: "Hey, beautiful evening", sub: "Hope the day treated you kindly", emoji: "🌅" },
    { main: "Golden hour hello", sub: "Want to take a slow breath together?", emoji: "🌇" },
  ],
  "evening-cloudy": [
    { main: "Evening, friend", sub: "Let's unwind, I'm all ears", emoji: "🌆" },
    { main: "Hey, soft evening", sub: "The day is done, you did enough", emoji: "🌃" },
  ],
  "evening-rainy": [
    { main: "Rainy evening", sub: "Cozy lights, comfy socks, I'm here", emoji: "🌧️" },
    { main: "Hey, it's a wet night", sub: "Let's settle in and breathe", emoji: "☔" },
  ],
  "evening-cold": [
    { main: "Cold evening", sub: "Wrap up warm, I've got you", emoji: "🧣" },
    { main: "Hey, chilly out", sub: "Hot cocoa energy, all the way", emoji: "☕" },
  ],
  "night-sunny": [
    { main: "Still up, friend", sub: "I'm here for late-night thoughts", emoji: "🌙" },
    { main: "Hey, night owl", sub: "Want to unload a little before sleep?", emoji: "✨" },
  ],
  "night-cloudy": [
    { main: "Hey, it's late", sub: "Can't sleep? Let's slow it down", emoji: "🌙" },
    { main: "Night check-in", sub: "You don't have to hold it alone", emoji: "💫" },
  ],
  "night-rainy": [
    { main: "Rainy night vibes", sub: "Let the rain do the talking, I'm here", emoji: "🌧️" },
    { main: "Hey, rainy night", sub: "Hope you're warm and safe", emoji: "☔" },
  ],
  "night-cold": [
    { main: "Cold night out there", sub: "Tuck in, I'll keep you company", emoji: "❄️" },
    { main: "Hey, chilly night", sub: "Soft lights, slow breaths, you got this", emoji: "🌙" },
  ],
};

// Fallback greetings - friendly and companion-like
const fallbackGreetings: Record<GreetingContext["timeOfDay"], GreetingMessage> = {
  morning: { main: "Morning, friend", sub: "I'm here with you for the day", emoji: "🌅" },
  afternoon: { main: "Hey there", sub: "Quick check-in, how are you really?", emoji: "☀️" },
  evening: { main: "Evening, friend", sub: "Let's unwind together", emoji: "🌆" },
  night: { main: "Hey, night owl", sub: "I'm here whenever you need me", emoji: "🌙" },
};

export const getGreeting = (context: GreetingContext): GreetingMessage => {
  const key = `${context.timeOfDay}-${context.weather || "cloudy"}`;
  const options = greetings[key];
  
  if (options && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }
  
  return fallbackGreetings[context.timeOfDay];
};

export const getPersonalizedGreeting = (
  userName?: string,
  weather: GreetingWeather = "cloudy"
): GreetingMessage & { userName?: string } => {
  const context = getGreetingContext(userName, weather);
  const greeting = getGreeting(context);

  return {
    ...greeting,
    userName,
  };
};
