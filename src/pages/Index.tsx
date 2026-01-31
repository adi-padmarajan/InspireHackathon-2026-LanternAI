/**
 * Index Page - Lantern AI Wellness Companion
 * Ultra-premium cinematic experience with Apple-level whitespace
 */

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CinematicHero } from "@/components/home/CinematicHero";
import { QuickActionChips } from "@/components/home/QuickActionChips";
import { AmbientBackground } from "@/components/AmbientBackground";
import { FilmGrain, CinematicVignette, AmbientGradients } from "@/components/FilmGrain";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { pageVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentBackground } = useTheme();

  const userName = user?.display_name;
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);

  return (
    <motion.div
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Cinematic layers */}
      {!hasCustomBackground && <AmbientBackground />}
      <AmbientGradients />
      <CinematicVignette intensity={0.35} />
      <FilmGrain opacity={0.025} />

      {/* Top gradient vignette */}
      <div className="fixed inset-x-0 top-0 h-32 bg-gradient-to-b from-background/80 to-transparent pointer-events-none z-10" />

      <Navigation />

      <main className="flex-1 flex flex-col relative z-10">
        <CinematicHero 
          userName={userName} 
          isAuthenticated={isAuthenticated} 
        />
        <QuickActionChips />
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
