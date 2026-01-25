import { Link } from "react-router-dom";
import { 
  MessageCircle, 
  Heart, 
  MapPin, 
  BookOpen,
  ArrowRight
} from "lucide-react";
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
    description: "I'm here to listen and help with whatever's on your mind",
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

export const QuickActions = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl mx-auto">
      {quickActions.map((action, index) => (
        <Link 
          key={action.title} 
          to={action.to}
          className="group animate-fade-in"
          style={{ animationDelay: `${(index + 4) * 0.1}s` }}
        >
          <Card className="h-full forest-card overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-transparent hover:border-primary/20">
            <CardContent className={`p-6 bg-gradient-to-br ${action.gradient}`}>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 p-3 rounded-xl bg-background/80 backdrop-blur-sm group-hover:bg-primary/10 transition-colors">
                  <action.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center gap-2">
                    {action.title}
                    <ArrowRight className="h-4 w-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
