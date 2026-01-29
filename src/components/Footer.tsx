import { motion } from "framer-motion";

export const Footer = () => {
  return (
    <motion.footer
      className="bg-card border-t border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-6">
        <motion.p
          className="text-sm text-foreground/80 text-center"
          initial={{ opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          © 2026 Lantern. Built for UVic Students by UVic Students who understand the daily challenges of student life. Here when you need a little light.
        </motion.p>
      </div>
    </motion.footer>
  );
};
