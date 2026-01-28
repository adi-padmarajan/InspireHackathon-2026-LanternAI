import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PersonalizedGreeting } from "@/components/home/PersonalizedGreeting";
import { QuickActions } from "@/components/home/QuickActions";
import { WarmMessage } from "@/components/home/WarmMessage";
import { SignInPrompt } from "@/components/home/SignInPrompt";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { pageVariants } from "@/lib/animations";
import { cn } from "@/lib/utils";

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentBackground } = useTheme();

  // Get the user's display name when authenticated
  const userName = user?.display_name;

  // Check if custom background (image or wallpaper) is active
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
      {/* Theme-aware ambient background - hide when custom background is active */}
      {!hasCustomBackground && <AmbientBackground />}

      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 relative z-10">
        <motion.div
          className="w-full max-w-4xl mx-auto space-y-12 md:space-y-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isAuthenticated && userName ? (
            <>
              {/* Personalized Greeting with glass effect when custom background is active */}
              <div className={cn(
                "relative",
                hasCustomBackground && "rounded-2xl bg-background/50 backdrop-blur-lg border border-border/20 shadow-lg p-6 md:p-8"
              )}>
                <PersonalizedGreeting userName={userName} />
              </div>

              {/* Warm companion message with glass effect */}
              <div className={cn(
                "relative",
                hasCustomBackground && "rounded-2xl bg-background/50 backdrop-blur-lg border border-border/20 shadow-lg p-6 md:p-8"
              )}>
                <WarmMessage isAuthenticated={true} userName={userName} />
              </div>
            </>
          ) : (
            <>
              {/* Sign in prompt with glass effect */}
              <div className={cn(
                "relative",
                hasCustomBackground && "rounded-2xl bg-background/50 backdrop-blur-lg border border-border/20 shadow-lg p-6 md:p-8"
              )}>
                <SignInPrompt />
              </div>

              {/* Welcome message with glass effect */}
              <div className={cn(
                "relative",
                hasCustomBackground && "rounded-2xl bg-background/50 backdrop-blur-lg border border-border/20 shadow-lg p-6 md:p-8"
              )}>
                <WarmMessage isAuthenticated={false} />
              </div>
            </>
          )}

          {/* Quick Actions - no glass effect, they have their own card styling */}
          <QuickActions />
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
