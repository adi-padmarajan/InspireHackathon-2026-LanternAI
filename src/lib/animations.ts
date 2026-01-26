/**
 * Framer Motion Animation Utilities
 * Award-winning animation presets for a warm, companion-like experience
 */

import { Variants, Transition } from "framer-motion";

// ============================================
// SPRING PHYSICS PRESETS
// Organic, warm feeling animations
// ============================================

export const springPresets = {
  // Soft and gentle - for companion-like feel
  gentle: { type: "spring", stiffness: 100, damping: 15, mass: 1 } as Transition,

  // Bouncy but controlled - for interactive elements
  bouncy: { type: "spring", stiffness: 300, damping: 20, mass: 0.8 } as Transition,

  // Quick and snappy - for UI feedback
  snappy: { type: "spring", stiffness: 400, damping: 25, mass: 0.5 } as Transition,

  // Slow and dreamy - for ambient elements
  dreamy: { type: "spring", stiffness: 50, damping: 10, mass: 1.5 } as Transition,

  // Natural breathing - for pulsing elements
  breathing: { type: "spring", stiffness: 80, damping: 12, mass: 1.2 } as Transition,
};

// ============================================
// PAGE TRANSITION VARIANTS
// Smooth route-based animations
// ============================================

export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.99,
    transition: {
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ============================================
// FADE VARIANTS
// Various fade-in effects
// ============================================

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" }
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const fadeInDown: Variants = {
  hidden: { opacity: 0, y: -30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const fadeInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const fadeInRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

// ============================================
// SCALE VARIANTS
// Pop and scale effects
// ============================================

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springPresets.bouncy,
  },
};

export const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.5 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: springPresets.bouncy,
  },
};

// ============================================
// STAGGER CONTAINER VARIANTS
// For orchestrated child animations
// ============================================

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
};

export const staggerContainerSlow: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// ============================================
// STAGGER CHILD VARIANTS
// For items within stagger containers
// ============================================

export const staggerChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }
  },
};

export const staggerChildScale: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: springPresets.gentle,
  },
};

// ============================================
// HOVER EFFECTS
// Interactive micro-interactions
// ============================================

export const hoverLift = {
  scale: 1.02,
  y: -4,
  transition: springPresets.snappy,
};

export const hoverGlow = {
  scale: 1.02,
  boxShadow: "0 0 40px hsl(38 95% 55% / 0.3)",
  transition: springPresets.snappy,
};

export const hoverScale = {
  scale: 1.05,
  transition: springPresets.snappy,
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

// ============================================
// CARD VARIANTS
// For interactive cards with 3D effects
// ============================================

export const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
    rotateX: -10,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: springPresets.gentle,
  },
};

export const cardHover3D: Variants = {
  rest: {
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  },
  hover: {
    rotateX: -2,
    rotateY: 2,
    scale: 1.02,
    transition: springPresets.snappy,
  },
};

// ============================================
// CHAT MESSAGE VARIANTS
// Specialized for chat bubbles
// ============================================

export const messageVariants = {
  user: {
    hidden: { opacity: 0, x: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: springPresets.gentle,
    },
  },
  assistant: {
    hidden: { opacity: 0, x: -30, scale: 0.9 },
    visible: {
      opacity: 1,
      x: 0,
      scale: 1,
      transition: springPresets.gentle,
    },
  },
};

// ============================================
// BREATHING / PULSE ANIMATIONS
// Companion-like living presence
// ============================================

export const breathingAnimation = {
  scale: [1, 1.02, 1],
  opacity: [0.8, 1, 0.8],
  transition: {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const glowPulse = {
  boxShadow: [
    "0 0 30px hsl(38 95% 55% / 0.2)",
    "0 0 60px hsl(38 95% 55% / 0.4)",
    "0 0 30px hsl(38 95% 55% / 0.2)",
  ],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// ============================================
// FLOATING ANIMATIONS
// Organic floating/bobbing
// ============================================

export const floatingAnimation = {
  y: [0, -10, 0],
  transition: {
    duration: 6,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

export const floatingRotate = {
  y: [0, -8, 0],
  rotate: [-1, 1, -1],
  transition: {
    duration: 5,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// ============================================
// FLAME FLICKER ANIMATION
// For lantern effect
// ============================================

export const flameFlicker = {
  scale: [1, 1.05, 0.98, 1.02, 1],
  opacity: [1, 0.9, 1, 0.95, 1],
  rotate: [-1, 1, -0.5, 0.5, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut" as const,
  },
};

// ============================================
// TYPING INDICATOR DOTS
// Organic bouncing dots
// ============================================

export const typingDot = (delay: number) => ({
  y: [0, -6, 0],
  opacity: [0.4, 1, 0.4],
  transition: {
    duration: 1.2,
    repeat: Infinity,
    ease: "easeInOut" as const,
    delay,
  },
});

// ============================================
// SCROLL-TRIGGERED VARIANTS
// For intersection observer based animations
// ============================================

export const scrollReveal: Variants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const scrollRevealLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

export const scrollRevealRight: Variants = {
  hidden: {
    opacity: 0,
    x: 60,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

// ============================================
// NAV LINK UNDERLINE
// Animated underline effect
// ============================================

export const navUnderline: Variants = {
  rest: { scaleX: 0, opacity: 0 },
  hover: {
    scaleX: 1,
    opacity: 1,
    transition: { duration: 0.3, ease: "easeOut" }
  },
};

// ============================================
// MOBILE MENU VARIANTS
// Slide and stagger for mobile nav
// ============================================

export const mobileMenuVariants: Variants = {
  closed: {
    opacity: 0,
    height: 0,
    transition: {
      duration: 0.3,
      when: "afterChildren",
    }
  },
  open: {
    opacity: 1,
    height: "auto",
    transition: {
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.05,
    }
  },
};

export const mobileMenuItemVariants: Variants = {
  closed: { opacity: 0, x: -20 },
  open: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 }
  },
};

// ============================================
// PARTICLE VARIANTS
// For ambient floating particles
// ============================================

export const particleFloat = (delay: number, duration: number) => ({
  y: [0, -100, 0],
  x: [0, Math.random() * 40 - 20, 0],
  opacity: [0, 0.6, 0],
  scale: [0.5, 1, 0.5],
  transition: {
    duration,
    repeat: Infinity,
    delay,
    ease: "easeInOut",
  },
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Creates a stagger delay for array items
 */
export const getStaggerDelay = (index: number, baseDelay = 0.05) => ({
  transition: { delay: index * baseDelay }
});

/**
 * Viewport settings for scroll-triggered animations
 */
export const viewportSettings = {
  once: true,
  amount: 0.2,
  margin: "-50px",
};

/**
 * Reduced motion check
 */
export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

/**
 * Get animation props with reduced motion fallback
 */
export const getAnimationProps = (variants: Variants) => {
  if (shouldReduceMotion()) {
    return {
      initial: "visible",
      animate: "visible",
    };
  }
  return {
    initial: "hidden",
    animate: "visible",
    variants,
  };
};
