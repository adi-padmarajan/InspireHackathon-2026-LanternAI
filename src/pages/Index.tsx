/**
 * Index Page - Lantern AI Wellness Companion
 * Premium Apple-level design with perfect alignment
 */

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroTagline } from "@/components/home/HeroTagline";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { pageVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentBackground } = useTheme();

  const userName = user?.display_name;
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);
  const floatingParticles = [
    { left: "12%", top: "18%", size: "h-1.5 w-1.5", duration: 6.5, delay: 0 },
    { left: "28%", top: "62%", size: "h-1 w-1", duration: 5.2, delay: 0.6 },
    { left: "46%", top: "32%", size: "h-1.5 w-1.5", duration: 6.8, delay: 1.1 },
    { left: "64%", top: "70%", size: "h-1 w-1", duration: 5.6, delay: 0.3 },
    { left: "78%", top: "24%", size: "h-1.5 w-1.5", duration: 7.2, delay: 0.9 },
    { left: "90%", top: "52%", size: "h-1 w-1", duration: 5.9, delay: 1.4 },
  ];

  return (
    <motion.div
      className={cn(
        "h-screen flex flex-col relative overflow-hidden",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Ambient background */}
      {!hasCustomBackground && <AmbientBackground />}

      {/* Cinematic vignettes - refined */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-background/60 via-background/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background/80 via-background/40 to-transparent" />
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col relative z-10 pt-16 overflow-hidden">
        {/* Single viewport layout */}
        <section className="relative flex-1 flex flex-col items-center justify-center px-4 py-4">
          {/* Floating particles across the full space */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {floatingParticles.map((particle) => (
              <motion.div
                key={`${particle.left}-${particle.top}`}
                className={cn("absolute rounded-full bg-primary/30", particle.size)}
                style={{ left: particle.left, top: particle.top }}
                animate={{ y: [-24, 12, -24], opacity: [0, 1, 0] }}
                transition={{
                  duration: particle.duration,
                  repeat: Infinity,
                  delay: particle.delay,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          <div className="w-full max-w-6xl mx-auto flex flex-col items-center gap-6">
            <HeroTagline 
              userName={userName} 
              isAuthenticated={isAuthenticated} 
            />
            <QuickActionsGrid />
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
