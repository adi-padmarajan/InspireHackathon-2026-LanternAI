import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Heart,
  MapPin,
  Compass,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { staggerContainer, springPresets } from "@/lib/animations";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  gradient: string;
  iconColor: string;
}

const quickActions: QuickAction[] = [
  {
    icon: MessageCircle,
    title: "Talk to me",
    description: "Choose from 8 specialized support modes",
    to: "/chat",
    gradient: "from-chart-1/20 to-chart-1/5",
    iconColor: "text-violet-500",
  },
  {
    icon: Heart,
    title: "How are you feeling?",
    description: "Track your mood and get personalized wellness insights",
    to: "/wellness",
    gradient: "from-chart-2/20 to-chart-2/5",
    iconColor: "text-rose-500",
  },
  {
    icon: MapPin,
    title: "Find something on campus",
    description: "Buildings, services, study spots - I know my way around",
    to: "/chat?mode=navigator",
    gradient: "from-chart-3/20 to-chart-3/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Compass,
    title: "Explore support options",
    description: "Counseling, health, academic support - I'll guide you there",
    to: "/chat?mode=resource",
    gradient: "from-chart-4/20 to-chart-4/5",
    iconColor: "text-emerald-500",
  },
];

// Card animation variants
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.1 + 0.4,
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  }),
};

export const QuickActions = () => {
  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl mx-auto"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      {quickActions.map((action, index) => (
        <motion.div
          key={action.title}
          custom={index}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          whileHover={{
            y: -8,
            scale: 1.02,
            transition: springPresets.snappy,
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Link to={action.to} className="block h-full">
            <Card className="h-full forest-card overflow-hidden border-transparent hover:border-primary/20 transition-colors duration-300">
              <CardContent className={`p-6 bg-gradient-to-br ${action.gradient} h-full relative`}>
                <div className="flex items-start gap-4">
                  {/* Icon with hover animation */}
                  <motion.div
                    className="flex-shrink-0 p-3 rounded-xl bg-background/80 backdrop-blur-sm"
                    whileHover={{
                      rotate: [0, -5, 5, 0],
                      scale: 1.1,
                      backgroundColor: "hsl(var(--primary) / 0.1)",
                    }}
                    transition={springPresets.bouncy}
                  >
                    <action.icon className={`h-6 w-6 ${action.iconColor}`} />
                  </motion.div>

                  <div className="flex-1 min-w-0">
                    {/* Title with arrow animation */}
                    <h3 className="font-semibold text-foreground mb-1 flex items-center gap-2">
                      <span className="group-hover:text-primary transition-colors">
                        {action.title}
                      </span>
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        whileHover={{ opacity: 1, x: 0 }}
                        className="inline-block"
                      >
                        <ArrowRight className="h-4 w-4 text-primary" />
                      </motion.div>
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {action.description}
                    </p>
                  </div>
                </div>

                {/* Subtle glow on hover */}
                <motion.div
                  className="absolute inset-0 pointer-events-none rounded-lg"
                  initial={{ opacity: 0 }}
                  whileHover={{
                    opacity: 1,
                    boxShadow: "inset 0 0 30px hsl(var(--primary) / 0.1)",
                  }}
                  transition={{ duration: 0.3 }}
                />
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
