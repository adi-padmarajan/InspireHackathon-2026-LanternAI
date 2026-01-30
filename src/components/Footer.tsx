import { motion } from "framer-motion";
import { Lamp } from "lucide-react";

export const Footer = () => {
  return (
    <motion.footer
      className="border-t border-border/50 bg-background/50 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-4">
          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-full bg-accent/50">
              <Lamp className="h-4 w-4 text-primary" />
            </div>
            <span className="font-serif font-semibold text-foreground">Lantern</span>
          </div>

          {/* Tagline */}
          <p className="text-sm text-muted-foreground text-center max-w-md">
            AI Wellness Companion for UVic Students
          </p>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground/70">
            © 2026 Lantern · Built by UVic students, for UVic students
          </p>
        </div>
      </div>
    </motion.footer>
  );
};
