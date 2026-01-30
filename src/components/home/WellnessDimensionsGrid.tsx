/**
 * WellnessDimensionsGrid - Cinematic Wellness Cards
 * Apple-level UX with smooth animations and visual hierarchy
 */

import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sun } from "lucide-react";
import { cn } from "@/lib/utils";
import { allDimensions, seasonalSupport } from "@/lib/wellnessDimensions";

// Staggered animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
    },
  },
};

export const WellnessDimensionsGrid = () => {
  return (
    <motion.section
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Section header */}
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-3">
          Six Dimensions of Wellness
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Holistic support for every aspect of your wellbeing
        </p>
      </motion.div>

      {/* Dimensions grid - 2x3 on desktop, 1 col on mobile */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5 mb-6">
        {allDimensions.map((dimension, index) => (
          <motion.div key={dimension.id} variants={cardVariants}>
            <Link
              to={`/chat?mode=${dimension.id}`}
              className="block h-full group"
            >
              <motion.div
                className={cn(
                  "relative h-full p-5 md:p-6 rounded-2xl",
                  "bg-card/60 backdrop-blur-sm",
                  "border border-border/40",
                  "transition-all duration-400",
                  "group-hover:border-border/80",
                  "group-hover:bg-card/80",
                  "overflow-hidden"
                )}
                whileHover={{
                  y: -6,
                  transition: { type: "spring", stiffness: 300, damping: 25 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Subtle gradient overlay on hover */}
                <motion.div
                  className={cn(
                    "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500",
                    `bg-gradient-to-br ${dimension.gradient}`
                  )}
                />

                {/* Icon */}
                <div className="relative mb-4">
                  <motion.div
                    className={cn(
                      "w-11 h-11 rounded-xl flex items-center justify-center",
                      "bg-muted/50 group-hover:bg-background/80",
                      "transition-colors duration-300"
                    )}
                    whileHover={{ scale: 1.05, rotate: 3 }}
                  >
                    <dimension.icon className={cn("h-5 w-5", dimension.color)} />
                  </motion.div>
                </div>

                {/* Content */}
                <div className="relative">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {dimension.label}
                    </h3>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      initial={{ x: -4 }}
                      animate={{ x: 0 }}
                    >
                      <ArrowRight className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                  </div>
                  <p className="text-xs font-medium text-primary/80 mb-2">
                    {dimension.tagline}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {dimension.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Seasonal Support - Featured card */}
      <motion.div variants={cardVariants}>
        <Link to="/chat?mode=seasonal" className="block group">
          <motion.div
            className={cn(
              "relative p-6 md:p-8 rounded-2xl",
              "bg-gradient-to-r from-orange-500/10 via-amber-500/10 to-yellow-500/10",
              "border border-orange-500/20",
              "transition-all duration-400",
              "group-hover:border-orange-500/40",
              "overflow-hidden"
            )}
            whileHover={{
              y: -4,
              transition: { type: "spring", stiffness: 300, damping: 25 },
            }}
            whileTap={{ scale: 0.99 }}
          >
            {/* Animated sun rays effect */}
            <motion.div
              className="absolute -right-12 -top-12 w-48 h-48 bg-gradient-radial from-orange-400/20 to-transparent rounded-full blur-2xl"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3],
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="relative flex flex-col md:flex-row md:items-center gap-5">
              {/* Icon section */}
              <motion.div
                className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0",
                  "bg-gradient-to-br from-orange-500/20 to-amber-500/20",
                  "border border-orange-500/30"
                )}
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(251, 146, 60, 0.2)",
                    "0 0 40px rgba(251, 146, 60, 0.3)",
                    "0 0 20px rgba(251, 146, 60, 0.2)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Sun className="h-7 w-7 text-orange-500" />
              </motion.div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xl font-semibold text-foreground">
                    {seasonalSupport.label}
                  </h3>
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-orange-500/20 text-orange-600 dark:text-orange-400">
                    Victoria, BC
                  </span>
                  <motion.div
                    className="opacity-0 group-hover:opacity-100 transition-opacity ml-auto"
                    initial={{ x: -4 }}
                    animate={{ x: 0 }}
                  >
                    <ArrowRight className="h-5 w-5 text-orange-500" />
                  </motion.div>
                </div>
                <p className="text-muted-foreground">
                  {seasonalSupport.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {seasonalSupport.examples.map((example) => (
                    <span
                      key={example}
                      className="px-2 py-1 text-xs rounded-md bg-background/50 text-muted-foreground"
                    >
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </motion.section>
  );
};
