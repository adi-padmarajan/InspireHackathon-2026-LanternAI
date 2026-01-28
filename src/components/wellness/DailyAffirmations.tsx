import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RefreshCw, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

const affirmations = [
  "You are stronger than you think.",
  "Your potential is limitless.",
  "Today is full of possibilities.",
  "You deserve kindness, especially from yourself.",
  "Progress, not perfection, is the goal.",
  "You are enough, right here, right now.",
  "Your struggles are making you stronger.",
  "You have overcome challenges before, you will again.",
  "Be gentle with yourself, you're doing your best.",
  "Your mental health matters. Take care of it.",
  "You are worthy of love and respect.",
  "Every day is a fresh start.",
  "You have the power to change your story.",
  "Breathe. You are going to be okay.",
  "Your feelings are valid and important.",
  "You are not alone in this journey.",
  "Growth happens outside your comfort zone.",
  "You are resilient and capable.",
  "This moment is temporary, you will get through it.",
  "Your voice matters and your opinion counts.",
  "You are allowed to take breaks.",
  "Mistakes are opportunities to learn and grow.",
  "You bring value to the world.",
  "Your effort is enough, even on hard days.",
  "You deserve rest and relaxation.",
  "You are creating the life you want.",
  "Challenges are chances to become stronger.",
  "You are loved for who you are.",
  "Your wellbeing is a priority.",
  "You are blooming at your own pace.",
];

const DailyAffirmations = () => {
  const [currentQuote, setCurrentQuote] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isFavorited, setIsFavorited] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favoriteAffirmations");
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch {
        setFavorites([]);
      }
    }
    // Set initial quote
    getRandomQuote();
  }, []);

  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    const quote = affirmations[randomIndex];
    setCurrentQuote(quote);
    setIsFavorited(favorites.includes(quote));
  };

  const toggleFavorite = () => {
    let updatedFavorites;
    if (isFavorited) {
      updatedFavorites = favorites.filter((q) => q !== currentQuote);
    } else {
      updatedFavorites = [...favorites, currentQuote];
    }
    setFavorites(updatedFavorites);
    localStorage.setItem("favoriteAffirmations", JSON.stringify(updatedFavorites));
    setIsFavorited(!isFavorited);
  };

  return (
    <Card className="forest-card bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <CardHeader>
        <CardTitle className="text-lg font-serif">Daily Affirmation</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quote Display */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuote}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="p-4 rounded-lg bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20 min-h-20 flex items-center justify-center"
          >
            <motion.p
              className="text-sm md:text-base text-foreground text-center font-medium leading-relaxed italic"
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
            >
              "{currentQuote}"
            </motion.p>
          </motion.div>
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={getRandomQuote}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            <span className="text-sm">New Quote</span>
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleFavorite}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors",
              isFavorited
                ? "bg-pink-500/20 text-pink-600 dark:text-pink-400"
                : "bg-secondary/10 hover:bg-secondary/20 text-secondary"
            )}
          >
            <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
            <span className="text-sm">{isFavorited ? "Saved" : "Save"}</span>
          </motion.button>
        </div>

        {/* Favorites */}
        {favorites.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="space-y-2 pt-2 border-t border-border/30"
          >
            <p className="text-xs font-medium text-muted-foreground">Saved Affirmations</p>
            <div className="max-h-32 overflow-y-auto space-y-2">
              {favorites.map((fav, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="text-xs p-2 rounded bg-accent/30 text-foreground leading-snug flex items-start gap-2 group"
                >
                  <span className="text-pink-500 mt-0.5 flex-shrink-0">♥</span>
                  <p className="flex-1">{fav}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default DailyAffirmations;
