import { Card, CardContent } from "@/components/ui/card";

const personas = [
  {
    name: "Maya",
    role: "The Anxious First-Year",
    avatar: "👩‍🎓",
    background: "18, from Vancouver, living in residence",
    challenges: "Social anxiety, overwhelmed by campus, seasonal depression",
    howLanternHelps: "Validates feelings, offers graduated steps to social engagement, proactively checks in during dark months",
  },
  {
    name: "Jordan",
    role: "The Commuter Transfer",
    avatar: "🧑‍💻",
    background: "21, transferred from Camosun, commutes from Langford",
    challenges: "No on-campus community, limited time between classes",
    howLanternHelps: "Efficient wayfinding, short-commitment social opportunities, acknowledges commuter challenges",
  },
  {
    name: "Aisha",
    role: "Student with Mobility Needs",
    avatar: "👩‍🦽",
    background: "20, second-year, uses a wheelchair",
    challenges: "UVic's hills, finding accessible routes",
    howLanternHelps: "Always provides accessible options first, knows elevator locations, doesn't require her to always specify needs",
  },
  {
    name: "Priya",
    role: "New from India",
    avatar: "👩‍🔬",
    background: "19, first-year from Mumbai, first time abroad",
    challenges: "Different academic system, social norms, intense homesickness",
    howLanternHelps: "International Mode explains academic norms, cultural guide helps decode situations, connects to resources",
  },
];

export const PersonasSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--primary)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
            Built for <span className="text-secondary">Real Students</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            These aren't edge cases. These are everyday experiences for thousands of UVic students. 
            Lantern understands and adapts to each unique situation.
          </p>
        </div>

        {/* Personas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {personas.map((persona, index) => (
            <Card 
              key={persona.name}
              className="forest-card overflow-hidden group hover:shadow-xl transition-all duration-300"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="text-5xl">{persona.avatar}</div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-foreground">
                      {persona.name}
                    </h3>
                    <p className="text-sm text-primary font-medium mb-2">
                      {persona.role}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">
                      {persona.background}
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-3">
                  <div className="bg-destructive/5 border-l-2 border-destructive/30 pl-3 py-2 rounded-r">
                    <p className="text-xs font-medium text-destructive/80 uppercase tracking-wide mb-1">
                      Challenges
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {persona.challenges}
                    </p>
                  </div>
                  
                  <div className="bg-primary/5 border-l-2 border-primary/30 pl-3 py-2 rounded-r">
                    <p className="text-xs font-medium text-primary/80 uppercase tracking-wide mb-1">
                      How Lantern Helps
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {persona.howLanternHelps}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
