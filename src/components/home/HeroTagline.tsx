/**
 * HeroTagline - Premium Apple-style hero section
 * Cinematic typography with elegant animations
 */

import { motion } from "framer-motion";
import { Lamp, ArrowRight, Sparkles } from "lucide-react";
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
      className="relative flex flex-col items-center justify-center text-center min-h-[70vh] py-16 md:py-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Ambient glow - centered */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none">
        <motion.div
          className="absolute inset-0 bg-gradient-radial from-primary/15 via-primary/5 to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full"
            style={{
              left: `${30 + i * 20}%`,
              top: `${40 + i * 10}%`,
            }}
            animate={{
              y: [-20, -40, -20],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Lantern Icon - Refined */}
      <motion.div
        className="relative mb-10"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
      >
        <motion.div
          className={cn(
            "relative p-6 rounded-full",
            "bg-gradient-to-br from-accent via-accent/80 to-accent/50",
            "shadow-2xl border border-white/10"
          )}
          animate={{
            boxShadow: [
              "0 0 40px hsl(var(--lantern-glow) / 0.2), 0 0 80px hsl(var(--lantern-glow) / 0.1)",
              "0 0 60px hsl(var(--lantern-glow) / 0.35), 0 0 100px hsl(var(--lantern-glow) / 0.15)",
              "0 0 40px hsl(var(--lantern-glow) / 0.2), 0 0 80px hsl(var(--lantern-glow) / 0.1)",
            ],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
          <motion.div
            animate={{ y: [0, -4, 0], rotate: [0, 2, 0, -2, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Lamp className="h-12 w-12 md:h-14 md:w-14 text-primary" />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Main heading - Apple style large typography */}
      <motion.h1
        className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground tracking-tight mb-6 max-w-4xl"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.7, ease: "easeOut" }}
      >
        {isAuthenticated && userName ? (
          <>
            Welcome back,
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              {userName}
            </span>
          </>
        ) : (
          <>
            A Light for Your
            <br />
            <span className="bg-gradient-to-r from-primary via-primary to-primary/80 bg-clip-text text-transparent">
              Wellness Journey
            </span>
          </>
        )}
      </motion.h1>

      {/* Subtitle - refined spacing */}
      <motion.p
        className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-2xl leading-relaxed mb-12 px-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45, duration: 0.6 }}
      >
        {isAuthenticated ? (
          "Your AI wellness companion is here. Let's explore what's on your mind."
        ) : (
          "Your 24/7 AI companion for holistic wellness and seasonal depression support."
        )}
      </motion.p>

      {/* CTA Buttons - Clean and prominent */}
      <motion.div
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        <Link to="/chat">
          <Button
            size="lg"
            className={cn(
              "h-14 px-8 text-base font-medium rounded-full",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
              "transition-all duration-300"
            )}
          >
            <Sparkles className="mr-2 h-5 w-5" />
            Start Conversation
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        
        {!isAuthenticated && (
          <Link to="/wellness">
            <Button
              size="lg"
              variant="outline"
              className={cn(
                "h-14 px-8 text-base font-medium rounded-full",
                "border-border/60 hover:border-border",
                "bg-background/50 backdrop-blur-sm",
                "hover:bg-accent/50",
                "transition-all duration-300"
              )}
            >
              Explore Wellness
            </Button>
          </Link>
        )}
      </motion.div>

      {/* Trust badge */}
      {!isAuthenticated && (
        <motion.p
          className="mt-8 text-sm text-muted-foreground/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          Designed by UVic students, for UVic students
        </motion.p>
      )}
    </motion.section>
  );
};
