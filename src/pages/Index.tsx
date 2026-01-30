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
      {/* Ambient background */}
      {!hasCustomBackground && <AmbientBackground />}

      {/* Cinematic vignettes - refined */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-background/80 via-background/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-background via-background/60 to-transparent" />
        {/* Side vignettes for cinematic effect */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background/30 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-background/30 to-transparent" />
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col relative z-10">
        {/* Hero Section - Full viewport centered */}
        <section className="px-4">
          <div className="w-full max-w-6xl mx-auto">
            <HeroTagline 
              userName={userName} 
              isAuthenticated={isAuthenticated} 
            />
          </div>
        </section>

        {/* Features Section - Proper spacing from hero */}
        <section className="px-4 py-16 md:py-24">
          <QuickActionsGrid />
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
