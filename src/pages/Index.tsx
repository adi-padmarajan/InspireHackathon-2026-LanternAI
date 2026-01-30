/**
 * Index Page - Lantern AI Wellness Companion
 * Apple-level UX with cinematic animations and clean design
 */

import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroTagline } from "@/components/home/HeroTagline";
import { WellnessDimensionsGrid } from "@/components/home/WellnessDimensionsGrid";
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

      {/* Cinematic vignettes */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-background/60 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <Navigation />

      <main className="flex-1 flex flex-col px-4 py-8 md:py-12 relative z-10">
        <div className="w-full max-w-6xl mx-auto space-y-16 md:space-y-24">
          {/* Hero Section */}
          <HeroTagline 
            userName={userName} 
            isAuthenticated={isAuthenticated} 
          />

          {/* Wellness Dimensions */}
          <WellnessDimensionsGrid />

          {/* Quick Actions */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <QuickActionsGrid />
          </motion.section>
        </div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
