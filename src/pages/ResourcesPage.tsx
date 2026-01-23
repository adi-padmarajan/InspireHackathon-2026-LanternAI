import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Phone, 
  MapPin, 
  Globe, 
  Accessibility, 
  BookOpen, 
  Users, 
  Coffee,
  ExternalLink,
  AlertTriangle
} from "lucide-react";

const resources = {
  crisis: [
    {
      name: "Crisis Line BC",
      phone: "1-800-784-2433",
      description: "24/7 crisis support for anyone in BC",
      icon: Phone,
    },
    {
      name: "UVic Counselling Services",
      phone: "250-721-8341",
      description: "Same-day crisis appointments available",
      icon: Heart,
    },
    {
      name: "SupportConnect",
      phone: "1-800-554-4567",
      description: "24/7 mental health support for students",
      icon: Phone,
    },
  ],
  mentalHealth: [
    {
      name: "Student Wellness Centre",
      location: "Student Union Building",
      description: "Peer support, wellness workshops, and resources",
      icon: Heart,
    },
    {
      name: "Counselling Services",
      location: "Health & Wellness Building",
      description: "Individual and group counselling (free for students)",
      icon: Users,
    },
    {
      name: "Therapy Dogs",
      location: "Various campus locations",
      description: "Follow @uvicpaws for schedules",
      icon: Coffee,
    },
  ],
  accessibility: [
    {
      name: "Centre for Accessible Learning (CAL)",
      phone: "250-472-4947",
      description: "Academic accommodations and support",
      icon: Accessibility,
    },
    {
      name: "Accessibility Services",
      location: "Sedgewick Building",
      description: "Accessible parking, routes, and accommodations",
      icon: MapPin,
    },
  ],
  international: [
    {
      name: "International Student Services",
      phone: "250-721-6361",
      description: "Visa, settlement, and cultural support",
      icon: Globe,
    },
    {
      name: "Global Community",
      location: "International Commons",
      description: "Drop-in events, conversation partners, peer mentors",
      icon: Users,
    },
  ],
  academic: [
    {
      name: "Learning Commons",
      location: "Mearns Centre",
      description: "Tutoring, writing support, study skills",
      icon: BookOpen,
    },
    {
      name: "Academic Advising",
      location: "Various faculties",
      description: "Course planning and degree requirements",
      icon: BookOpen,
    },
  ],
};

const ResourcesPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Campus <span className="text-primary">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              UVic has excellent resources—Lantern helps you find and access them. 
              Here's your comprehensive guide to student support.
            </p>
          </div>

          {/* Crisis Resources */}
          <section id="crisis" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Crisis Support</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.crisis.map((resource) => (
                <Card key={resource.name} className="forest-card border-destructive/20">
                  <CardContent className="p-6">
                    <resource.icon className="h-8 w-8 text-destructive mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                    <a 
                      href={`tel:${resource.phone?.replace(/-/g, "")}`}
                      className="text-primary font-mono text-lg hover:underline block mb-2"
                    >
                      {resource.phone}
                    </a>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Mental Health */}
          <section id="mental-health" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-chart-1/10 flex items-center justify-center">
                <Heart className="h-5 w-5 text-chart-1" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Mental Health</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {resources.mentalHealth.map((resource) => (
                <Card key={resource.name} className="forest-card">
                  <CardContent className="p-6">
                    <resource.icon className="h-8 w-8 text-chart-1 mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                    <p className="text-sm text-primary mb-2">{resource.location}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Accessibility */}
          <section id="accessibility" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-chart-2/10 flex items-center justify-center">
                <Accessibility className="h-5 w-5 text-chart-2" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Accessibility</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.accessibility.map((resource) => (
                <Card key={resource.name} className="forest-card">
                  <CardContent className="p-6">
                    <resource.icon className="h-8 w-8 text-chart-2 mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                    {resource.phone && (
                      <a 
                        href={`tel:${resource.phone?.replace(/-/g, "")}`}
                        className="text-primary font-mono hover:underline block mb-2"
                      >
                        {resource.phone}
                      </a>
                    )}
                    {resource.location && (
                      <p className="text-sm text-primary mb-2">{resource.location}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* International */}
          <section id="international" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-chart-3/10 flex items-center justify-center">
                <Globe className="h-5 w-5 text-chart-3" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">International Students</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.international.map((resource) => (
                <Card key={resource.name} className="forest-card">
                  <CardContent className="p-6">
                    <resource.icon className="h-8 w-8 text-chart-3 mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                    {resource.phone && (
                      <a 
                        href={`tel:${resource.phone?.replace(/-/g, "")}`}
                        className="text-primary font-mono hover:underline block mb-2"
                      >
                        {resource.phone}
                      </a>
                    )}
                    {resource.location && (
                      <p className="text-sm text-primary mb-2">{resource.location}</p>
                    )}
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Academic */}
          <section id="academic" className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-lg bg-chart-4/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-chart-4" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-foreground">Academic Support</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.academic.map((resource) => (
                <Card key={resource.name} className="forest-card">
                  <CardContent className="p-6">
                    <resource.icon className="h-8 w-8 text-chart-4 mb-4" />
                    <h3 className="font-semibold text-foreground mb-1">{resource.name}</h3>
                    <p className="text-sm text-primary mb-2">{resource.location}</p>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* CTA */}
          <div className="text-center mt-16">
            <p className="text-muted-foreground mb-4">
              Not sure where to start? Let Lantern help you find the right resource.
            </p>
            <Button variant="lantern" size="lg" asChild>
              <a href="/chat">Chat with Lantern</a>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResourcesPage;
