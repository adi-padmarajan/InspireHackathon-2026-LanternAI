import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Heart, 
  MapPin, 
  BookOpen,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

interface QuickAction {
  icon: React.ElementType;
  title: string;
  description: string;
  to: string;
  gradient: string;
}

const quickActions: QuickAction[] = [
  {
    icon: MessageCircle,
    title: "Talk to me",
    description: "Choose from 8 specialized support modes",
    to: "/chat",
    gradient: "from-chart-1/20 to-chart-1/5",
  },
  {
    icon: Heart,
    title: "How are you feeling?",
    description: "Track your mood and get personalized wellness insights",
    to: "/wellness",
    gradient: "from-chart-2/20 to-chart-2/5",
  },
  {
    icon: MapPin,
    title: "Find something on campus",
    description: "Buildings, services, study spots—I know my way around",
    to: "/chat?mode=navigator",
    gradient: "from-chart-3/20 to-chart-3/5",
  },
  {
    icon: BookOpen,
    title: "Campus resources",
    description: "Counseling, health, academic support—all in one place",
    to: "/resources",
    gradient: "from-chart-4/20 to-chart-4/5",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const
    }
  }
};

export const QuickActions = () => {
  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {quickActions.map((action) => (
        <motion.div key={action.title} variants={itemVariants}>
          <Link to={action.to} className="group block">
            <motion.div
              whileHover={{ y: -4, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <Card className="h-full forest-card overflow-hidden transition-all duration-300 border-transparent hover:border-primary/20 hover:shadow-xl">
                <CardContent className={`p-6 bg-gradient-to-br ${action.gradient}`}>
                  <div className="flex items-start gap-4">
                    <motion.div 
                      className="flex-shrink-0 p-3 rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-primary/10 transition-colors"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <action.icon className="h-6 w-6 text-primary" />
                    </motion.div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                        {action.title}
                        <motion.span
                          initial={{ opacity: 0, x: -8 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className="inline-block"
                        >
                          <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </motion.span>
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {action.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
};
