import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RelaxationSounds from "@/components/wellness/RelaxationSounds";
import BreathingExercise from "@/components/wellness/BreathingExercise";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Smile,
  Meh,
  Frown,
  CloudRain,
  Sun,
  Moon,
  Heart,
  TrendingUp,
  Sparkles,
  Wind,
} from "lucide-react";
import { cardHover3D } from "@/lib/animations";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* DATA                                                                        */
/* -------------------------------------------------------------------------- */

const moodOptions = [
  { icon: Smile, label: "Great", value: 5, color: "text-green-600", bgColor: "bg-green-100 dark:bg-green-900/30" },
  { icon: Smile, label: "Good", value: 4, color: "text-blue-600", bgColor: "bg-blue-100 dark:bg-blue-900/30" },
  { icon: Meh, label: "Okay", value: 3, color: "text-yellow-600", bgColor: "bg-yellow-100 dark:bg-yellow-900/30" },
  { icon: Frown, label: "Low", value: 2, color: "text-orange-600", bgColor: "bg-orange-100 dark:bg-orange-900/30" },
  { icon: CloudRain, label: "Struggling", value: 1, color: "text-red-600", bgColor: "bg-red-100 dark:bg-red-900/30" },
];

const wellnessTips = [
  {
    title: "Light Therapy",
    description: "Consider using a light therapy lamp for 20 to 30 minutes each morning during dark winter months.",
    icon: Sun,
    color: "text-yellow-600",
    bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
  },
  {
    title: "Movement Break",
    description: "Even a 10 minute walk outside during daylight can boost your mood.",
    icon: TrendingUp,
    color: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-900/20",
  },
  {
    title: "Sleep Hygiene",
    description: "Maintain consistent sleep and wake times, even on weekends.",
    icon: Moon,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100 dark:bg-indigo-900/20",
  },
  {
    title: "Social Connection",
    description: "Reach out to one person today. A small check in matters.",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-900/20",
  },
];

const recentMoods = [
  { date: "Today", mood: 4, note: "Had a good study session" },
  { date: "Yesterday", mood: 3, note: "Feeling neutral" },
  { date: "2 days ago", mood: 2, note: "Stressed about assignment" },
];

interface SavedMood {
  id: string;
  userId: string;
  mood: number;
  note: string;
  date: string;
}

interface Recommendation {
  title: string;
  description: string;
  action: string;
  icon: React.ElementType;
}

const moodRecommendations: Record<number, Recommendation[]> = {
  5: [
    {
      title: "Keep the momentum",
      description: "You're feeling great! Share this energy with others.",
      action: "Chat with a friend",
      icon: Heart,
    },
    {
      title: "Document your wins",
      description: "Reflect on what's making you feel good today.",
      action: "Journal your thoughts",
      icon: Moon,
    },
    {
      title: "Help someone else",
      description: "Spread positivity by supporting someone in need.",
      action: "Volunteer or help a friend",
      icon: TrendingUp,
    },
  ],
  4: [
    {
      title: "Maintain your vibe",
      description: "You're in a good place. Keep up healthy habits.",
      action: "Continue what you're doing",
      icon: Sun,
    },
    {
      title: "Social time",
      description: "Good moods are great for connecting with others.",
      action: "Reach out to someone",
      icon: Heart,
    },
    {
      title: "Plan something fun",
      description: "While you're feeling positive, plan something to look forward to.",
      action: "Make plans",
      icon: TrendingUp,
    },
  ],
  3: [
    {
      title: "Self-care check",
      description: "A neutral mood might mean you need a little boost.",
      action: "Try a relaxation sound",
      icon: Moon,
    },
    {
      title: "Movement helps",
      description: "Even light activity can shift your energy.",
      action: "Take a short walk",
      icon: TrendingUp,
    },
    {
      title: "Connect with others",
      description: "Sometimes a simple chat can help.",
      action: "Text a friend",
      icon: Heart,
    },
  ],
  2: [
    {
      title: "Breathing exercise",
      description: "Calm your mind with guided breathing techniques.",
      action: "Start breathing exercise",
      icon: Wind,
    },
    {
      title: "Take a break",
      description: "Step away and give yourself a moment to reset.",
      action: "Rest for 10 minutes",
      icon: Moon,
    },
    {
      title: "Reach out",
      description: "Don't isolate. Talk to someone you trust.",
      action: "Chat with Lantern AI",
      icon: Heart,
    },
  ],
  1: [
    {
      title: "Crisis support",
      description: "You might need immediate support. Please reach out.",
      action: "Access crisis resources",
      icon: Heart,
    },
    {
      title: "Talk to someone",
      description: "Speaking about it can help. You're not alone.",
      action: "Chat with Lantern",
      icon: Heart,
    },
    {
      title: "Breathing exercise",
      description: "Ground yourself with breathing techniques.",
      action: "Start breathing exercise",
      icon: Wind,
    },
  ],
};

/* -------------------------------------------------------------------------- */
/* PAGE                                                                        */
/* -------------------------------------------------------------------------- */

const WellnessPage = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const [savedMoods, setSavedMoods] = useState<SavedMood[]>([]);
  const breathingRef = useRef<HTMLDivElement>(null);
  const relaxationRef = useRef<HTMLDivElement>(null);
  const { currentBackground } = useTheme();
  const { user, isAuthenticated } = useAuth();
  

  const hasCustomBackground =
    currentBackground?.enabled &&
    (currentBackground?.image || (currentBackground as any)?.wallpaper);


  // Handle recommendation action clicks
  const handleRecommendationClick = (action: string) => {
    if (action.includes("Chat")) {
      // Navigate to chat page
      window.location.href = "/chat";
    } else if (action.includes("breathing")) {
      // Scroll to breathing exercise
      setTimeout(() => {
        breathingRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (action.includes("crisis")) {
      // Open crisis resources
      window.location.href = "/chat?mode=crisis";
    } else if (action.includes("relaxation")) {
      // Scroll to relaxation sounds
      setTimeout(() => {
        relaxationRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else if (action.includes("walk") || action.includes("Rest")) {
      // Just show a notification for these
      alert("Take care of yourself! This is a great step towards feeling better.");
    }
  };

  // Load moods from localStorage on mount
  useEffect(() => {
    if (isAuthenticated && user) {
      const storageKey = `moods_${user.id}`;
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        try {
          setSavedMoods(JSON.parse(stored));
        } catch {
          setSavedMoods([]);
        }
      }
    }
  }, [isAuthenticated, user]);

  const handleLogMood = async () => {
    if (!selectedMood || !isAuthenticated || !user) {
      alert("Please log in to save your mood");
      return;
    }

    try {
      const newMood: SavedMood = {
        id: `mood-${Date.now()}`,
        userId: user.id,
        mood: selectedMood,
        note: note,
        date: new Date().toLocaleDateString(),
      };

      // Try to save to backend first
      try {
        const response = await fetch("http://localhost:8000/api/moods", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("auth_token") || ""}`,
          },
          body: JSON.stringify({
            mood: selectedMood,
            note: note,
            userId: user.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Backend save failed");
        }
      } catch (backendError) {
        console.warn("Backend not available, saving locally:", backendError);
        // Continue with local save
      }

      // Save to localStorage (always works)
      const storageKey = `moods_${user.id}`;
      const updated = [newMood, ...savedMoods];
      localStorage.setItem(storageKey, JSON.stringify(updated));
      setSavedMoods(updated);

      // Reset form and show success
      setSelectedMood(null);
      setNote("");
      setIsLogged(true);
      setTimeout(() => setIsLogged(false), 3000);
    } catch (error) {
      console.error("Error saving mood:", error);
      alert("Failed to save mood. Please try again.");
    }
  };

  return (
    <motion.div
      className={cn(
        "min-h-screen relative",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Navigation always on top */}
      <Navigation />

      {/* Main content */}
      <main className="container max-w-6xl mx-auto px-4 pt-24 pb-16 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-serif font-bold mb-4">
            Wellness Check in
          </h1>
          <p className="text-muted-foreground">
            Track your mood and build healthy daily habits.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="forest-card">
              <CardHeader>
                <CardTitle>How are you feeling?</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() => setSelectedMood(mood.value)}
                      className={cn(
                        "p-4 rounded-xl transition",
                        selectedMood === mood.value
                          ? `${mood.bgColor} ring-2 ring-primary`
                          : "bg-card hover:bg-accent"
                      )}
                    >
                      <mood.icon className={`h-8 w-8 ${mood.color}`} />
                      <p className="text-sm mt-2">{mood.label}</p>
                    </button>
                  ))}
                </div>

                {/* Personalized Recommendations */}
                {selectedMood && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 p-4 bg-accent/20 rounded-lg border border-accent/50"
                  >
                    <h3 className="font-semibold mb-4 text-foreground">Suggestions for you:</h3>
                    <div className="space-y-3">
                      {moodRecommendations[selectedMood]?.map((rec, i) => {
                        const RecIcon = rec.icon;
                        return (
                          <div key={i} className="p-3 bg-background rounded-lg flex gap-3">
                            <RecIcon className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <p className="font-medium text-sm">{rec.title}</p>
                              <p className="text-xs text-muted-foreground">{rec.description}</p>
                              <button 
                                onClick={() => handleRecommendationClick(rec.action)}
                                className="text-xs text-primary hover:underline mt-1"
                              >
                                → {rec.action}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Optional note"
                  className="w-full h-24 rounded-lg p-3 border bg-background"
                />

                <Button
                  className="w-full mt-4"
                  onClick={handleLogMood}
                  disabled={!selectedMood}
                >
                  <AnimatePresence mode="wait">
                    {isLogged ? (
                      <motion.span
                        key="logged"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="flex gap-2 items-center"
                      >
                        <Sparkles className="h-4 w-4" />
                        Mood Logged
                      </motion.span>
                    ) : (
                      <span>Log Mood</span>
                    )}
                  </AnimatePresence>
                </Button>
              </CardContent>
            </Card>

            <Card className="forest-card">
              <CardHeader>
                <CardTitle>Recent Check ins</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {isAuthenticated && user ? (
                  savedMoods.length > 0 ? (
                    savedMoods.map((entry) => {
                      const moodOption = moodOptions.find(m => m.value === entry.mood);
                      const MoodIcon = moodOption?.icon || Meh;
                      return (
                        <div key={entry.id} className="p-3 bg-accent/30 rounded-lg flex gap-3">
                          <MoodIcon className={`h-6 w-6 ${moodOption?.color}`} />
                          <div className="flex-1">
                            <p className="font-medium">{entry.date}</p>
                            {entry.note && (
                              <p className="text-sm text-muted-foreground">
                                {entry.note}
                              </p>
                            )}
                          </div>
                          <span className="text-sm text-muted-foreground">{moodOption?.label}</span>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">No moods logged yet</p>
                  )
                ) : (
                  <p className="text-muted-foreground">Please log in to view your mood history</p>
                )}
              </CardContent>
            </Card>

            <div ref={relaxationRef}>
              <RelaxationSounds />
            </div>
            <div ref={breathingRef}>
              <BreathingExercise />
            </div>
          </div>

          {/* Sidebar */}
          <motion.div variants={cardHover3D} whileHover="hover">
            <Card className="forest-card">
              <CardHeader>
                <CardTitle>Seasonal Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {wellnessTips.map((tip, i) => (
                  <div key={i} className={`p-4 rounded-lg ${tip.bgColor}`}>
                    <tip.icon className={`h-5 w-5 ${tip.color}`} />
                    <h4 className="font-medium mt-2">{tip.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default WellnessPage;
