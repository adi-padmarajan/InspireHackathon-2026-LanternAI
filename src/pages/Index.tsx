import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { PersonalizedGreeting } from "@/components/home/PersonalizedGreeting";
import { QuickActions } from "@/components/home/QuickActions";
import { WarmMessage } from "@/components/home/WarmMessage";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  
  // Use the logged-in user's name, or default to "Adi" for demo
  const userName = user?.display_name || "Adi";

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20">
        <div className="w-full max-w-4xl mx-auto space-y-12 md:space-y-16">
          {/* Personalized Greeting */}
          <PersonalizedGreeting userName={userName} />
          
          {/* Warm intro message */}
          <WarmMessage />
          
          {/* Quick Actions */}
          <QuickActions />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
