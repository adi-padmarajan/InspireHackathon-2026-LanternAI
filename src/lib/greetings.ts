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
  // --- MORNING: High energy & caffeine-dependent ---
  "morning-sunny": [
    { main: "Top of the morning", sub: "The sun is doing its job, now it's our turn.", emoji: "😎" },
    { main: "Wakey wakey", sub: "I’ve legally declared it a 'no-stress' zone today.", emoji: "☕" },
  ],
  "morning-cloudy": [
    { main: "Morning check-in", sub: "The sun is just shy, but you don't have to be.", emoji: "☁️" },
    { main: "Rise and shine", sub: "Actually, just 'rise' is fine. Shining can happen later.", emoji: "🌫️" },
  ],
  "morning-rainy": [
    { main: "Happy splashing", sub: "If you're still in bed, I officially grant you 10 more minutes.", emoji: "🌧️" },
    { main: "Rainy morning", sub: "Aggressively cozy vibes today, don't you think?", emoji: "☔" },
  ],
  "morning-cold": [
    { main: "Frosty morning", sub: "Current mood: 80% coffee, 20% blanket.", emoji: "❄️" },
    { main: "Brrr-illiant start", sub: "Bundle up! It’s 'big coat' weather out there.", emoji: "🧣" },
  ],

  // --- AFTERNOON: The "3 PM slump" cure ---
  "afternoon-sunny": [
    { main: "You are thriving", sub: "Don't forget to photosynthesize for a bit.", emoji: "🌻" },
    { main: "Afternoon glow", sub: "Is it too early for a victory lap? I don't think so.", emoji: "🏃" },
  ],
  "afternoon-cloudy": [
    { main: "Happy 'Almost-Done' Day", sub: "The clouds are just nature's giant soft-box.", emoji: "🌥️" },
    { main: "Midday check-in", sub: "You’re doing great. Or you’re doing 'enough,' which is also great.", emoji: "🙌" },
  ],
  "afternoon-rainy": [
    { main: "Main character weather", sub: "Staring out the window pensively? I support it.", emoji: "☕" },
    { main: "Afternoon splash", sub: "The rain is just sky-confetti. Celebrate accordingly.", emoji: "💧" },
  ],
  "afternoon-cold": [
    { main: "Stay frosty", sub: "Actually, don't. Stay warm. Frosty is bad.", emoji: "🧊" },
    { main: "Ice ice vibes", sub: "You're too cool for this weather anyway.", emoji: "🕶️" },
  ],

  // --- EVENING: Log-off & snack energy ---
  "evening-sunny": [
    { main: "Golden hour looks good on you", sub: "The sun is setting on your to-do list. Let it go.", emoji: "🌇" },
    { main: "Evening glow", sub: "You survived the day! Let’s celebrate with... sitting down.", emoji: "🎸" },
  ],
  "evening-cloudy": [
    { main: "The vibes are immaculate", sub: "Dim the lights, clear the mind, find the snacks.", emoji: "🥨" },
    { main: "Evening calm", sub: "If you’re waiting for a sign to relax, this is it.", emoji: "🕯️" },
  ],
  "evening-rainy": [
    { main: "Cozy levels: Maximum", sub: "The rain is basically a white noise machine for your soul.", emoji: "🍵" },
    { main: "Dry socks energy", sub: "Time to become a professional blanket burrito.", emoji: "🌯" },
  ],
  "evening-cold": [
    { main: "The 'Big Coat' club", sub: "You’ve officially earned a warm drink and zero responsibilities.", emoji: "🍫" },
    { main: "Chilly evening", sub: "Let's hibernate until further notice.", emoji: "🐻" },
  ],

  // --- NIGHT: Late night thoughts & humor ---
  "night-sunny": [
    { main: "Still awake", sub: "The moon is out, but you’re still the brightest thing here.", emoji: "✨" },
    { main: "Late night legend", sub: "Doing some quality overthinking, or just vibing?", emoji: "🦉" },
  ],
  "night-cloudy": [
    { main: "Night night", sub: "The stars are sleeping, maybe we should consider it too?", emoji: "💤" },
    { main: "Midnight club", sub: "I’m not saying we should sleep, but the bed misses you.", emoji: "🛌" },
  ],
  "night-rainy": [
    { main: "Midnight rain", sub: "Perfect for dreaming or plotting world domination.", emoji: "🌌" },
    { main: "Night owl mode", sub: "Rain on the roof is the best soundtrack for doing nothing.", emoji: "🎧" },
  ],
  "night-cold": [
    { main: "Freezing night", sub: "If you aren't under three layers of blankets, what are you even doing?", emoji: "🥶" },
    { main: "Frost-byte night", sub: "Keep the heart warm and the feet tucked in.", emoji: "🧦" },
  ],
};

const fallbackGreetings: Record<GreetingContext["timeOfDay"], GreetingMessage> = {
  morning: { main: "Morning to you", sub: "Let's make today remarkably average or totally epic.", emoji: "☀️" },
  afternoon: { main: "Hey there", sub: "Quick status report: You're doing amazing, sweetie.", emoji: "💅" },
  evening: { main: "Good evening", sub: "Unclench your jaw, drop your shoulders, find a snack.", emoji: "🍕" },
  night: { main: "Still up", sub: "Sleep is just a time machine to breakfast, you know.", emoji: "🥞" },
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
