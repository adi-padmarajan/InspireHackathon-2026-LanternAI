// Dynamic greeting system based on time of day and weather conditions

export interface GreetingContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  weather?: "sunny" | "cloudy" | "rainy" | "cold" | "warm";
  userName?: string;
}

const getTimeOfDay = (): GreetingContext["timeOfDay"] => {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
};

// Simulated weather for Victoria, BC (in real app, would fetch from API)
const getSimulatedWeather = (): GreetingContext["weather"] => {
  const month = new Date().getMonth();
  const random = Math.random();
  
  // Victoria weather patterns
  if (month >= 10 || month <= 2) {
    // Nov-Feb: Mostly rainy/cold
    if (random < 0.6) return "rainy";
    if (random < 0.85) return "cloudy";
    return "cold";
  } else if (month >= 6 && month <= 8) {
    // Jun-Aug: Mostly sunny/warm
    if (random < 0.7) return "sunny";
    if (random < 0.9) return "warm";
    return "cloudy";
  } else {
    // Spring/Fall: Mixed
    if (random < 0.3) return "sunny";
    if (random < 0.6) return "cloudy";
    if (random < 0.8) return "rainy";
    return "warm";
  }
};

export const getGreetingContext = (userName?: string): GreetingContext => ({
  timeOfDay: getTimeOfDay(),
  weather: getSimulatedWeather(),
  userName,
});

interface GreetingMessage {
  main: string;
  sub: string;
  emoji: string;
}

const greetings: Record<string, GreetingMessage[]> = {
  // Time-based greetings
  "morning-sunny": [
    { main: "What a beautiful morning", sub: "The sun is out to greet you today", emoji: "☀️" },
    { main: "Rise and shine", sub: "It's a gorgeous day in Victoria", emoji: "🌅" },
  ],
  "morning-cloudy": [
    { main: "Good morning", sub: "A gentle start to your day", emoji: "🌤️" },
    { main: "Hello there", sub: "Ready to make the most of today?", emoji: "☁️" },
  ],
  "morning-rainy": [
    { main: "Cozy rainy morning", sub: "Perfect weather for a warm drink", emoji: "🌧️" },
    { main: "It's a bit grey out there", sub: "But I'm here to brighten your day", emoji: "☔" },
  ],
  "morning-cold": [
    { main: "Brr, chilly morning!", sub: "I hope you're staying warm", emoji: "🥶" },
    { main: "Bundle up out there", sub: "It's quite cold today", emoji: "❄️" },
  ],
  "afternoon-sunny": [
    { main: "What a lovely afternoon", sub: "Hope you're enjoying the sunshine", emoji: "☀️" },
    { main: "Beautiful day, isn't it?", sub: "Perfect for a walk around campus", emoji: "🌞" },
  ],
  "afternoon-cloudy": [
    { main: "Good afternoon", sub: "How's your day going so far?", emoji: "⛅" },
    { main: "Hope you're having a good one", sub: "I'm here whenever you need me", emoji: "🌥️" },
  ],
  "afternoon-rainy": [
    { main: "Rainy afternoon vibes", sub: "I hope you're somewhere cozy", emoji: "🌧️" },
    { main: "The rain is really coming down", sub: "Sending warm thoughts your way", emoji: "☔" },
  ],
  "afternoon-cold": [
    { main: "It's pretty cold out there", sub: "I hope you're holding up well", emoji: "🧣" },
    { main: "Stay warm out there", sub: "Victoria winters can be tough", emoji: "❄️" },
  ],
  "evening-sunny": [
    { main: "Beautiful evening", sub: "Hope you had a wonderful day", emoji: "🌅" },
    { main: "Golden hour vibes", sub: "What a lovely time of day", emoji: "🌇" },
  ],
  "evening-cloudy": [
    { main: "Good evening", sub: "Winding down for the day?", emoji: "🌆" },
    { main: "Evening already", sub: "Time flies, doesn't it?", emoji: "🌃" },
  ],
  "evening-rainy": [
    { main: "Rainy evening", sub: "Perfect for staying in and relaxing", emoji: "🌧️" },
    { main: "Quiet rainy night ahead", sub: "I hope you're somewhere comfortable", emoji: "☔" },
  ],
  "evening-cold": [
    { main: "Cold evening out there", sub: "Stay warm and cozy tonight", emoji: "🧥" },
    { main: "Chilly night ahead", sub: "Hot cocoa weather, perhaps?", emoji: "☕" },
  ],
  "night-sunny": [
    { main: "Still up?", sub: "I'm here whenever you need", emoji: "🌙" },
    { main: "Late night thoughts?", sub: "Let's chat", emoji: "✨" },
  ],
  "night-cloudy": [
    { main: "Quiet night", sub: "I'm here if you can't sleep", emoji: "🌙" },
    { main: "Burning the midnight oil?", sub: "Remember to rest soon", emoji: "💫" },
  ],
  "night-rainy": [
    { main: "Rainy night", sub: "Let the sound of rain soothe you", emoji: "🌧️" },
    { main: "Night rain is peaceful", sub: "I hope you're resting well", emoji: "☔" },
  ],
  "night-cold": [
    { main: "Cold night out there", sub: "Stay warm and get some rest", emoji: "❄️" },
    { main: "Chilly evening", sub: "Hope you're tucked in somewhere cozy", emoji: "🌙" },
  ],
};

// Fallback greetings
const fallbackGreetings: Record<GreetingContext["timeOfDay"], GreetingMessage> = {
  morning: { main: "Good morning", sub: "Ready to start your day?", emoji: "🌅" },
  afternoon: { main: "Good afternoon", sub: "How's your day going?", emoji: "☀️" },
  evening: { main: "Good evening", sub: "Hope you had a good day", emoji: "🌆" },
  night: { main: "Hello there", sub: "I'm here whenever you need", emoji: "🌙" },
};

export const getGreeting = (context: GreetingContext): GreetingMessage => {
  const key = `${context.timeOfDay}-${context.weather || "cloudy"}`;
  const options = greetings[key];
  
  if (options && options.length > 0) {
    return options[Math.floor(Math.random() * options.length)];
  }
  
  return fallbackGreetings[context.timeOfDay];
};

export const getPersonalizedGreeting = (userName?: string): GreetingMessage & { userName?: string } => {
  const context = getGreetingContext(userName);
  const greeting = getGreeting(context);
  
  return {
    ...greeting,
    userName,
  };
};
