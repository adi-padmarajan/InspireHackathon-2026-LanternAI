/**
 * Index Page - Award-Winning Cinematic Landing Experience
 * A visual masterpiece with stunning animations and perfect visibility
 */

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { CinematicHero } from "@/components/home/CinematicHero";
import { QuickActionsGrid } from "@/components/home/QuickActionsGrid";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { pageVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentBackground, currentTheme } = useTheme();

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
      {/* Theme-aware ambient background */}
      {!hasCustomBackground && <AmbientBackground />}

      {/* Cinematic gradient overlays for depth */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Top vignette */}
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background/80 via-background/20 to-transparent" />
        
        {/* Bottom vignette */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Side vignettes for cinematic framing */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/40 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/40 to-transparent" />
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-16 relative z-10">
        <motion.div
          className="w-full max-w-5xl mx-auto space-y-16 md:space-y-24"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {/* Cinematic Hero */}
          <CinematicHero 
            userName={userName} 
            isAuthenticated={isAuthenticated} 
          />

          {/* Quick Actions */}
          <QuickActionsGrid />
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
