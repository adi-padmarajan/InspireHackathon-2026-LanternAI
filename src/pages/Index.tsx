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
import { cn } from "@/lib/utils";

// Cinematic page transition variants
const pageVariants = {
  initial: { opacity: 0 },
  enter: {
    opacity: 1,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

// Staggered content animation
const contentVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    }
  }
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    filter: "blur(10px)"
  },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94]
    }
  }
};

const Index = () => {
  const { user, isAuthenticated } = useAuth();
  const { currentBackground } = useTheme();

  const userName = user?.display_name;
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);

  return (
    <motion.div
      className={cn(
        "min-h-screen flex flex-col relative overflow-hidden",
        hasCustomBackground ? "bg-transparent" : "mesh-gradient-bg"
      )}
      variants={pageVariants}
      initial="initial"
      animate="enter"
      exit="exit"
    >
      {/* Cinematic ambient orbs - always visible for depth */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Primary glow orb - top left */}
        <motion.div
          className="gradient-orb gradient-orb-glow w-[600px] h-[600px] -top-40 -left-40 float-orb-slow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.5, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
        />

        {/* Secondary orb - top right */}
        <motion.div
          className="gradient-orb gradient-orb-primary w-[500px] h-[500px] -top-20 -right-32 float-orb-reverse"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        />

        {/* Accent orb - bottom center */}
        <motion.div
          className="gradient-orb gradient-orb-accent w-[700px] h-[700px] -bottom-60 left-1/2 -translate-x-1/2 float-orb"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.35, scale: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: "easeOut" }}
        />

        {/* Small accent orb - left side */}
        <motion.div
          className="gradient-orb gradient-orb-glow w-[300px] h-[300px] top-1/2 -left-20 float-orb-reverse soft-pulse"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ duration: 2, delay: 0.8 }}
        />
      </div>

      {/* Theme-aware ambient particles - hide when custom background is active */}
      {!hasCustomBackground && <AmbientBackground />}

      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8 md:py-12 relative z-10">
        <motion.div
          className="w-full max-w-5xl mx-auto"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {isAuthenticated && userName ? (
            <div className="space-y-8 md:space-y-12">
              {/* Hero Section with liquid glass */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className={cn(
                  "relative z-10 p-8 md:p-12",
                  "liquid-glass-hero"
                )}>
                  {/* Inner glow accent */}
                  <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-gradient-to-b from-[hsl(var(--theme-glow)/0.1)] to-transparent blur-2xl" />
                  </div>

                  <PersonalizedGreeting userName={userName} />
                </div>
              </motion.div>

              {/* Warm Message Section */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className={cn(
                  "relative z-10 p-6 md:p-10",
                  "liquid-glass-glow"
                )}>
                  <WarmMessage isAuthenticated={true} userName={userName} />
                </div>
              </motion.div>

              {/* Quick Actions with beautiful spacing */}
              <motion.div variants={itemVariants}>
                <QuickActions />
              </motion.div>
            </div>
          ) : (
            <div className="space-y-8 md:space-y-12">
              {/* Hero Sign-in Section */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className={cn(
                  "relative z-10 p-8 md:p-12",
                  "liquid-glass-hero breathing-glow"
                )}>
                  {/* Decorative top glow */}
                  <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-40 bg-gradient-to-b from-[hsl(var(--theme-glow)/0.15)] to-transparent blur-3xl" />
                  </div>

                  <SignInPrompt />
                </div>
              </motion.div>

              {/* Welcome Message */}
              <motion.div
                variants={itemVariants}
                className="relative"
              >
                <div className={cn(
                  "relative z-10 p-6 md:p-10",
                  "liquid-glass-glow"
                )}>
                  <WarmMessage isAuthenticated={false} />
                </div>
              </motion.div>

              {/* Quick Actions */}
              <motion.div variants={itemVariants}>
                <QuickActions />
              </motion.div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </motion.div>
  );
};

export default Index;
