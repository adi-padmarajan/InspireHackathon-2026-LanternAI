import { motion } from "framer-motion";
import { Lamp, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <motion.footer
      className="relative border-t border-border/30 bg-background/60 backdrop-blur-md flex-shrink-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle top gradient */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
      
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Branding */}
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-1.5 rounded-full bg-accent/50 border border-border/50">
              <Lamp className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif text-base font-semibold text-foreground">Lantern</span>
          </motion.div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/60 flex items-center gap-1">
            Made with <Heart className="h-3 w-3 text-rose-500/70" /> by UVic students
            <span className="mx-2">·</span>
            © 2026
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
