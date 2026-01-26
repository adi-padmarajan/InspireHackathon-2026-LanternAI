import { useNavigate } from "react-router-dom";
import { Lamp } from "lucide-react";
import { motion } from "framer-motion";
import { LoginButton } from "@/components/auth";
import {
  staggerContainer,
  staggerChild,
  floatingAnimation,
  glowPulse,
  springPresets,
} from "@/lib/animations";
import { WarmGlow } from "@/components/AmbientBackground";

export const SignInPrompt = () => {
  const navigate = useNavigate();

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <div className="relative flex flex-col items-center">
        {/* Ambient glow - now animated with Framer Motion */}
        <motion.div
          className="absolute -top-20 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-[hsl(var(--lantern-glow)/0.2)] via-[hsl(var(--lantern-glow-soft)/0.1)] to-transparent rounded-full blur-3xl"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Lantern icon container */}
        <motion.div
          className="relative mb-8"
          variants={staggerChild}
        >
          {/* Glow behind lantern */}
          <WarmGlow intensity="strong" className="scale-150" />

          {/* Lantern container */}
          <motion.div
            className="relative bg-gradient-to-br from-accent to-accent/80 p-8 rounded-full"
            animate={glowPulse}
            whileHover={{ scale: 1.05 }}
            transition={springPresets.gentle}
          >
            <motion.div animate={floatingAnimation}>
              <Lamp className="h-16 w-16 md:h-20 md:w-20 text-primary" />
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Welcome emoji with bounce */}
        <motion.div
          className="text-4xl mb-4"
          variants={staggerChild}
          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
          transition={springPresets.bouncy}
        >
          👋
        </motion.div>

        {/* Main heading with stagger */}
        <motion.h1
          className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground text-center mb-3"
          variants={staggerChild}
        >
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, ...springPresets.gentle }}
          >
            Sign in
          </motion.span>{" "}
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, ...springPresets.gentle }}
          >
            to get started
          </motion.span>
        </motion.h1>

        {/* Sub message */}
        <motion.p
          className="text-xl md:text-2xl text-muted-foreground text-center max-w-lg mb-8"
          variants={staggerChild}
        >
          Your personal companion is waiting to meet you
        </motion.p>

        {/* Login button with entrance and hover */}
        <motion.div
          variants={staggerChild}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
        >
          <LoginButton variant="lantern" onSuccess={() => navigate("/")} />
        </motion.div>
      </div>
    </motion.div>
  );
};
