/**
 * Wellness Dimensions Configuration
 * The 6 dimensions of holistic wellness for UVic students
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

export type WellnessDimension =
  | "physical"
  | "emotional"
  | "intellectual"
  | "spiritual"
  | "environmental"
  | "social";

export interface DimensionConfig {
  id: WellnessDimension;
  label: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  gradient: string;
  examples: string[];
}

export const wellnessDimensions: Record<WellnessDimension, DimensionConfig> = {
  physical: {
    id: "physical",
    label: "Physical",
    tagline: "Move & Nourish",
    description: "Exercise, nutrition, sleep, and body awareness for peak vitality",
    icon: Heart,
    color: "text-rose-500",
    gradient: "from-rose-500/20 to-pink-500/20",
    examples: ["Sleep hygiene", "Movement breaks", "Nutrition tips", "Energy management"],
  },
  emotional: {
    id: "emotional",
    label: "Emotional",
    tagline: "Feel & Process",
    description: "Understanding, expressing, and managing your emotions healthily",
    icon: Brain,
    color: "text-violet-500",
    gradient: "from-violet-500/20 to-purple-500/20",
    examples: ["Mood tracking", "Stress relief", "Anxiety support", "Emotional regulation"],
  },
  intellectual: {
    id: "intellectual",
    label: "Intellectual",
    tagline: "Learn & Grow",
    description: "Curiosity, creativity, and continuous learning for mental stimulation",
    icon: BookOpen,
    color: "text-blue-500",
    gradient: "from-blue-500/20 to-cyan-500/20",
    examples: ["Study strategies", "Focus techniques", "Creative outlets", "Academic balance"],
  },
  spiritual: {
    id: "spiritual",
    label: "Spiritual",
    tagline: "Connect & Reflect",
    description: "Purpose, meaning, mindfulness, and inner peace",
    icon: Sparkles,
    color: "text-amber-500",
    gradient: "from-amber-500/20 to-yellow-500/20",
    examples: ["Meditation", "Gratitude practice", "Values alignment", "Mindfulness"],
  },
  environmental: {
    id: "environmental",
    label: "Environmental",
    tagline: "Space & Nature",
    description: "Your relationship with spaces, nature, and sustainable living",
    icon: Leaf,
    color: "text-emerald-500",
    gradient: "from-emerald-500/20 to-green-500/20",
    examples: ["Study environment", "Nature connection", "Campus spaces", "Eco-wellness"],
  },
  social: {
    id: "social",
    label: "Social",
    tagline: "Connect & Belong",
    description: "Meaningful relationships, community, and healthy boundaries",
    icon: Users,
    color: "text-indigo-500",
    gradient: "from-indigo-500/20 to-blue-500/20",
    examples: ["Making friends", "Club exploration", "Conversation skills", "Support networks"],
  },
};

// Seasonal Depression (SAD) specific config
export const seasonalSupport = {
  id: "seasonal",
  label: "Seasonal Support",
  tagline: "Light Through Dark Days",
  description: "Proactive support for Victoria's grey winters and seasonal affective challenges",
  icon: Sun,
  color: "text-orange-500",
  gradient: "from-orange-500/20 to-amber-500/20",
  examples: ["Light therapy", "Vitamin D", "Winter activities", "Mood boosters"],
};

// Get all dimensions as an array
export const allDimensions = Object.values(wellnessDimensions);
