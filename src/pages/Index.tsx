import { motion } from "framer-motion";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PersonalizedGreeting } from "@/components/home/PersonalizedGreeting";
import { QuickActions } from "@/components/home/QuickActions";
import { WarmMessage } from "@/components/home/WarmMessage";
import { SignInPrompt } from "@/components/home/SignInPrompt";
import { AmbientBackground } from "@/components/AmbientBackground";
import { useAuth } from "@/contexts/AuthContext";
import { pageVariants } from "@/lib/animations";

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  // Get the user's display name when authenticated
  const userName = user?.display_name;

  return (
    <motion.div
      className="min-h-screen flex flex-col bg-background relative overflow-hidden"
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Theme-aware ambient background */}
      <AmbientBackground />

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
              {/* Personalized Greeting for signed-in users */}
              <PersonalizedGreeting userName={userName} />

              {/* Warm companion message */}
              <WarmMessage isAuthenticated={true} userName={userName} />
            </>
          ) : (
            <>
              {/* Sign in prompt for guests */}
              <SignInPrompt />

              {/* Welcome message for guests */}
              <WarmMessage isAuthenticated={false} />
            </>
          )}

          {/* Quick Actions - always visible */}
          <QuickActions />
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
