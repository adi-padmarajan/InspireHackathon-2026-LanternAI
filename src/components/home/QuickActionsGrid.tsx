/**
 * QuickActionsGrid - Premium Feature Cards
 * Apple-level design with perfect alignment
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Settings,
  ArrowRight,
  Sparkles,
  Palette,
  Brain,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  gradient: string;
  iconBg: string;
}

const quickActions: QuickAction[] = [
  {
    icon: MessageCircle,
    title: "AI Chat",
    description: "Have meaningful conversations with your wellness companion",
    to: "/chat",
    gradient: "from-violet-500/10 via-purple-500/5 to-transparent",
    iconBg: "bg-violet-500/10 text-violet-500",
  },
  {
    icon: Heart,
    title: "Wellness Hub",
    description: "Track moods, breathing exercises, and mindfulness tools",
    to: "/wellness",
    gradient: "from-rose-500/10 via-pink-500/5 to-transparent",
    iconBg: "bg-rose-500/10 text-rose-500",
  },
  {
    icon: Palette,
    title: "Personalize",
    description: "Themes, ambient scenes, and cinematic backgrounds",
    to: "/settings",
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    iconBg: "bg-amber-500/10 text-amber-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export const QuickActionsGrid = () => {
  return (
    <motion.div
      className="w-full max-w-5xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Section header - centered with visual hierarchy */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <motion.div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 border border-border/50 mb-6"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1, duration: 0.5 }}
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">Features</span>
        </motion.div>
        <h2 className="text-3xl md:text-4xl font-serif font-semibold text-foreground mb-4">
          Everything You Need
        </h2>
        <p className="text-lg text-muted-foreground max-w-xl mx-auto">
          Tools designed to support your mental wellness journey
        </p>
      </motion.div>

      {/* Cards grid - consistent sizing and spacing */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <motion.div key={action.title} variants={cardVariants}>
            <Link to={action.to} className="block h-full group">
              <motion.div
                className={cn(
                  "relative h-full p-6 rounded-2xl",
                  "bg-card/60 backdrop-blur-md",
                  "border border-border/50",
                  "transition-all duration-500",
                  "group-hover:border-border",
                  "group-hover:bg-card/80",
                  "overflow-hidden"
                )}
                whileHover={{
                  y: -8,
                  transition: { type: "spring", stiffness: 400, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient overlay */}
                <div
                  className={cn(
                    "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    `bg-gradient-to-br ${action.gradient}`
                  )}
                />

                {/* Content container with consistent spacing */}
                <div className="relative flex flex-col h-full">
                  {/* Icon */}
                  <motion.div
                    className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center mb-5",
                      action.iconBg,
                      "transition-transform duration-300 group-hover:scale-110"
                    )}
                  >
                    <action.icon className="h-6 w-6" />
                  </motion.div>

                  {/* Title */}
                  <h3 className="text-xl font-semibold text-foreground mb-2 flex items-center gap-2">
                    {action.title}
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300"
                      initial={{ x: -8 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.span>
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {action.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
