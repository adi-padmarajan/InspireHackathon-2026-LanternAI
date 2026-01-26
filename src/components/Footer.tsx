import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { LanternLogo } from "./LanternLogo";
import { Heart, ExternalLink } from "lucide-react";
import { staggerContainer, staggerChild, springPresets, breathingAnimation } from "@/lib/animations";

const footerLinks = {
  product: [
    { name: "Features", path: "/about" },
    { name: "Chat", path: "/chat" },
    { name: "Wellness", path: "/wellness" },
  ],
  uvic: [
    { name: "UVic Homepage", href: "https://www.uvic.ca", external: true },
    { name: "Student Services", href: "https://www.uvic.ca/students", external: true },
    { name: "Health Services", href: "https://www.uvic.ca/services/health", external: true },
    { name: "Counselling", href: "https://www.uvic.ca/services/counselling", external: true },
  ],
};

export const Footer = () => {
  return (
    <motion.footer
      className="bg-card border-t border-border"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="container mx-auto px-4 py-16">
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {/* Brand */}
          <motion.div
            className="lg:col-span-1"
            variants={staggerChild}
          >
            <LanternLogo size="md" />
            <motion.p
              className="mt-4 text-sm text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              A guiding light through university life. Built with care for UVic students,
              by people who understand the unique challenges of student life.
            </motion.p>
            <motion.div
              className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <span>Made with</span>
              <motion.div animate={breathingAnimation}>
                <Heart className="h-4 w-4 text-destructive fill-destructive" />
              </motion.div>
              <span>for INSPIRE Hackathon 2026</span>
            </motion.div>
          </motion.div>

          {/* Product Links */}
          <motion.div variants={staggerChild}>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors relative group"
                  >
                    <motion.span
                      whileHover={{ x: 3 }}
                      transition={springPresets.snappy}
                    >
                      {link.name}
                    </motion.span>
                    {/* Animated underline */}
                    <motion.span
                      className="absolute -bottom-0.5 left-0 h-px bg-primary"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.2 }}
                    />
                  </Link>
                </motion.li>
              ))}
            </ul>
          </motion.div>

          {/* UVic Links */}
          <motion.div variants={staggerChild}>
            <h4 className="font-semibold text-foreground mb-4">UVic Resources</h4>
            <ul className="space-y-3">
              {footerLinks.uvic.map((link, index) => (
                <motion.li
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * index }}
                >
                  <motion.a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 group"
                    whileHover={{ x: 3 }}
                    transition={springPresets.snappy}
                  >
                    {link.name}
                    <motion.span
                      whileHover={{ rotate: 45, scale: 1.2 }}
                      transition={springPresets.bouncy}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </motion.span>
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div
          className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="text-sm text-muted-foreground">
            © 2026 Lantern. Built for University of Victoria students.
          </p>
          <div className="flex items-center gap-6">
            {["Privacy", "Terms", "Accessibility"].map((item, index) => (
              <motion.div
                key={item}
                whileHover={{ y: -2 }}
                transition={springPresets.snappy}
              >
                <Link
                  to={`/${item.toLowerCase()}${item === "Accessibility" ? "-statement" : ""}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {item}
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
};
