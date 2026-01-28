import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  MapPin,
  Compass,
  ArrowRight,
  Sparkles
} from "lucide-react";
import { springPresets } from "@/lib/animations";

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
    title: "Talk to me",
    description: "Choose from 8 specialized support modes",
    to: "/chat",
    accentColor: "text-violet-500",
    glowColor: "violet",
  },
  {
    icon: Heart,
    title: "How are you feeling?",
    description: "Track your mood and get personalized insights",
    to: "/wellness",
    accentColor: "text-rose-500",
    glowColor: "rose",
  },
  {
    icon: MapPin,
    title: "Find something on campus",
    description: "Buildings, services, study spots - I know my way around",
    to: "/chat?mode=navigator",
    accentColor: "text-blue-500",
    glowColor: "blue",
  },
  {
    icon: Compass,
    title: "Explore support options",
    description: "Counseling, health, academic support - I'll guide you there",
    to: "/chat?mode=resource",
    accentColor: "text-emerald-500",
    glowColor: "emerald",
  },
];

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    }
  }
};

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.95,
    filter: "blur(8px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

// Get glow colors based on action
const getGlowStyles = (glowColor: string) => {
  const colors: Record<string, string> = {
    violet: "group-hover:shadow-[0_0_40px_hsl(258_89%_66%/0.2)]",
    rose: "group-hover:shadow-[0_0_40px_hsl(350_89%_60%/0.2)]",
    blue: "group-hover:shadow-[0_0_40px_hsl(217_91%_60%/0.2)]",
    emerald: "group-hover:shadow-[0_0_40px_hsl(160_84%_39%/0.2)]",
  };
  return colors[glowColor] || colors.violet;
};

const getIconBgStyles = (glowColor: string) => {
  const colors: Record<string, string> = {
    violet: "bg-violet-500/10 group-hover:bg-violet-500/20",
    rose: "bg-rose-500/10 group-hover:bg-rose-500/20",
    blue: "bg-blue-500/10 group-hover:bg-blue-500/20",
    emerald: "bg-emerald-500/10 group-hover:bg-emerald-500/20",
  };
  return colors[glowColor] || colors.violet;
};

export const QuickActions = () => {
  return (
    <motion.div
      className="w-full max-w-4xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section header */}
      <motion.div
        variants={cardVariants}
        className="flex items-center justify-center gap-2 mb-8"
      >
        <Sparkles className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
          Quick Actions
        </span>
        <Sparkles className="h-4 w-4 text-primary" />
      </motion.div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
        {quickActions.map((action, index) => (
          <motion.div
            key={action.title}
            variants={cardVariants}
            custom={index}
          >
            <Link to={action.to} className="block h-full group">
              <motion.div
                className={`
                  h-full p-6 md:p-7
                  liquid-action-card
                  ${getGlowStyles(action.glowColor)}
                `}
                whileHover={{
                  y: -8,
                  scale: 1.02,
                }}
                whileTap={{ scale: 0.98 }}
                transition={springPresets.snappy}
              >
                {/* Card content */}
                <div className="relative z-10 flex items-start gap-4">
                  {/* Icon container */}
                  <motion.div
                    className={`
                      flex-shrink-0 p-3.5 rounded-2xl
                      backdrop-blur-sm border border-white/5
                      transition-all duration-300
                      ${getIconBgStyles(action.glowColor)}
                    `}
                    whileHover={{
                      rotate: [0, -5, 5, 0],
                      scale: 1.1,
                    }}
                    transition={springPresets.bouncy}
                  >
                    <action.icon className={`h-6 w-6 ${action.accentColor}`} strokeWidth={1.75} />
                  </motion.div>

                  {/* Text content */}
                  <div className="flex-1 min-w-0 pt-0.5">
                    <h3 className="font-semibold text-foreground text-lg mb-1.5 flex items-center gap-2 group-hover:text-primary transition-colors duration-300">
                      <span className="text-readable">{action.title}</span>
                      <motion.div
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 0, x: -8 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="inline-flex"
                      >
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </motion.div>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed text-readable">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Decorative gradient on hover */}
                <motion.div
                  className="absolute inset-0 rounded-[24px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{
                    background: `radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.05) 0%, transparent 60%)`,
                  }}
                />
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
