/**
 * QuickActionChips - Elegant feature navigation
 * Calm, premium cards with gentle motion
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { MessageCircle, Heart, Palette, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionChip {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  accentColor: string;
}

const actions: ActionChip[] = [
  {
    icon: MessageCircle,
    title: "Talk to Lantern",
    description: "Meaningful conversations for emotional wellness",
    to: "/chat",
    accentColor: "from-violet-500/20 to-purple-500/10",
  },
  {
    icon: Heart,
    title: "Wellness Hub",
    description: "Track moods, breathing, and mindfulness",
    to: "/wellness",
    accentColor: "from-rose-500/20 to-pink-500/10",
  },
  {
    icon: Palette,
    title: "Make It Yours",
    description: "Themes, wallpapers, and ambient scenes",
    to: "/settings",
    accentColor: "from-amber-500/20 to-orange-500/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 0.61, 0.36, 1] as const,
    },
  },
};

export const QuickActionChips = () => {
  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-12 md:py-20">
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {actions.map((action) => (
          <motion.div key={action.title} variants={cardVariants}>
            <Link to={action.to} className="block group">
              <motion.article
                className={cn(
                  "relative h-full p-8 rounded-3xl",
                  "bg-card/50 backdrop-blur-sm",
                  "border border-border/40",
                  "transition-all duration-500",
                  "hover:border-border/80 hover:bg-card/70",
                  "shadow-lg hover:shadow-xl"
                )}
                whileHover={{ y: -8 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              >
                {/* Gradient overlay on hover */}
                <div
                  className={cn(
                    "absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    `bg-gradient-to-br ${action.accentColor}`
                  )}
                />

                {/* Content */}
                <div className="relative z-10 space-y-4">
                  <motion.div
                    className="inline-flex p-3 rounded-2xl bg-accent/50 text-primary"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  >
                    <action.icon className="h-6 w-6" />
                  </motion.div>

                  <h3 className="text-xl font-serif font-semibold text-foreground flex items-center gap-2">
                    {action.title}
                    <motion.span
                      className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                      initial={{ x: -8 }}
                      whileHover={{ x: 0 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.span>
                  </h3>

                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </motion.article>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
