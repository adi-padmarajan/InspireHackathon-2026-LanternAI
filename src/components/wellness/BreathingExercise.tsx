import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Play, Pause, RotateCcw, Wind } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreathingExercise {
  name: string;
  description: string;
  pattern: {
    inhale: number;
    hold?: number;
    exhale: number;
    holdAfterExhale?: number;
  };
  duration: number; // in seconds
}

const exercises: BreathingExercise[] = [
  {
    name: "4-7-8 Breathing",
    description: "Inhale for 4 seconds, hold for 7, exhale for 8. Great for falling asleep.",
    pattern: { inhale: 4, hold: 7, exhale: 8 },
    duration: 60,
  },
  {
    name: "Box Breathing",
    description: "Equal parts: inhale, hold, exhale, hold. Calms the nervous system.",
    pattern: { inhale: 4, hold: 4, exhale: 4, holdAfterExhale: 4 },
    duration: 48,
  },
  {
    name: "Deep Breathing",
    description: "Slow, deep breaths to reduce stress and improve focus.",
    pattern: { inhale: 5, exhale: 5 },
    duration: 120,
  },
];

const BreathingExercise = () => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<"inhale" | "hold" | "exhale" | "holdAfterExhale">("inhale");
  const [timeLeft, setTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && selectedExercise) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Move to next phase
            switch (phase) {
              case "inhale":
                if (selectedExercise.pattern.hold) {
                  setPhase("hold");
                  return selectedExercise.pattern.hold;
                } else {
                  setPhase("exhale");
                  return selectedExercise.pattern.exhale;
                }
              case "hold":
                setPhase("exhale");
                return selectedExercise.pattern.exhale;
              case "exhale":
                if (selectedExercise.pattern.holdAfterExhale) {
                  setPhase("holdAfterExhale");
                  return selectedExercise.pattern.holdAfterExhale;
                } else {
                  setPhase("inhale");
                  setCycle((c) => c + 1);
                  return selectedExercise.pattern.inhale;
                }
              case "holdAfterExhale":
                setPhase("inhale");
                setCycle((c) => c + 1);
                return selectedExercise.pattern.inhale;
              default:
                return 0;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, phase, selectedExercise]);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setPhase("inhale");
    setTimeLeft(exercise.pattern.inhale);
    setTotalTime(exercise.duration);
    setCycle(0);
    setIsActive(true);
  };

  const pauseExercise = () => {
    setIsActive(false);
  };

  const resumeExercise = () => {
    setIsActive(true);
  };

  const resetExercise = () => {
    setIsActive(false);
    setSelectedExercise(null);
    setPhase("inhale");
    setTimeLeft(0);
    setCycle(0);
  };

  const getPhaseText = () => {
    switch (phase) {
      case "inhale": return "Inhale";
      case "hold": return "Hold";
      case "exhale": return "Exhale";
      case "holdAfterExhale": return "Hold";
      default: return "";
    }
  };

  const getProgress = () => {
    if (!selectedExercise) return 0;
    const elapsed = selectedExercise.duration - timeLeft - (cycle * (selectedExercise.pattern.inhale + (selectedExercise.pattern.hold || 0) + selectedExercise.pattern.exhale + (selectedExercise.pattern.holdAfterExhale || 0)));
    return Math.min((elapsed / selectedExercise.duration) * 100, 100);
  };

  return (
    <Card className="forest-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-serif">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <Wind className="h-5 w-5 text-primary" />
          </motion.div>
          Breathing Exercises
        </CardTitle>
      </CardHeader>
      <CardContent>
        <AnimatePresence mode="wait">
          {!selectedExercise ? (
            <motion.div
              key="selection"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <p className="text-sm text-muted-foreground">
                Choose a breathing exercise to get started. These techniques can help reduce stress and improve focus.
              </p>
              <div className="grid gap-3">
                {exercises.map((exercise, index) => (
                  <motion.div
                    key={exercise.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      className="w-full justify-start h-auto p-4"
                      onClick={() => startExercise(exercise)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{exercise.name}</div>
                        <div className="text-sm text-muted-foreground mt-1">
                          {exercise.description}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          Duration: {Math.floor(exercise.duration / 60)}:{(exercise.duration % 60).toString().padStart(2, '0')}
                        </div>
                      </div>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="text-center space-y-6"
            >
              <div>
                <h3 className="text-xl font-semibold mb-2">{selectedExercise.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedExercise.description}</p>
              </div>

              {/* Breathing Circle */}
              <div className="flex justify-center">
                <motion.div
                  className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center relative"
                  animate={{
                    scale: phase === "inhale" ? 1.5 : phase === "exhale" ? 0.8 : 1,
                  }}
                  transition={{ duration: timeLeft, ease: "easeInOut" }}
                >
                  <motion.div
                    className="w-24 h-24 rounded-full bg-primary flex items-center justify-center"
                    animate={{
                      scale: phase === "inhale" ? 1.2 : phase === "exhale" ? 0.7 : 1,
                    }}
                    transition={{ duration: timeLeft, ease: "easeInOut" }}
                  >
                    <span className="text-white font-medium">{timeLeft}</span>
                  </motion.div>
                </motion.div>
              </div>

              {/* Phase Indicator */}
              <motion.div
                key={phase}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-lg font-medium"
              >
                {getPhaseText()}
              </motion.div>

              {/* Progress Bar */}
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  className="bg-primary h-2 rounded-full"
                  style={{ width: `${getProgress()}%` }}
                  transition={{ duration: 1 }}
                />
              </div>

              {/* Controls */}
              <div className="flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={isActive ? pauseExercise : resumeExercise}
                >
                  {isActive ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </Button>
                <Button variant="outline" size="sm" onClick={resetExercise}>
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </div>

              <p className="text-xs text-muted-foreground">
                Cycle {cycle + 1} • {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')} remaining
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
};

export default BreathingExercise;