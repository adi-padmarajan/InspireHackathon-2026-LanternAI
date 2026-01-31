import { motion } from "framer-motion";
import { Lamp, Heart } from "lucide-react";

export const Footer = () => {
  return (
    <motion.footer
      className="relative border-t border-border/20 bg-transparent flex-shrink-0"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      {/* Subtle gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />
      
      <div className="container mx-auto px-4 py-6 md:py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Branding */}
          <motion.div 
            className="flex items-center gap-3"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-2 rounded-full bg-accent/40">
              <Lamp className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif text-lg font-semibold text-foreground tracking-tight">
              Lantern
            </span>
          </motion.div>

          {/* Attribution */}
          <p className="text-sm text-muted-foreground/50 flex items-center gap-2">
            <span>Crafted with</span>
            <Heart className="h-3.5 w-3.5 text-destructive/60" />
            <span>by UVic students</span>
            <span className="mx-1 text-muted-foreground/30">·</span>
            <span className="font-mono text-xs">© 2026</span>
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
