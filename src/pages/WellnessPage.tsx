import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RelaxationSounds from "@/components/wellness/RelaxationSounds";
import { 
  Smile, 
  Meh, 
  Frown, 
  CloudRain, 
  Sun, 
  Moon,
  Heart,
  TrendingUp,
  Calendar,
  Sparkles
} from "lucide-react";

const moodOptions = [
  { icon: Smile, label: "Great", value: 5, color: "text-chart-1" },
  { icon: Smile, label: "Good", value: 4, color: "text-chart-2" },
  { icon: Meh, label: "Okay", value: 3, color: "text-chart-4" },
  { icon: Frown, label: "Low", value: 2, color: "text-secondary" },
  { icon: CloudRain, label: "Struggling", value: 1, color: "text-muted-foreground" },
];

const wellnessTips = [
  {
    title: "Light Therapy",
    description: "Consider using a light therapy lamp for 20-30 minutes each morning during dark winter months.",
    icon: Sun,
  },
  {
    title: "Movement Break",
    description: "Even a 10-minute walk outside during daylight can boost your mood significantly.",
    icon: TrendingUp,
  },
  {
    title: "Sleep Hygiene",
    description: "Try to maintain consistent sleep/wake times, even on weekends. Aim for 7-9 hours.",
    icon: Moon,
  },
  {
    title: "Social Connection",
    description: "Reach out to one person today—a text, call, or coffee chat can make a difference.",
    icon: Heart,
  },
];

const recentMoods = [
  { date: "Today", mood: 4, note: "Had a good study session" },
  { date: "Yesterday", mood: 3, note: "Feeling neutral" },
  { date: "2 days ago", mood: 2, note: "Stressed about assignment" },
  { date: "3 days ago", mood: 4, note: "Met up with friends" },
  { date: "4 days ago", mood: 3, note: "" },
];

const WellnessPage = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLogged, setIsLogged] = useState(false);

  const handleLogMood = () => {
    if (selectedMood) {
      setIsLogged(true);
      setTimeout(() => setIsLogged(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Wellness <span className="text-primary">Check-in</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Track your mood, discover patterns, and get personalized wellness suggestions. 
              Small check-ins lead to big insights.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Mood Check-in */}
            <div className="lg:col-span-2">
              <Card className="forest-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Heart className="h-5 w-5 text-primary" />
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mood Selector */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all ${
                          selectedMood === mood.value
                            ? "bg-accent ring-2 ring-primary scale-105"
                            : "bg-card hover:bg-accent/50"
                        }`}
                      >
                        <mood.icon className={`h-10 w-10 ${mood.color}`} />
                        <span className="text-sm font-medium text-foreground">{mood.label}</span>
                      </button>
                    ))}
                  </div>

                  {/* Note Input */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Add a note (optional)
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What's on your mind? Any specific events or feelings..."
                      className="w-full h-24 bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                    />
                  </div>

                  {/* Log Button */}
                  <Button
                    variant="lantern"
                    className="w-full"
                    onClick={handleLogMood}
                    disabled={!selectedMood}
                  >
                    {isLogged ? (
                      <>
                        <Sparkles className="h-4 w-4" />
                        Mood Logged!
                      </>
                    ) : (
                      "Log My Mood"
                    )}
                  </Button>

                  <p className="text-xs text-muted-foreground text-center mt-4">
                    Your mood data is private and helps you track patterns over time.
                  </p>
                </CardContent>
              </Card>

              {/* Mood History */}
              <Card className="forest-card mt-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Calendar className="h-5 w-5 text-primary" />
                    Recent Check-ins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recentMoods.map((entry, index) => {
                      const moodOption = moodOptions.find(m => m.value === entry.mood);
                      const MoodIcon = moodOption?.icon || Meh;
                      return (
                        <div 
                          key={index}
                          className="flex items-center gap-4 p-3 rounded-lg bg-accent/30"
                        >
                          <MoodIcon className={`h-6 w-6 ${moodOption?.color}`} />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-foreground">{entry.date}</p>
                            {entry.note && (
                              <p className="text-xs text-muted-foreground">{entry.note}</p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{moodOption?.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Relaxation Sounds */}
              <RelaxationSounds />
            </div>

            {/* Wellness Tips Sidebar */}
            <div>
              <Card className="forest-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <Sun className="h-5 w-5 text-secondary" />
                    Seasonal Tips
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Victoria's dark winters can be challenging. Here are some evidence-based strategies:
                  </p>
                  {wellnessTips.map((tip, index) => (
                    <div key={index} className="p-4 rounded-lg bg-accent/30">
                      <div className="flex items-center gap-2 mb-2">
                        <tip.icon className="h-5 w-5 text-primary" />
                        <h4 className="font-medium text-foreground">{tip.title}</h4>
                      </div>
                      <p className="text-sm text-muted-foreground">{tip.description}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="forest-card mt-6">
                <CardHeader>
                  <CardTitle className="font-serif text-lg">Need Support?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/chat">💬 Talk to Lantern</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="/resources#crisis">🆘 Crisis Resources</a>
                  </Button>
                  <Button variant="outline" className="w-full justify-start" asChild>
                    <a href="tel:2507218341">📞 UVic Counselling</a>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default WellnessPage;
