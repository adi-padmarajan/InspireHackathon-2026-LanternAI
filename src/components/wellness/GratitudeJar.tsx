import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sparkles, Trash2, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

interface GratitudeEntry {
  id: string;
  text: string;
  date: string;
  color: string;
}

const colors = [
  "bg-rose-100 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300",
  "bg-pink-100 dark:bg-pink-900/20 text-pink-700 dark:text-pink-300",
  "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300",
  "bg-amber-100 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300",
  "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300",
  "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300",
];

const GratitudeJar = () => {
  const [entries, setEntries] = useState<GratitudeEntry[]>([]);
  const [input, setInput] = useState("");
  const [showForm, setShowForm] = useState(false);

  // Load entries from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("gratitudeEntries");
    if (stored) {
      try {
        setEntries(JSON.parse(stored));
      } catch {
        setEntries([]);
      }
    }
  }, []);

  // Save entries to localStorage
  useEffect(() => {
    localStorage.setItem("gratitudeEntries", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {
    if (input.trim()) {
      const newEntry: GratitudeEntry = {
        id: Date.now().toString(),
        text: input,
        date: new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        color: colors[entries.length % colors.length],
      };
      setEntries([newEntry, ...entries]);
      setInput("");
      setShowForm(false);
    }
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  const jarFillPercentage = Math.min((entries.length / 30) * 100, 100);

  return (
    <Card className="forest-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            <Heart className="h-5 w-5 text-pink-500" />
          </motion.div>
          Gratitude Jar
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Jar Visualization */}
        <div className="flex flex-col items-center gap-4">
          <div className="relative h-64 w-32 rounded-b-2xl rounded-t-lg border-4 border-amber-800 dark:border-amber-600 bg-gradient-to-t from-amber-100 to-transparent dark:from-amber-900/30 dark:to-transparent overflow-hidden">
            {/* Jar glow effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-yellow-300/20 to-transparent"
              animate={{
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{ duration: 2.5, repeat: Infinity }}
            />

            {/* Liquid fill */}
            <motion.div
              className="absolute bottom-0 w-full bg-gradient-to-r from-pink-300 via-yellow-300 to-orange-300 dark:from-pink-500 dark:via-yellow-500 dark:to-orange-500 opacity-70"
              initial={{ height: "0%" }}
              animate={{ height: `${jarFillPercentage}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
            />

            {/* Floating sparkles inside jar */}
            {entries.length > 0 &&
              Array.from({ length: Math.min(entries.length, 5) }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full"
                  animate={{
                    y: [0, -200, 0],
                    x: [0, Math.cos(i) * 20, 0],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                  style={{
                    left: `${20 + (i % 3) * 30}%`,
                    bottom: "20%",
                  }}
                />
              ))}

            {/* Jar shine effect */}
            <div className="absolute top-2 left-2 w-6 h-12 bg-white/30 rounded-full blur-sm" />
          </div>

          {/* Fill progress */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm font-medium text-foreground">
              {entries.length} gratitude{entries.length !== 1 ? "s" : ""} collected
            </p>
            <p className="text-xs text-muted-foreground">
              {entries.length < 30
                ? `${30 - entries.length} more to fill the jar!`
                : "🎉 Jar is full! Keep adding!"}
            </p>
          </motion.div>
        </div>

        {/* Add Entry Button */}
        <AnimatePresence mode="wait">
          {!showForm ? (
            <motion.div
              key="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Button
                onClick={() => setShowForm(true)}
                className="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Add Gratitude
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="space-y-3"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.ctrlKey) {
                    addEntry();
                  }
                }}
                placeholder="What are you grateful for today?"
                className="w-full h-20 bg-background border border-input rounded-lg px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={addEntry}
                  disabled={!input.trim()}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
                >
                  Add
                </Button>
                <Button
                  onClick={() => {
                    setShowForm(false);
                    setInput("");
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Past Entries */}
        {entries.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-3"
          >
            <h3 className="text-sm font-medium text-foreground">Recent Gratitudes</h3>
            <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
              {entries.map((entry, index) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "p-3 rounded-lg flex items-start justify-between gap-2 transition-all cursor-default",
                    entry.color
                  )}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug break-words">
                      {entry.text}
                    </p>
                    <p className="text-xs opacity-70 mt-1">{entry.date}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteEntry(entry.id)}
                    className="flex-shrink-0 p-1 hover:opacity-70 transition-opacity"
                  >
                    <Trash2 className="h-4 w-4" />
                  </motion.button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {entries.length === 0 && !showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-6"
          >
            <p className="text-sm text-muted-foreground">
              Start your gratitude practice! Add your first entry to fill the jar.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default GratitudeJar;
