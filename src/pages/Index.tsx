import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PersonalizedGreeting } from "@/components/home/PersonalizedGreeting";
import { QuickActions } from "@/components/home/QuickActions";
import { WarmMessage } from "@/components/home/WarmMessage";
import { SignInPrompt } from "@/components/home/SignInPrompt";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user, isAuthenticated } = useAuth();

  // Get the user's display name when authenticated
  const userName = user?.display_name;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-4xl mx-auto space-y-12 md:space-y-16">
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
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
