/**
 * AnimatedLayout Component
 * Provides smooth page transitions with AnimatePresence
 */

import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { pageVariants, shouldReduceMotion } from "@/lib/animations";

interface AnimatedLayoutProps {
  children: ReactNode;
}

export const AnimatedLayout = ({ children }: AnimatedLayoutProps) => {
  const location = useLocation();
  const reduceMotion = shouldReduceMotion();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={reduceMotion ? "enter" : "initial"}
        animate="enter"
        exit={reduceMotion ? "enter" : "exit"}
        variants={pageVariants}
        className="min-h-screen"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

/**
 * AnimatedSection Component
 * For scroll-triggered section animations
 */
interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export const AnimatedSection = ({
  children,
  className = "",
  delay = 0
}: AnimatedSectionProps) => {
  const reduceMotion = shouldReduceMotion();

  return (
    <motion.section
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.section>
  );
};

/**
 * AnimatedElement Component
 * Generic wrapper for any element needing entrance animation
 */
interface AnimatedElementProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
}

export const AnimatedElement = ({
  children,
  className = "",
  delay = 0,
  direction = "up"
}: AnimatedElementProps) => {
  const reduceMotion = shouldReduceMotion();

  const getInitialPosition = () => {
    switch (direction) {
      case "up": return { opacity: 0, y: 30 };
      case "down": return { opacity: 0, y: -30 };
      case "left": return { opacity: 0, x: 30 };
      case "right": return { opacity: 0, x: -30 };
    }
  };

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : getInitialPosition()}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};
