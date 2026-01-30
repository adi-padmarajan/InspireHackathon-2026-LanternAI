import { motion } from "framer-motion";
import { Lamp, Heart } from "lucide-react";
import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <motion.footer
      className="relative border-t border-border/30 bg-background/80 backdrop-blur-md"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-6">
          {/* Branding */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 rounded-full bg-accent/50 border border-border/50">
              <Lamp className="h-5 w-5 text-primary" />
            </div>
            <span className="font-serif text-xl font-semibold text-foreground">Lantern</span>
          </motion.div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center max-w-md leading-relaxed">
            Your AI companion for holistic wellness and mental health support
          </p>

          {/* Quick links */}
          <div className="flex items-center gap-6 text-sm">
            <Link 
              to="/chat" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Chat
            </Link>
            <Link 
              to="/wellness" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Wellness
            </Link>
            <Link 
              to="/settings" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Settings
            </Link>
          </div>

          {/* Divider */}
          <div className="w-16 h-px bg-border/50" />

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500/70" /> by UVic students
            <span className="mx-2">·</span>
            © 2026 Lantern
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
