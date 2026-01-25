import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { LoginButton } from "@/components/auth";

export const SignInPrompt = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <div className="relative flex flex-col items-center">
        {/* Ambient glow */}
        <motion.div 
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.2)] via-[hsl(var(--lantern-glow-soft)/0.1)] to-transparent rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.6, 0.8, 0.6]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* Lantern icon with interactive effects */}
        <motion.div 
          className="relative mb-8 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {/* Outer glow ring */}
          <motion.div 
            className="absolute inset-0 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.4)] to-[hsl(var(--lantern-glow-soft)/0.2)] rounded-full blur-2xl scale-150"
            animate={{ 
              scale: [1.5, 1.7, 1.5],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{ 
              duration: 3, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          />
          
          {/* Inner glow pulse */}
          <motion.div 
            className="absolute inset-0 bg-[hsl(var(--lantern-glow)/0.3)] rounded-full blur-xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          
          <motion.div 
            className="relative bg-gradient-to-br from-accent to-accent/80 p-8 rounded-full lantern-glow"
            animate={{ 
              boxShadow: [
                "0 0 60px hsl(38 95% 55% / 0.4), 0 0 120px hsl(38 95% 55% / 0.2)",
                "0 0 80px hsl(38 95% 55% / 0.5), 0 0 160px hsl(38 95% 55% / 0.3)",
                "0 0 60px hsl(38 95% 55% / 0.4), 0 0 120px hsl(38 95% 55% / 0.2)"
              ]
            }}
            transition={{ 
              duration: 2.5, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <motion.div
              animate={{ 
                y: [0, -6, 0],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
            >
              <Lamp className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Welcome emoji */}
        <motion.div 
          className="text-4xl mb-4"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5, type: "spring" }}
        >
          👋
        </motion.div>

        {/* Main heading */}
        <motion.h1 
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-center mb-3"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Sign in to get started
        </motion.h1>

        {/* Sub message */}
        <motion.p 
          className="text-xl md:text-2xl text-muted-foreground text-center max-w-lg mb-8"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          Your personal companion is waiting to meet you
        </motion.p>

        {/* Login button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <LoginButton variant="lantern" onSuccess={() => navigate("/")} />
        </motion.div>
      </div>
    </motion.div>
  );
};
