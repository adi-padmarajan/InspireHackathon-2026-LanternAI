/**
 * Chat Mode Configuration
 * Aligned with the 6 dimensions of wellness + seasonal depression support
 */

import {
  Heart,
  Brain,
  BookOpen,
  Sparkles,
  Leaf,
  Users,
  Sun,
  type LucideIcon,
} from "lucide-react";

export type ChatMode =
  | "physical"
  | "emotional"
  | "intellectual"
  | "spiritual"
  | "environmental"
  | "social"
  | "seasonal";

export interface ModeConfig {
  id: ChatMode;
  label: string;
  shortLabel: string;
  description: string;
  icon: LucideIcon;
  iconColor: string;
  gradient: string;
  greeting: string;
  quickPrompts: {
    label: string;
    prompt: string;
    description: string;
  }[];
}

export const chatModeConfigs: Record<ChatMode, ModeConfig> = {
  physical: {
    id: "physical",
    label: "Physical Wellness",
    shortLabel: "Physical",
    description: "Exercise, nutrition, sleep, and body awareness",
    icon: Heart,
    iconColor: "text-rose-500",
    gradient: "from-rose-500/10 to-pink-500/10",
    greeting: `Welcome! I'm here to support your physical wellness. 💪

Whether it's sleep, movement, nutrition, or energy—let's find what works for your body and student lifestyle.

What would you like to focus on?`,
    quickPrompts: [
      {
        label: "Improve my sleep",
        prompt: "I'm struggling with sleep as a student. Can you help?",
        description: "Sleep hygiene and routines",
      },
      {
        label: "Quick exercises",
        prompt: "What are some quick exercises I can do between classes?",
        description: "Movement for busy students",
      },
      {
        label: "Healthy eating tips",
        prompt: "How can I eat healthier on a student budget?",
        description: "Nutrition on campus",
      },
      {
        label: "Energy management",
        prompt: "I'm always tired. How can I boost my energy naturally?",
        description: "Combat fatigue",
      },
    ],
  },

  emotional: {
    id: "emotional",
    label: "Emotional Wellness",
    shortLabel: "Emotional",
    description: "Understanding, expressing, and managing emotions",
    icon: Brain,
    iconColor: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
    greeting: `I'm here to support your emotional wellbeing. 💜

Whatever you're feeling—stress, anxiety, sadness, or just need someone to listen—this is a safe space. No judgment, just support.

How are you feeling today?`,
    quickPrompts: [
      {
        label: "I'm feeling stressed",
        prompt: "I'm feeling really stressed and overwhelmed lately",
        description: "Stress relief strategies",
      },
      {
        label: "Help with anxiety",
        prompt: "I've been experiencing a lot of anxiety",
        description: "Coping techniques",
      },
      {
        label: "Process emotions",
        prompt: "I'm having trouble understanding how I feel",
        description: "Emotional clarity",
      },
      {
        label: "Coping strategies",
        prompt: "What are healthy ways to cope with difficult emotions?",
        description: "Emotional regulation tools",
      },
    ],
  },

  intellectual: {
    id: "intellectual",
    label: "Intellectual Wellness",
    shortLabel: "Intellectual",
    description: "Learning, creativity, and mental stimulation",
    icon: BookOpen,
    iconColor: "text-blue-500",
    gradient: "from-blue-500/10 to-cyan-500/10",
    greeting: `Let's nurture your intellectual wellness! 📚

University is about growth—but it should also be enjoyable. I can help with study strategies, focus, creative outlets, and finding balance.

What's on your mind?`,
    quickPrompts: [
      {
        label: "Study strategies",
        prompt: "What are effective study strategies for university?",
        description: "Optimize learning",
      },
      {
        label: "Focus techniques",
        prompt: "I have trouble focusing. What techniques can help?",
        description: "Concentration tips",
      },
      {
        label: "Academic stress",
        prompt: "I'm stressed about my grades and performance",
        description: "Academic pressure",
      },
      {
        label: "Creative outlets",
        prompt: "I want to explore creative hobbies outside academics",
        description: "Creative wellness",
      },
    ],
  },

  spiritual: {
    id: "spiritual",
    label: "Spiritual Wellness",
    shortLabel: "Spiritual",
    description: "Purpose, meaning, mindfulness, and inner peace",
    icon: Sparkles,
    iconColor: "text-amber-500",
    gradient: "from-amber-500/10 to-yellow-500/10",
    greeting: `Welcome to a space for reflection and meaning. ✨

Spiritual wellness isn't about religion—it's about purpose, values, and inner peace. I'm here to explore these with you.

What would you like to reflect on?`,
    quickPrompts: [
      {
        label: "Find my purpose",
        prompt: "I'm struggling to find meaning in what I'm doing",
        description: "Purpose and direction",
      },
      {
        label: "Mindfulness practice",
        prompt: "Can you guide me through a mindfulness exercise?",
        description: "Present-moment awareness",
      },
      {
        label: "Gratitude practice",
        prompt: "I want to start a gratitude practice",
        description: "Cultivate appreciation",
      },
      {
        label: "Values alignment",
        prompt: "I feel like my life doesn't align with my values",
        description: "Living authentically",
      },
    ],
  },

  environmental: {
    id: "environmental",
    label: "Environmental Wellness",
    shortLabel: "Environmental",
    description: "Your relationship with spaces and nature",
    icon: Leaf,
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/10 to-green-500/10",
    greeting: `Let's explore your environmental wellness! 🌿

Your surroundings deeply affect your wellbeing. From study spaces to nature connection—let's optimize your environment.

What aspect would you like to explore?`,
    quickPrompts: [
      {
        label: "Study environment",
        prompt: "How can I create a better study environment?",
        description: "Optimize your space",
      },
      {
        label: "Nature connection",
        prompt: "How can I connect more with nature at UVic?",
        description: "Outdoor wellness",
      },
      {
        label: "Campus spaces",
        prompt: "What are the best quiet spaces on campus?",
        description: "Find your spot",
      },
      {
        label: "Eco-wellness",
        prompt: "How can sustainable living improve my wellbeing?",
        description: "Green living tips",
      },
    ],
  },

  social: {
    id: "social",
    label: "Social Wellness",
    shortLabel: "Social",
    description: "Meaningful relationships and community",
    icon: Users,
    iconColor: "text-indigo-500",
    gradient: "from-indigo-500/10 to-blue-500/10",
    greeting: `Hi! I'm here to help with social wellness. 🤝

Making connections can feel challenging. I can help you explore clubs, build social confidence, and create meaningful relationships—at your own pace.

What would you like to work on?`,
    quickPrompts: [
      {
        label: "Making friends",
        prompt: "How do I make friends at university?",
        description: "Build connections",
      },
      {
        label: "Explore clubs",
        prompt: "What clubs might be good for someone who's shy?",
        description: "Find your community",
      },
      {
        label: "Social anxiety",
        prompt: "I get anxious in social situations. How can I cope?",
        description: "Social confidence",
      },
      {
        label: "Healthy boundaries",
        prompt: "How do I set healthy boundaries with people?",
        description: "Protect your energy",
      },
    ],
  },

  seasonal: {
    id: "seasonal",
    label: "Seasonal Support",
    shortLabel: "Seasonal",
    description: "Proactive support for Victoria's dark winters",
    icon: Sun,
    iconColor: "text-orange-500",
    gradient: "from-orange-500/10 to-amber-500/10",
    greeting: `Hey! I'm your Seasonal Support companion. ☀️

Victoria's grey, rainy winters can be tough—and that's completely normal. I'm here with evidence-based strategies for light therapy, vitamin D, activity ideas, and mood boosters.

How are you handling the season?`,
    quickPrompts: [
      {
        label: "Light therapy",
        prompt: "Tell me about light therapy for seasonal depression",
        description: "Combat lack of sunlight",
      },
      {
        label: "Winter activities",
        prompt: "What activities can help with the winter blues?",
        description: "Stay active in dark months",
      },
      {
        label: "Vitamin D tips",
        prompt: "Should I be taking vitamin D supplements?",
        description: "Nutrition for grey days",
      },
      {
        label: "Morning routines",
        prompt: "How can I build a routine to fight seasonal depression?",
        description: "Healthy winter habits",
      },
    ],
  },
};

// Get all modes as an array for iteration
export const allModes = Object.values(chatModeConfigs);

// Helper to get mode config
export function getModeConfig(mode: ChatMode): ModeConfig {
  return chatModeConfigs[mode];
}
