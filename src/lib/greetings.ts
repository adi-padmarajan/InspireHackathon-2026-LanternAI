// Dynamic greeting system based on time of day and live weather conditions

export type GreetingWeather = "sunny" | "cloudy" | "rainy" | "cold" | "warm";
export type GreetingSeason = "winter" | "spring" | "summer" | "fall";
export type GreetingDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export interface GreetingContext {
  timeOfDay: "morning" | "afternoon" | "evening" | "night";
  weather: GreetingWeather;
  userName?: string;
  season?: GreetingSeason;
  dayOfWeek?: GreetingDay;
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
  season: getSeason(),
  dayOfWeek: getDayOfWeek(),
});

interface GreetingMessage {
  main: string;
  sub: string;
  emoji: string;
}

const getSeason = (): GreetingSeason => {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  if (month >= 8 && month <= 10) return "fall";
  return "winter";
};

const getDayOfWeek = (): GreetingDay => {
  const day = new Date().getDay();
  switch (day) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
    default:
      return "sunday";
  }
};

const dayGreetings: Record<GreetingDay, string[]> = {
  monday: [
    "Monday energy",
    "Gentle Monday",
  ],
  tuesday: [
    "Tuesday groove",
    "Steady Tuesday",
  ],
  wednesday: [
    "Midweek moment",
    "Wednesday lift",
  ],
  thursday: [
    "Thursday pace",
    "Almost-there Thursday",
  ],
  friday: [
    "Friday glow",
    "Happy Friday",
  ],
  saturday: [
    "Saturday slow",
    "Weekend ease",
  ],
  sunday: [
    "Sunday softness",
    "Quiet Sunday",
  ],
};

const seasonGreetings: Record<GreetingSeason, string[]> = {
  winter: [
    "Winter coziness",
    "Soft winter light",
  ],
  spring: [
    "Spring fresh start",
    "Spring renewal",
  ],
  summer: [
    "Summer light",
    "Easy summer",
  ],
  fall: [
    "Autumn calm",
    "Crisp fall air",
  ],
};

const greetings: Record<string, GreetingMessage[]> = {
  // --- MORNING: High energy & caffeine-dependent ---
  "morning-sunny": [
    { main: "Top of the morning", sub: "Easy start, bright sky", emoji: "😎" },
    { main: "Wakey wakey", sub: "No-stress morning, just you", emoji: "☕" },
  ],
  "morning-cloudy": [
    { main: "Morning check-in", sub: "Soft skies, steady start", emoji: "☁️" },
    { main: "Rise and shine", sub: "Only rise today, shine later", emoji: "🌫️" },
  ],
  "morning-rainy": [
    { main: "Happy splashing", sub: "Extra ten minutes granted", emoji: "🌧️" },
    { main: "Rainy morning", sub: "Cozy drizzle, gentle start", emoji: "☔" },
  ],
  "morning-cold": [
    { main: "Frosty morning", sub: "Coffee first, blanket second", emoji: "❄️" },
    { main: "Brrr-illiant start", sub: "Big coat, small worries", emoji: "🧣" },
  ],

  // --- AFTERNOON: The "3 PM slump" cure ---
  "afternoon-sunny": [
    { main: "You are thriving", sub: "Soak up a little sun", emoji: "🌻" },
    { main: "Afternoon glow", sub: "Quiet victory lap time", emoji: "🏃" },
  ],
  "afternoon-cloudy": [
    { main: "Happy 'Almost-Done' Day", sub: "Soft light, steady pace", emoji: "🌥️" },
    { main: "Midday check-in", sub: "Doing enough is plenty", emoji: "🙌" },
  ],
  "afternoon-rainy": [
    { main: "Main character weather", sub: "Window watching approved", emoji: "☕" },
    { main: "Afternoon splash", sub: "Sky confetti, slow afternoon", emoji: "💧" },
  ],
  "afternoon-cold": [
    { main: "Stay frosty", sub: "Warm up, take it slow", emoji: "🧊" },
    { main: "Ice ice vibes", sub: "Too cool for the chill", emoji: "🕶️" },
  ],

  // --- EVENING: Log-off & snack energy ---
  "evening-sunny": [
    { main: "Golden hour looks good on you", sub: "Let the to-do list go", emoji: "🌇" },
    { main: "Evening glow", sub: "Celebrate by sitting down", emoji: "🎸" },
  ],
  "evening-cloudy": [
    { main: "The vibes are immaculate", sub: "Dim lights, snack time", emoji: "🥨" },
    { main: "Evening calm", sub: "This is your relax sign", emoji: "🕯️" },
  ],
  "evening-rainy": [
    { main: "Cozy levels: Maximum", sub: "Rainy calm, cozy night", emoji: "🍵" },
    { main: "Dry socks energy", sub: "Time for blanket burrito", emoji: "🌯" },
  ],
  "evening-cold": [
    { main: "The 'Big Coat' club", sub: "Warm drink, no demands", emoji: "🍫" },
    { main: "Chilly evening", sub: "Hibernate mode, optional", emoji: "🐻" },
  ],

  // --- NIGHT: Late night thoughts & humor ---
  "night-sunny": [
    { main: "Still awake", sub: "You are the brightest", emoji: "✨" },
    { main: "Late night legend", sub: "Overthinking or vibing", emoji: "🦉" },
  ],
  "night-cloudy": [
    { main: "Night night", sub: "Stars are sleeping too", emoji: "💤" },
    { main: "Midnight club", sub: "Bed misses you, honestly", emoji: "🛌" },
  ],
  "night-rainy": [
    { main: "Midnight rain", sub: "Dreaming time, maybe plotting", emoji: "🌌" },
    { main: "Night owl mode", sub: "Rain on the roof, perfect", emoji: "🎧" },
  ],
  "night-cold": [
    { main: "Freezing night", sub: "Three blankets, minimum", emoji: "🥶" },
    { main: "Frost-byte night", sub: "Warm heart, tucked-in feet", emoji: "🧦" },
  ],
};

const fallbackGreetings: Record<GreetingContext["timeOfDay"], GreetingMessage> = {
  morning: { main: "Morning to you", sub: "Average or epic, your call", emoji: "☀️" },
  afternoon: { main: "Hey there", sub: "You are doing amazing", emoji: "💅" },
  evening: { main: "Good evening", sub: "Unclench, breathe, snack", emoji: "🍕" },
  night: { main: "Still up", sub: "Sleep now, breakfast sooner", emoji: "🥞" },
};

export const getGreeting = (context: GreetingContext): GreetingMessage => {
  const key = `${context.timeOfDay}-${context.weather || "cloudy"}`;
  const options = greetings[key];
  
  const joinSub = (dayLine: string, seasonLine: string, baseSub: string) =>
    `${dayLine} · ${seasonLine} · ${baseSub}`;

  if (options && options.length > 0) {
    const baseGreeting = options[Math.floor(Math.random() * options.length)];
    const day = context.dayOfWeek ?? getDayOfWeek();
    const season = context.season ?? getSeason();
    const dayLine = dayGreetings[day][Math.floor(Math.random() * dayGreetings[day].length)];
    const seasonLine = seasonGreetings[season][Math.floor(Math.random() * seasonGreetings[season].length)];

    return {
      ...baseGreeting,
      sub: joinSub(dayLine, seasonLine, baseGreeting.sub),
    };
  }

  const fallback = fallbackGreetings[context.timeOfDay];
  const day = context.dayOfWeek ?? getDayOfWeek();
  const season = context.season ?? getSeason();
  const dayLine = dayGreetings[day][Math.floor(Math.random() * dayGreetings[day].length)];
  const seasonLine = seasonGreetings[season][Math.floor(Math.random() * seasonGreetings[season].length)];

  return {
    ...fallback,
    sub: joinSub(dayLine, seasonLine, fallback.sub),
  };
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
