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
  // Time-based greetings - friendly, companion-like
  "morning-sunny": [
    { main: "Hey, good morning", sub: "Looks like it's gonna be a great day!", emoji: "☀️" },
    { main: "Morning, sleepyhead", sub: "The sun's out and so am I", emoji: "🌅" },
  ],
  "morning-cloudy": [
    { main: "Hey, morning", sub: "Ready to tackle the day together?", emoji: "🌤️" },
    { main: "Good morning, friend", sub: "Let's make today count", emoji: "☁️" },
  ],
  "morning-rainy": [
    { main: "Rainy morning, huh?", sub: "Grab a coffee, I'll keep you company", emoji: "🌧️" },
    { main: "Grey skies, bright vibes", sub: "I'm here to brighten things up", emoji: "☔" },
  ],
  "morning-cold": [
    { main: "Brr, it's chilly!", sub: "Stay warm out there, okay?", emoji: "🥶" },
    { main: "Bundle up, friend", sub: "It's cold but we've got this", emoji: "❄️" },
  ],
  "afternoon-sunny": [
    { main: "Hey, how's your day going?", sub: "Hope you're soaking up some sun", emoji: "☀️" },
    { main: "Afternoon!", sub: "Perfect weather for a campus stroll", emoji: "🌞" },
  ],
  "afternoon-cloudy": [
    { main: "Hey there", sub: "How's your day been so far?", emoji: "⛅" },
    { main: "Good to see you", sub: "I'm always here when you need me", emoji: "🌥️" },
  ],
  "afternoon-rainy": [
    { main: "Rainy afternoon", sub: "Hope you're somewhere cozy", emoji: "🌧️" },
    { main: "It's really coming down", sub: "Perfect excuse to take a break", emoji: "☔" },
  ],
  "afternoon-cold": [
    { main: "Cold one today", sub: "Hope you're keeping warm", emoji: "🧣" },
    { main: "Stay cozy", sub: "Victoria winters are no joke", emoji: "❄️" },
  ],
  "evening-sunny": [
    { main: "Hey, nice evening", sub: "Hope your day was a good one", emoji: "🌅" },
    { main: "Golden hour!", sub: "What a beautiful time of day", emoji: "🌇" },
  ],
  "evening-cloudy": [
    { main: "Evening, friend", sub: "Time to wind down?", emoji: "🌆" },
    { main: "Hey there", sub: "The day flew by, didn't it?", emoji: "🌃" },
  ],
  "evening-rainy": [
    { main: "Rainy evening", sub: "Perfect for chilling indoors", emoji: "🌧️" },
    { main: "Quiet night ahead", sub: "Hope you're somewhere comfortable", emoji: "☔" },
  ],
  "evening-cold": [
    { main: "Cold night out there", sub: "Stay warm and cozy", emoji: "🧥" },
    { main: "Chilly evening", sub: "Hot cocoa kind of night?", emoji: "☕" },
  ],
  "night-sunny": [
    { main: "Still up?", sub: "I'm here if you need to talk", emoji: "🌙" },
    { main: "Late night thoughts?", sub: "Let's chat about it", emoji: "✨" },
  ],
  "night-cloudy": [
    { main: "Hey, night owl", sub: "Can't sleep? I'm here", emoji: "🌙" },
    { main: "Burning the midnight oil?", sub: "Don't forget to rest, okay?", emoji: "💫" },
  ],
  "night-rainy": [
    { main: "Rainy night vibes", sub: "Hope the rain is soothing you", emoji: "🌧️" },
    { main: "Night rain is peaceful", sub: "Hope you're resting well", emoji: "☔" },
  ],
  "night-cold": [
    { main: "Cold night", sub: "Stay warm and get some rest", emoji: "❄️" },
    { main: "Chilly one tonight", sub: "Hope you're tucked in somewhere cozy", emoji: "🌙" },
  ],
};

// Fallback greetings - friendly and companion-like
const fallbackGreetings: Record<GreetingContext["timeOfDay"], GreetingMessage> = {
  morning: { main: "Hey, good morning", sub: "Ready to start the day together?", emoji: "🌅" },
  afternoon: { main: "Hey there", sub: "How's your day going?", emoji: "☀️" },
  evening: { main: "Evening, friend", sub: "Hope your day was good", emoji: "🌆" },
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

export const getPersonalizedGreeting = (userName?: string): GreetingMessage & { userName?: string } => {
  const context = getGreetingContext(userName);
  const greeting = getGreeting(context);
  
  return {
    ...greeting,
    userName,
  };
};
