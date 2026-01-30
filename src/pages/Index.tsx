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
        <section className="flex-1 flex flex-col px-4 py-2">
          <div className="w-full max-w-6xl mx-auto flex flex-col flex-1">
            <HeroTagline 
              userName={userName} 
              isAuthenticated={isAuthenticated} 
            />
            <QuickActionsGrid className="-mt-2 md:mt-0" />
          </div>
        </section>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
