/**
 * QuickActionsGrid - Cinematic Action Cards
 * Beautiful, interactive cards with stunning hover effects
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Settings,
  Compass,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  accentColor: string;
  glowColor: string;
}

const quickActions: QuickAction[] = [
  {
    icon: MessageCircle,
    title: "Start a conversation",
    description: "Choose from 6 specialized support modes",
    to: "/chat",
    accentColor: "text-violet-500",
    glowColor: "group-hover:shadow-violet-500/20",
  },
  {
    icon: Heart,
    title: "Wellness check-in",
    description: "Track your mood and explore relaxation exercises",
    to: "/wellness",
    accentColor: "text-rose-500",
    glowColor: "group-hover:shadow-rose-500/20",
  },
  {
    icon: Compass,
    title: "Explore resources",
    description: "Counseling, health, academic support and more",
    to: "/chat?mode=resources",
    accentColor: "text-emerald-500",
    glowColor: "group-hover:shadow-emerald-500/20",
  },
  {
    icon: Settings,
    title: "Customize Lantern",
    description: "Themes, wallpapers, and cinematic effects",
    to: "/settings",
    accentColor: "text-amber-500",
    glowColor: "group-hover:shadow-amber-500/20",
  },
];

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export const QuickActionsGrid = () => {
  return (
    <motion.div
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section title */}
      <motion.div
        className="text-center mb-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h2 className="text-lg md:text-xl font-medium text-muted-foreground">
          What would you like to do?
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            variants={cardVariants}
            custom={index}
          >
            <Link to={action.to} className="block h-full group">
              <motion.div
                className={cn(
                  "relative h-full p-6 rounded-2xl",
                  "bg-card/80 backdrop-blur-sm",
                  "border border-border/50",
                  "transition-all duration-500",
                  "group-hover:border-primary/30",
                  "group-hover:shadow-2xl",
                  action.glowColor
                )}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300, damping: 20 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `radial-gradient(circle at top, hsl(var(--primary) / 0.05) 0%, transparent 70%)`,
                  }}
                />

                {/* Icon */}
                <motion.div
                  className={cn(
                    "relative w-12 h-12 rounded-xl flex items-center justify-center mb-5",
                    "bg-muted/50 group-hover:bg-primary/10",
                    "transition-colors duration-300"
                  )}
                  whileHover={{ rotate: [0, -5, 5, 0], scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <action.icon className={cn("h-6 w-6", action.accentColor)} />
                </motion.div>

                {/* Content */}
                <div className="relative">
                  <h3 className="font-semibold text-foreground text-lg mb-2 flex items-center gap-2">
                    {action.title}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -5 }}
                      animate={{ x: 0 }}
                    >
                      <ArrowRight className="h-4 w-4 text-primary" />
                    </motion.div>
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>

                {/* Bottom accent line */}
                <motion.div
                  className="absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileHover={{ scaleX: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
