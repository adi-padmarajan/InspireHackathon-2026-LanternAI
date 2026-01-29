/**
 * Chat Mode Configuration
 * Defines 6 specialized support modes with their unique identities,
 * greetings, quick prompts, and system behaviors.
 */

import {
  Heart,
  Users,
  Brain,
  Globe,
  Sun,
  BookOpen,
  type LucideIcon,
} from "lucide-react";

export type ChatMode =
  | "wellness"
  | "social"
  | "mental_health"
  | "international"
  | "seasonal"
  | "resources";

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
  wellness: {
    id: "wellness",
    label: "Wellness Companion",
    shortLabel: "Wellness",
    description: "24/7 support for stress, anxiety, and seasonal challenges",
    icon: Heart,
    iconColor: "text-rose-500",
    gradient: "from-rose-500/10 to-pink-500/10",
    greeting: `Welcome! I'm your Wellness Companion, here for you 24/7. 💚

Whether you're feeling stressed, anxious, or just need someone to listen—I'm here. No judgment, just support.

What's on your mind today?`,
    quickPrompts: [
      {
        label: "I'm feeling overwhelmed",
        prompt: "I'm feeling really overwhelmed and stressed lately",
        description: "Get support for stress and burnout",
      },
      {
        label: "Help with anxiety",
        prompt: "I've been experiencing a lot of anxiety",
        description: "Coping strategies and grounding techniques",
      },
      {
        label: "Need to talk",
        prompt: "I just need someone to talk to right now",
        description: "Casual supportive conversation",
      },
      {
        label: "Self-care tips",
        prompt: "Can you suggest some self-care activities?",
        description: "Practical wellness suggestions",
      },
    ],
  },

  social: {
    id: "social",
    label: "Social Courage Builder",
    shortLabel: "Social",
    description: "Low-pressure club exploration and social skills",
    icon: Users,
    iconColor: "text-emerald-500",
    gradient: "from-emerald-500/10 to-teal-500/10",
    greeting: `Hi there! I'm your Social Courage Builder. 🌱

Making connections at university can feel daunting—I get it. I'm here to help you explore clubs at your own pace, practice conversations, and build social confidence step by step.

No pressure, just progress. What would you like to work on?`,
    quickPrompts: [
      {
        label: "Explore clubs",
        prompt: "What clubs might be good for someone who's shy?",
        description: "Find low-pressure ways to connect",
      },
      {
        label: "Conversation tips",
        prompt: "How do I start conversations with new people?",
        description: "Practice social skills",
      },
      {
        label: "Join a group",
        prompt: "I want to join a club but I'm nervous about going alone",
        description: "Strategies for first meetings",
      },
      {
        label: "Making friends",
        prompt: "How do I make friends at university?",
        description: "Build meaningful connections",
      },
    ],
  },

  mental_health: {
    id: "mental_health",
    label: "Mental Health Support",
    shortLabel: "Mental Health",
    description: "Mood tracking, resources, and supportive guidance",
    icon: Brain,
    iconColor: "text-violet-500",
    gradient: "from-violet-500/10 to-purple-500/10",
    greeting: `I'm here to support your mental health journey. 💜

Whether you want to track your mood, learn coping strategies, or just need a safe space to express yourself—I'm listening. Remember: seeking support is strength, not weakness.

How are you feeling today?`,
    quickPrompts: [
      {
        label: "Check my mood",
        prompt: "I want to check in about how I'm feeling today",
        description: "Mood awareness and tracking",
      },
      {
        label: "Coping strategies",
        prompt: "What are some healthy coping strategies for difficult emotions?",
        description: "Tools for emotional regulation",
      },
      {
        label: "Find counselling",
        prompt: "How do I access counselling services at UVic?",
        description: "Professional support options",
      },
      {
        label: "Crisis resources",
        prompt: "What crisis resources are available if I need urgent help?",
        description: "Immediate support contacts",
      },
    ],
  },

  international: {
    id: "international",
    label: "International Mode",
    shortLabel: "International",
    description: "Cultural guidance, academic norms, and settlement support",
    icon: Globe,
    iconColor: "text-indigo-500",
    gradient: "from-indigo-500/10 to-blue-500/10",
    greeting: `Welcome! I'm here to help international students thrive at UVic. 🌍

Moving to a new country is brave—and sometimes confusing. I can help you navigate Canadian culture, understand academic expectations, and connect with resources designed for you.

What would you like help with?`,
    quickPrompts: [
      {
        label: "Academic culture",
        prompt: "Can you explain Canadian academic culture and expectations?",
        description: "Understand classroom norms",
      },
      {
        label: "Visa questions",
        prompt: "I have questions about my study permit",
        description: "Immigration resources and guidance",
      },
      {
        label: "Cultural adjustment",
        prompt: "I'm struggling with cultural differences",
        description: "Adapting to life in Canada",
      },
      {
        label: "International services",
        prompt: "What services are available for international students?",
        description: "Find specialized support",
      },
    ],
  },

  seasonal: {
    id: "seasonal",
    label: "Seasonal Support",
    shortLabel: "Seasonal",
    description: "Proactive tips for Victoria's dark winters",
    icon: Sun,
    iconColor: "text-amber-500",
    gradient: "from-amber-500/10 to-orange-500/10",
    greeting: `Hey! I'm your Seasonal Support companion. ☀️

Victoria's dark, rainy winters can be tough on mental health—and that's completely normal. I'm here with proactive tips for light therapy, outdoor activities, vitamin D, and ways to brighten the grey days.

How are you handling the season?`,
    quickPrompts: [
      {
        label: "Light therapy",
        prompt: "Tell me about light therapy lamps for seasonal depression",
        description: "Combat lack of sunlight",
      },
      {
        label: "Winter activities",
        prompt: "What activities can help with the winter blues?",
        description: "Stay active during dark months",
      },
      {
        label: "Vitamin D tips",
        prompt: "Should I be taking vitamin D supplements?",
        description: "Nutrition for grey days",
      },
      {
        label: "Morning routines",
        prompt: "How can I build a routine to fight seasonal depression?",
        description: "Healthy habits for winter",
      },
    ],
  },

  resources: {
    id: "resources",
    label: "Resource Connector",
    shortLabel: "Resources",
    description: "Find and understand UVic student services",
    icon: BookOpen,
    iconColor: "text-green-500",
    gradient: "from-green-500/10 to-emerald-500/10",
    greeting: `Hi! I'm your Resource Connector. 📚

UVic has amazing services—but finding them can feel overwhelming. I know every student service and can explain processes in plain language. No question is too small.

What do you need help with?`,
    quickPrompts: [
      {
        label: "Counselling",
        prompt: "How do I book a counselling appointment?",
        description: "Mental health services",
      },
      {
        label: "Academic support",
        prompt: "What academic support services are available?",
        description: "Tutoring, writing help, and more",
      },
      {
        label: "Financial aid",
        prompt: "Where can I get help with financial aid or bursaries?",
        description: "Money matters and funding",
      },
      {
        label: "Health services",
        prompt: "What health services are available on campus?",
        description: "Medical care at UVic",
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
