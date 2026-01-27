import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import RelaxationSounds from "@/components/wellness/RelaxationSounds";
import BreathingExercise from "@/components/wellness/BreathingExercise";
import { useTheme } from "@/contexts/ThemeContext";
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
import {
  springPresets,
  staggerContainer,
  staggerChild,
  scrollReveal,
  cardHover3D,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

const moodOptions = [
  { icon: Smile, label: "Great", value: 5, color: "text-green-500", bgColor: "bg-green-100 dark:bg-green-900/20" },
  { icon: Smile, label: "Good", value: 4, color: "text-blue-500", bgColor: "bg-blue-100 dark:bg-blue-900/20" },
  { icon: Meh, label: "Okay", value: 3, color: "text-yellow-500", bgColor: "bg-yellow-100 dark:bg-yellow-900/20" },
  { icon: Frown, label: "Low", value: 2, color: "text-orange-500", bgColor: "bg-orange-100 dark:bg-orange-900/20" },
  { icon: CloudRain, label: "Struggling", value: 1, color: "text-red-500", bgColor: "bg-red-100 dark:bg-red-900/20" },
];

const wellnessTips = [
  {
    title: "Light Therapy",
    description: "Consider using a light therapy lamp for 20-30 minutes each morning during dark winter months.",
    icon: Sun,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50 dark:bg-yellow-900/10",
  },
  {
    title: "Movement Break",
    description: "Even a 10-minute walk outside during daylight can boost your mood significantly.",
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-900/10",
  },
  {
    title: "Sleep Hygiene",
    description: "Try to maintain consistent sleep/wake times, even on weekends. Aim for 7-9 hours.",
    icon: Moon,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50 dark:bg-indigo-900/10",
  },
  {
    title: "Social Connection",
    description: "Reach out to one person today—a text, call, or coffee chat can make a difference.",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-50 dark:bg-pink-900/10",
  },
];

const recentMoods = [
  { date: "Today", mood: 4, note: "Had a good study session" },
  { date: "Yesterday", mood: 3, note: "Feeling neutral" },
  { date: "2 days ago", mood: 2, note: "Stressed about assignment" },
  { date: "3 days ago", mood: 4, note: "Met up with friends" },
  { date: "4 days ago", mood: 3, note: "" },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const headerVariants = {
  initial: { opacity: 0, y: 30 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { ...springPresets.gentle, delay: 0.2 }
  }
};

const moodButtonVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { ...springPresets.bouncy, delay: 0.3 + i * 0.08 }
  }),
  hover: {
    scale: 1.08,
    y: -4,
    transition: springPresets.snappy
  },
  tap: { scale: 0.95 },
  selected: {
    scale: 1.1,
    transition: springPresets.bouncy
  }
};

const checkInItemVariants = {
  initial: { opacity: 0, x: -20 },
  animate: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { ...springPresets.gentle, delay: i * 0.1 }
  }),
  hover: {
    x: 8,
    backgroundColor: "rgba(var(--accent), 0.5)",
    transition: springPresets.snappy
  }
};

const successVariants = {
  initial: { scale: 0, rotate: -180 },
  animate: {
    scale: 1,
    rotate: 0,
    transition: springPresets.bouncy
  },
  exit: {
    scale: 0,
    rotate: 180,
    transition: { duration: 0.3 }
  }
};

const WellnessPage = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [note, setNote] = useState("");
  const [isLogged, setIsLogged] = useState(false);
  const { currentBackground } = useTheme();

  // Check if custom background (image or wallpaper) is active
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || (currentBackground as any)?.wallpaper);

  const handleLogMood = () => {
    if (selectedMood) {
      setIsLogged(true);
      setTimeout(() => setIsLogged(false), 3000);
    }
  };

  return (
    <motion.div
      className={cn(
        "min-h-screen",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Navigation />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-12"
            variants={headerVariants}
            initial="initial"
            animate="animate"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ ...springPresets.bouncy, delay: 0.1 }}
              className="inline-block mb-4 p-4 rounded-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20"
            >
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
              >
                <Heart className="h-12 w-12 text-primary mx-auto" />
              </motion.div>
            </motion.div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-4">
              Wellness <motion.span
                className="text-primary inline-block"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(var(--primary), 0)",
                    "0 0 20px rgba(var(--primary), 0.3)",
                    "0 0 10px rgba(var(--primary), 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >Check-in</motion.span>
            </h1>
            <motion.p
              className="text-lg text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Track your mood, discover patterns, and get personalized wellness suggestions.
              Small check-ins lead to big insights.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="mt-6 flex flex-wrap justify-center gap-2"
            >
              {["🧘‍♀️ Breathe", "📝 Journal", "🌞 Light Therapy", "🤝 Connect"].map((tip, index) => (
                <motion.span
                  key={tip}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring" }}
                  className="px-3 py-1 bg-accent/50 rounded-full text-sm text-foreground"
                >
                  {tip}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Mood Check-in */}
            <motion.div
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...springPresets.gentle, delay: 0.3 }}
            >
              <Card className="forest-card overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-serif">
                    <motion.div
                      animate={{
                        scale: [1, 1.2, 1]
                      }}
                      transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                    </motion.div>
                    How are you feeling?
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Mood Selector */}
                  <div className="flex flex-wrap justify-center gap-4 mb-6">
                    {moodOptions.map((mood, index) => (
                      <motion.button
                        key={mood.value}
                        custom={index}
                        variants={moodButtonVariants}
                        initial="initial"
                        animate={selectedMood === mood.value ? "selected" : "animate"}
                        whileHover="hover"
                        whileTap="tap"
                        onClick={() => setSelectedMood(mood.value)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-all duration-300 ${
                          selectedMood === mood.value
                            ? `${mood.bgColor} ring-2 ring-primary shadow-lg`
                            : `bg-card hover:${mood.bgColor} hover:shadow-md`
                        }`}
                      >
                        {selectedMood === mood.value && (
                          <motion.div
                            className="absolute inset-0 rounded-xl bg-primary/10"
                            layoutId="moodHighlight"
                            transition={springPresets.snappy}
                          />
                        )}
                        <motion.div
                          animate={selectedMood === mood.value ? {
                            rotate: [0, -10, 10, 0],
                            scale: [1, 1.1, 1]
                          } : {}}
                          transition={{ duration: 0.5 }}
                        >
                          <mood.icon className={`h-10 w-10 ${mood.color} relative z-10`} />
                        </motion.div>
                        <span className="text-sm font-medium text-foreground relative z-10">{mood.label}</span>
                      </motion.button>
                    ))}
                  </div>

                  {/* Note Input */}
                  <motion.div
                    className="mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                  >
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Add a note (optional)
                    </label>
                    <motion.textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="What's on your mind? Any specific events or feelings..."
                      className="w-full h-24 bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-shadow"
                      whileFocus={{
                        boxShadow: "0 0 0 3px rgba(var(--primary), 0.1)",
                      }}
                    />
                  </motion.div>

                  {/* Log Button */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="lantern"
                      className="w-full relative overflow-hidden"
                      onClick={handleLogMood}
                      disabled={!selectedMood}
                    >
                      <AnimatePresence mode="wait">
                        {isLogged ? (
                          <motion.span
                            key="success"
                            variants={successVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex items-center gap-2"
                          >
                            <Sparkles className="h-4 w-4" />
                            Mood Logged!
                          </motion.span>
                        ) : (
                          <motion.span
                            key="default"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            Log My Mood
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </Button>
                  </motion.div>

                  <motion.p
                    className="text-xs text-muted-foreground text-center mt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                  >
                    Your mood data is private and helps you track patterns over time.
                  </motion.p>
                </CardContent>
              </Card>

              {/* Mood History */}
              <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="forest-card mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                      >
                        <Calendar className="h-5 w-5 text-primary" />
                      </motion.div>
                      Recent Check-ins
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {recentMoods.map((entry, index) => {
                        const moodOption = moodOptions.find(m => m.value === entry.mood);
                        const MoodIcon = moodOption?.icon || Meh;
                        return (
                          <motion.div
                            key={index}
                            custom={index}
                            variants={checkInItemVariants}
                            initial="initial"
                            whileInView="animate"
                            whileHover="hover"
                            viewport={{ once: true }}
                            className="flex items-center gap-4 p-3 rounded-lg bg-accent/30 cursor-default"
                          >
                            <motion.div
                              whileHover={{ scale: 1.2, rotate: 10 }}
                              transition={springPresets.snappy}
                            >
                              <MoodIcon className={`h-6 w-6 ${moodOption?.color}`} />
                            </motion.div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-foreground">{entry.date}</p>
                              {entry.note && (
                                <p className="text-xs text-muted-foreground">{entry.note}</p>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">{moodOption?.label}</span>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Relaxation Sounds */}
              <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <RelaxationSounds />
              </motion.div>

              {/* Breathing Exercises */}
              <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <BreathingExercise />
              </motion.div>
            </motion.div>

            {/* Wellness Tips Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...springPresets.gentle, delay: 0.5 }}
            >
              <motion.div
                variants={cardHover3D}
                whileHover="hover"
                style={{ transformStyle: "preserve-3d" }}
              >
                <Card className="forest-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-serif">
                      <motion.div
                        animate={{
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{
                          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                          scale: { duration: 2, repeat: Infinity }
                        }}
                      >
                        <Sun className="h-5 w-5 text-secondary" />
                      </motion.div>
                      Seasonal Tips
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-muted-foreground">
                      Victoria's dark winters can be challenging. Here are some evidence-based strategies:
                    </p>
                    <motion.div
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      {wellnessTips.map((tip, index) => (
                        <motion.div
                          key={index}
                          variants={staggerChild}
                          whileHover={{
                            scale: 1.02,
                            x: 4,
                            transition: springPresets.snappy
                          }}
                          className={`p-4 rounded-lg ${tip.bgColor} cursor-default border border-border/50`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <motion.div
                              whileHover={{ rotate: 15, scale: 1.2 }}
                              transition={springPresets.snappy}
                            >
                              <tip.icon className={`h-5 w-5 ${tip.color}`} />
                            </motion.div>
                            <h4 className="font-medium text-foreground">{tip.title}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground">{tip.description}</p>
                        </motion.div>
                      ))}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Actions */}
              <motion.div
                variants={scrollReveal}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
              >
                <Card className="forest-card mt-6">
                  <CardHeader>
                    <CardTitle className="font-serif text-lg">Need Support?</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {[
                      { href: "/chat", icon: "💬", label: "Talk to Lantern", color: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300" },
                      { href: "/chat?mode=crisis", icon: "🆘", label: "Crisis Resources", color: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300" },
                      { href: "tel:2507218341", icon: "📞", label: "UVic Counselling", color: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300" },
                    ].map((action, index) => (
                      <motion.div
                        key={action.href}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ ...springPresets.gentle, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button variant="outline" className={`w-full justify-start ${action.color} border-border/50 hover:shadow-md transition-shadow`} asChild>
                          <a href={action.href}>
                            <span className="mr-2">{action.icon}</span>
                            {action.label}
                          </a>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default WellnessPage;
