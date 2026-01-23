import { 
  MessageCircle, 
  Heart, 
  Users, 
  MapPin, 
  Globe, 
  Accessibility,
  Leaf,
  Sun
} from "lucide-react";

const features = [
  {
    icon: MessageCircle,
    title: "Wellness Companion",
    description: "A warm, understanding AI presence available 24/7. Get support for stress, anxiety, and seasonal challenges.",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: MapPin,
    title: "Campus Navigator",
    description: "Find any building, service, or resource. Get accessibility-aware routing and insider tips for quiet study spots.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Users,
    title: "Social Courage Builder",
    description: "Low-pressure club exploration with graduated exposure suggestions. Practice conversations and get club 'vibe checks'.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Heart,
    title: "Mental Health Support",
    description: "Mood tracking, seasonal awareness, and crisis detection. Never judgmental, always supportive.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Globe,
    title: "International Mode",
    description: "Cultural guidance, academic norm translation, and settlement support for international students.",
    color: "text-chart-1",
    bgColor: "bg-chart-1/10",
  },
  {
    icon: Accessibility,
    title: "Accessibility First",
    description: "Always provides accessible options first. Knows elevator locations, ramps, and the best routes across UVic's terrain.",
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    icon: Sun,
    title: "Seasonal Support",
    description: "Proactive suggestions for Victoria's dark winters. Light therapy reminders, outdoor activity nudges, and vitamin D tips.",
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
  {
    icon: Leaf,
    title: "Resource Connector",
    description: "Knows every UVic student service and explains processes in student-friendly language. Reduces intimidation around seeking help.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
];

export const FeaturesSection = () => {
  return (
    <section className="py-24 bg-card">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Your Complete <span className="text-primary">Companion</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Lantern addresses the challenges that make university hard—not just academically, 
            but personally. From mental health to accessibility, we've got you covered.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="forest-card p-6 hover:shadow-lg transition-all duration-300 group"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${feature.bgColor} ${feature.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
