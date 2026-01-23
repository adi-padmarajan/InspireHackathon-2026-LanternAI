import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { LanternLogo } from "@/components/LanternLogo";
import { 
  Heart, 
  Users, 
  Lightbulb, 
  Shield,
  Target,
  Sparkles
} from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "We design for vulnerability. Every interaction considers the emotional state of the user.",
  },
  {
    icon: Shield,
    title: "Judgment-Free",
    description: "There's no 'wrong' question. We meet students exactly where they are.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    description: "Accessibility isn't an afterthought. International students aren't edge cases.",
  },
  {
    icon: Lightbulb,
    title: "Proactive Support",
    description: "We don't wait for crisis. Seasonal nudges and gentle check-ins prevent problems.",
  },
];

const team = [
  { name: "Built for INSPIRE Hackathon", role: "January 30-31, 2026" },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="flex justify-center mb-6">
              <LanternLogo size="lg" showText={false} />
            </div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              About <span className="text-primary">Lantern</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Like a lantern illuminating a dark path, we help students navigate the challenges 
              of university life at the University of Victoria.
            </p>
          </div>

          {/* Why Lantern */}
          <section className="max-w-4xl mx-auto mb-16">
            <Card className="forest-card overflow-hidden">
              <div className="nature-gradient p-8 text-primary-foreground">
                <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2">
                  <Sparkles className="h-6 w-6" />
                  Why "Lantern"?
                </h2>
              </div>
              <CardContent className="p-8">
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🌧️</span>
                    <div>
                      <strong className="text-foreground">Victoria's winters are dark</strong>
                      <p className="text-muted-foreground">Students need light, literally and figuratively</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🔦</span>
                    <div>
                      <strong className="text-foreground">A lantern guides you when you're lost</strong>
                      <p className="text-muted-foreground">University can feel overwhelming—we help you find your way</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🔥</span>
                    <div>
                      <strong className="text-foreground">It provides warmth and comfort</strong>
                      <p className="text-muted-foreground">Fighting isolation with connection and understanding</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">🎒</span>
                    <div>
                      <strong className="text-foreground">You carry it with you</strong>
                      <p className="text-muted-foreground">Always accessible, 24/7, wherever you are</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-2xl">✨</span>
                    <div>
                      <strong className="text-foreground">It illuminates paths others might not see</strong>
                      <p className="text-muted-foreground">Helping you discover resources and opportunities</p>
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          {/* The Problem */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              The Problems We <span className="text-destructive">Address</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="forest-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">Universal Challenges</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Mental health struggles (stress, anxiety, depression)</li>
                    <li>• Seasonal depression from dark, grey winters</li>
                    <li>• Social isolation and difficulty making friends</li>
                    <li>• Social anxiety about joining clubs</li>
                    <li>• Accessibility barriers on hilly terrain</li>
                    <li>• Navigating scattered campus resources</li>
                  </ul>
                </CardContent>
              </Card>
              <Card className="forest-card">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-lg text-foreground mb-4">International Student Challenges</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• Cultural adjustment and unfamiliar norms</li>
                    <li>• Different academic expectations</li>
                    <li>• Language barriers beyond vocabulary</li>
                    <li>• Homesickness and distance from family</li>
                    <li>• Visa and work permit concerns</li>
                    <li>• Lack of local knowledge</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </section>

          {/* Our Values */}
          <section className="max-w-4xl mx-auto mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-8 text-center">
              Our <span className="text-primary">Values</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {values.map((value) => (
                <Card key={value.title} className="forest-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <value.icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground">{value.title}</h3>
                    </div>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mission */}
          <section className="max-w-3xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-secondary" />
              </div>
            </div>
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-8">
              To ensure no UVic student feels alone, lost, or unsupported—providing a unified, 
              judgment-free companion that meets them exactly where they are.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm">
              <Heart className="h-4 w-4" />
              <span>Built with love at INSPIRE Hackathon 2026</span>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AboutPage;
