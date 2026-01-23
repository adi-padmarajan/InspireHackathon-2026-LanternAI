import { Link } from "react-router-dom";
import { LanternLogo } from "./LanternLogo";
import { Heart, ExternalLink } from "lucide-react";

const footerLinks = {
  product: [
    { name: "Features", path: "/about" },
    { name: "Chat", path: "/chat" },
    { name: "Resources", path: "/resources" },
    { name: "Wellness", path: "/wellness" },
  ],
  support: [
    { name: "Crisis Resources", path: "/resources#crisis" },
    { name: "Accessibility", path: "/resources#accessibility" },
    { name: "International Students", path: "/resources#international" },
    { name: "Mental Health", path: "/resources#mental-health" },
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
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <LanternLogo size="md" />
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              A guiding light through university life. Built with care for UVic students, 
              by people who understand the unique challenges of student life.
            </p>
            <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="h-4 w-4 text-destructive fill-destructive" />
              <span>for INSPIRE Hackathon 2026</span>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Product</h4>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Support</h4>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* UVic Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">UVic Resources</h4>
            <ul className="space-y-3">
              {footerLinks.uvic.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                  >
                    {link.name}
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Lantern. Built for University of Victoria students.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link to="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms
            </Link>
            <Link to="/accessibility-statement" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Accessibility
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
