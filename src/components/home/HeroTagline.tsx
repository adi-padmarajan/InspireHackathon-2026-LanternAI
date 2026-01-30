/**
 * HeroTagline - Minimal, Apple-style hero section
 * Clean typography with subtle animations
 */

import { motion } from "framer-motion";
import { Lamp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroTaglineProps {
  userName?: string;
  isAuthenticated: boolean;
}

export const HeroTagline = ({ userName, isAuthenticated }: HeroTaglineProps) => {
  return (
    <motion.section
      className="relative flex flex-col items-center text-center py-8 md:py-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Ambient glow */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-[500px] h-[500px] pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/10 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Lantern Icon */}
      <motion.div
        className="relative mb-8"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <motion.div
          className={cn(
            "relative p-5 rounded-full",
            "bg-gradient-to-br from-accent via-accent/80 to-accent/60",
            "shadow-xl"
          )}
          animate={{
            boxShadow: [
              "0 0 30px hsl(var(--lantern-glow) / 0.25)",
              "0 0 50px hsl(var(--lantern-glow) / 0.4)",
              "0 0 30px hsl(var(--lantern-glow) / 0.25)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -3, 0], rotate: [0, 1, 0, -1, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lamp className="h-10 w-10 md:h-12 md:w-12 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
      >
        {isAuthenticated && userName ? (
          <>
            Welcome back,{" "}
            <span className="text-primary">{userName}</span>
          </>
        ) : (
          <>
            A Light for Your{" "}
            <span className="text-primary">Wellness Journey</span>
          </>
        )}
      </motion.h1>

      {/* Subtitle */}
      <motion.p
        className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed mb-8"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.6 }}
      >
        {isAuthenticated ? (
          "Your AI wellness companion is here. Let's explore what's on your mind."
        ) : (
          "Your 24/7 AI companion for holistic wellness and seasonal depression support. Designed by UVic students, for UVic students."
        )}
      </motion.p>

      {/* CTA Buttons */}
      <motion.div
        className="flex flex-col sm:flex-row items-center gap-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        <Button variant="lantern" size="lg" asChild>
          <Link to="/chat" className="flex items-center gap-2">
            Start a Conversation
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button variant="outline" size="lg" asChild>
          <Link to="/wellness">Wellness Check-in</Link>
        </Button>
      </motion.div>

      {/* Trust indicators */}
      <motion.div
        className="mt-12 flex flex-wrap items-center justify-center gap-6 md:gap-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.5 }}
      >
        {[
          { label: "24/7 Available", color: "bg-emerald-500" },
          { label: "Judgment-Free", color: "bg-violet-500" },
          { label: "UVic-Focused", color: "bg-blue-500" },
          { label: "SAD Support", color: "bg-orange-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <span className={cn("w-2 h-2 rounded-full", item.color)} />
            <span className="text-sm text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </motion.div>
    </motion.section>
  );
};
