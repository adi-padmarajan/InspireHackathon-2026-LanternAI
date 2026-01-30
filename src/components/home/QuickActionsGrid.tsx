/**
 * QuickActionsGrid - Secondary Navigation Cards
 * Clean, focused cards for key actions
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  Settings,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  accentColor: string;
}

const quickActions: QuickAction[] = [
  {
    icon: MessageCircle,
    title: "Start a Conversation",
    description: "Talk to Lantern about anything on your mind",
    to: "/chat",
    accentColor: "text-violet-500",
  },
  {
    icon: Heart,
    title: "Wellness Check-in",
    description: "Track your mood and explore relaxation tools",
    to: "/wellness",
    accentColor: "text-rose-500",
  },
  {
    icon: Settings,
    title: "Customize Lantern",
    description: "Themes, wallpapers, and cinematic effects",
    to: "/settings",
    accentColor: "text-amber-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
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
        className="text-center mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <h2 className="text-lg md:text-xl font-medium text-muted-foreground">
          Quick Actions
        </h2>
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {quickActions.map((action) => (
          <motion.div key={action.title} variants={cardVariants}>
            <Link to={action.to} className="block h-full group">
              <motion.div
                className={cn(
                  "relative h-full p-5 rounded-xl",
                  "bg-card/50 backdrop-blur-sm",
                  "border border-border/40",
                  "transition-all duration-300",
                  "group-hover:border-border/70",
                  "group-hover:bg-card/70"
                )}
                whileHover={{
                  y: -4,
                  transition: { type: "spring", stiffness: 300, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Icon */}
                <div className="mb-4">
                  <motion.div
                    className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      "bg-muted/50 group-hover:bg-muted",
                      "transition-colors duration-300"
                    )}
                    whileHover={{ scale: 1.05 }}
                  >
                    <action.icon className={cn("h-5 w-5", action.accentColor)} />
                  </motion.div>
                </div>

                {/* Content */}
                <div>
                  <h3 className="font-medium text-foreground mb-1 flex items-center gap-2">
                    {action.title}
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -4 }}
                      animate={{ x: 0 }}
                    >
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </motion.div>
                  </h3>
                  <p className="text-sm text-muted-foreground">
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
