import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { HeroSection } from "@/components/HeroSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { PersonasSection } from "@/components/PersonasSection";
import { CTASection } from "@/components/CTASection";
import { Card, CardContent } from "@/components/ui/card";
import { LanternLogo } from "@/components/LanternLogo";
import { useTheme } from "@/contexts/ThemeContext";
import {
  Heart,
  Users,
  Lightbulb,
  Shield,
  Target,
  Sparkles
} from "lucide-react";
import {
  springPresets,
  staggerContainer,
  staggerChild,
  scrollReveal,
  cardHover3D,
} from "@/lib/animations";
import { cn } from "@/lib/utils";

const values = [
  {
    icon: Heart,
    title: "Empathy First",
    description: "We design for vulnerability. Every interaction considers the emotional state of the user.",
  },
  {
    icon: Shield,
    title: "Judgment-Free",
    description: "There's no 'wrong' question. We meet students exactly where they are.",
  },
  {
    icon: Users,
    title: "Inclusive by Design",
    description: "Accessibility isn't an afterthought. International students aren't edge cases.",
  },
  {
    icon: Lightbulb,
    title: "Proactive Support",
    description: "We don't wait for crisis. Seasonal nudges and gentle check-ins prevent problems.",
  },
];

const whyLanternReasons = [
  { emoji: "🌧️", title: "Victoria's winters are dark", desc: "Students need light, literally and figuratively" },
  { emoji: "🔦", title: "A lantern guides you when you're lost", desc: "University can feel overwhelming—we help you find your way" },
  { emoji: "🔥", title: "It provides warmth and comfort", desc: "Fighting isolation with connection and understanding" },
  { emoji: "🎒", title: "You carry it with you", desc: "Always accessible, 24/7, wherever you are" },
  { emoji: "✨", title: "It illuminates paths others might not see", desc: "Helping you discover resources and opportunities" },
];

const pageVariants = {
  initial: { opacity: 0 },
  animate: {
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { opacity: 0, transition: { duration: 0.3 } }
};

const AboutPage = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });
  const { currentBackground } = useTheme();

  // Check if custom background (image or wallpaper) is active
  const hasCustomBackground = currentBackground?.enabled && (currentBackground?.image || currentBackground?.wallpaper);

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  return (
    <motion.div
      ref={containerRef}
      className={cn(
        "min-h-screen relative",
        hasCustomBackground ? "bg-transparent" : "bg-background"
      )}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      {/* Parallax background glow - hide when custom background is active */}
      {!hasCustomBackground && (
        <motion.div
          className="fixed inset-0 pointer-events-none overflow-hidden"
          style={{ y: backgroundY }}
        >
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-secondary/5 rounded-full blur-3xl" />
        </motion.div>
      )}

      <Navigation />

      {/* Hero Section from original home page */}
      <HeroSection />

      {/* Features Section from original home page */}
      <FeaturesSection />

      {/* Personas Section from original home page */}
      <PersonasSection />

      <main className="py-16 relative z-10">
        <div className="container mx-auto px-4">
          {/* About Lantern */}
          <motion.div
            className="text-center max-w-3xl mx-auto mb-16"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={springPresets.bouncy}
            >
              <LanternLogo size="lg" />
            </motion.div>
            <motion.h2
              className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...springPresets.gentle, delay: 0.2 }}
            >
              About <motion.span
                className="text-primary inline-block"
                animate={{
                  textShadow: [
                    "0 0 20px rgba(var(--primary), 0)",
                    "0 0 40px rgba(var(--primary), 0.3)",
                    "0 0 20px rgba(var(--primary), 0)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >Lantern</motion.span>
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              Like a lantern illuminating a dark path, we help students navigate the challenges
              of university life at the University of Victoria.
            </motion.p>
          </motion.div>

          {/* Why Lantern */}
          <motion.section
            className="max-w-4xl mx-auto mb-16"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div
              variants={cardHover3D}
              initial="rest"
              whileHover="hover"
              style={{ transformStyle: "preserve-3d" }}
            >
              <Card className="forest-card overflow-hidden">
                <motion.div
                  className="nature-gradient p-8 text-primary-foreground relative overflow-hidden"
                  whileHover={{ scale: 1.01 }}
                  transition={springPresets.snappy}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.8 }}
                  />
                  <h2 className="text-2xl font-serif font-bold mb-4 flex items-center gap-2 relative z-10">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <Sparkles className="h-6 w-6" />
                    </motion.div>
                    Why "Lantern"?
                  </h2>
                </motion.div>
                <CardContent className="p-8">
                  <motion.ul
                    className="space-y-4"
                    variants={staggerContainer}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {whyLanternReasons.map((reason, index) => (
                      <motion.li
                        key={index}
                        variants={staggerChild}
                        className="flex items-start gap-3"
                        whileHover={{ x: 8, transition: springPresets.snappy }}
                      >
                        <motion.span
                          className="text-2xl"
                          whileHover={{ scale: 1.3, rotate: 10 }}
                          transition={springPresets.bouncy}
                        >
                          {reason.emoji}
                        </motion.span>
                        <div>
                          <strong className="text-foreground">{reason.title}</strong>
                          <p className="text-muted-foreground">{reason.desc}</p>
                        </div>
                      </motion.li>
                    ))}
                  </motion.ul>
                </CardContent>
              </Card>
            </motion.div>
          </motion.section>

          {/* The Problem */}
          <motion.section
            className="max-w-4xl mx-auto mb-16"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2
              className="text-3xl font-serif font-bold text-foreground mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springPresets.gentle}
            >
              The Problems We <motion.span
                className="text-destructive inline-block"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >Address</motion.span>
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {[
                {
                  title: "Universal Challenges",
                  items: [
                    "Mental health struggles (stress, anxiety, depression)",
                    "Seasonal depression from dark, grey winters",
                    "Social isolation and difficulty making friends",
                    "Social anxiety about joining clubs",
                    "Accessibility barriers on hilly terrain",
                    "Navigating scattered campus resources"
                  ]
                },
                {
                  title: "International Student Challenges",
                  items: [
                    "Cultural adjustment and unfamiliar norms",
                    "Different academic expectations",
                    "Language barriers beyond vocabulary",
                    "Homesickness and distance from family",
                    "Visa and work permit concerns",
                    "Lack of local knowledge"
                  ]
                }
              ].map((card, cardIndex) => (
                <motion.div
                  key={card.title}
                  variants={staggerChild}
                  whileHover={{ y: -8, transition: springPresets.snappy }}
                >
                  <motion.div
                    variants={cardHover3D}
                    initial="rest"
                    whileHover="hover"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <Card className="forest-card h-full">
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-lg text-foreground mb-4">{card.title}</h3>
                        <ul className="space-y-2 text-muted-foreground">
                          {card.items.map((item, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              whileInView={{ opacity: 1, x: 0 }}
                              viewport={{ once: true }}
                              transition={{ delay: cardIndex * 0.1 + index * 0.05 }}
                              whileHover={{ x: 4, color: "var(--foreground)" }}
                            >
                              • {item}
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Our Values */}
          <motion.section
            className="max-w-4xl mx-auto mb-16"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.h2
              className="text-3xl font-serif font-bold text-foreground mb-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={springPresets.gentle}
            >
              Our <motion.span
                className="text-primary inline-block"
                animate={{
                  textShadow: [
                    "0 0 10px rgba(var(--primary), 0)",
                    "0 0 30px rgba(var(--primary), 0.4)",
                    "0 0 10px rgba(var(--primary), 0)"
                  ]
                }}
                transition={{ duration: 2.5, repeat: Infinity }}
              >Values</motion.span>
            </motion.h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  variants={staggerChild}
                  whileHover={{ y: -8, transition: springPresets.snappy }}
                >
                  <motion.div
                    variants={cardHover3D}
                    initial="rest"
                    whileHover="hover"
                    style={{ transformStyle: "preserve-3d", perspective: 1000 }}
                  >
                    <Card className="forest-card h-full group">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3 mb-3">
                          <motion.div
                            className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center"
                            whileHover={{
                              rotate: 360,
                              scale: 1.1,
                              backgroundColor: "rgba(var(--primary), 0.2)"
                            }}
                            transition={{ duration: 0.5 }}
                          >
                            <value.icon className="h-5 w-5 text-primary" />
                          </motion.div>
                          <h3 className="font-semibold text-foreground">{value.title}</h3>
                        </div>
                        <p className="text-muted-foreground">{value.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.section>

          {/* Mission */}
          <motion.section
            className="max-w-3xl mx-auto text-center"
            variants={scrollReveal}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <motion.div
              className="flex justify-center mb-6"
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={springPresets.bouncy}
            >
              <motion.div
                className="h-16 w-16 rounded-full bg-secondary/10 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(var(--secondary), 0.1)",
                    "0 0 40px rgba(var(--secondary), 0.3)",
                    "0 0 20px rgba(var(--secondary), 0.1)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  animate={{
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ duration: 4, repeat: Infinity }}
                >
                  <Target className="h-8 w-8 text-secondary" />
                </motion.div>
              </motion.div>
            </motion.div>
            <motion.h2
              className="text-3xl font-serif font-bold text-foreground mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              Our Mission
            </motion.h2>
            <motion.p
              className="text-xl text-muted-foreground mb-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              To ensure no UVic student feels alone, lost, or unsupported—providing a unified,
              judgment-free companion that meets them exactly where they are.
            </motion.p>
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-accent-foreground text-sm"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ ...springPresets.bouncy, delay: 0.5 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <Heart className="h-4 w-4 text-primary" />
              </motion.div>
              <span>Built with love at INSPIRE Hackathon 2026</span>
            </motion.div>
          </motion.section>
        </div>
      </main>

      {/* CTA Section from original home page */}
      <CTASection />

      <Footer />
    </motion.div>
  );
};

export default AboutPage;
