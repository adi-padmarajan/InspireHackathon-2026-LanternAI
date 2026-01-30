/**
 * QuickActionsGrid - Premium Feature Cards
 * Apple-level design with perfect alignment
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Heart, ArrowRight, Palette } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  gradient: string;
  iconBg: string;
}

interface QuickActionsGridProps {
  className?: string;
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
  hidden: { opacity: 0, y: 20, scale: 0.96 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      delay: 0.1 + index * 0.1,
      ease: [0.22, 0.61, 0.36, 1] as const,
    },
  }),
};

const floatingDrifts = [6, 8, 6];

export const QuickActionsGrid = ({ className }: QuickActionsGridProps) => {
  return (
    <div className={cn("relative w-full max-w-5xl mx-auto", className)}>
      {/* Horizontal flexbox layout */}
      <motion.div
        className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-8"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            className="w-full max-w-[320px] md:w-[280px] lg:w-[300px]"
            variants={cardVariants}
            custom={index}
          >
            <motion.div
              animate={{ y: [0, -floatingDrifts[index], 0] }}
              transition={{
                duration: 5 + index,
                repeat: Infinity,
                ease: "easeInOut",
                delay: index * 0.3,
              }}
            >
              <Link to={action.to} className="block h-full group">
                <motion.div
                  className={cn(
                    "relative h-full p-6 rounded-2xl",
                    "bg-card/70 backdrop-blur-xl",
                    "border border-border/60",
                    "transition-all duration-500",
                    "group-hover:border-border",
                    "group-hover:bg-card/90",
                    "shadow-[0_20px_60px_-40px_rgba(0,0,0,0.6)]",
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
                        "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                        action.iconBg,
                        "transition-transform duration-300 group-hover:scale-110"
                      )}
                    >
                      <action.icon className="h-6 w-6" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-lg font-semibold text-foreground mb-2 flex items-center gap-2">
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
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};
