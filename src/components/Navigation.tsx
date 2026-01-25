import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanternLogo } from "./LanternLogo";
import { useAuth } from "@/contexts/AuthContext";
import { LoginButton, UserMenu } from "@/components/auth";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Chat", path: "/chat" },
  { name: "Resources", path: "/resources" },
  { name: "Wellness", path: "/wellness" },
  { name: "About", path: "/about" },
];

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-forest border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center">
            <LanternLogo size="sm" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>

            {/* Auth-aware buttons */}
            {isAuthenticated ? (
              <>
                <UserMenu />
                <Button variant="lantern" asChild>
                  <Link to="/chat">Start Chat</Link>
                </Button>
              </>
            ) : (
              <LoginButton
                variant="lantern"
                onSuccess={() => navigate("/")}
              />
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
            >
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`px-4 py-3 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              {/* Mobile auth section */}
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 border-t border-border mt-2">
                    <UserMenu />
                  </div>
                  <Button variant="lantern" className="mt-2" asChild>
                    <Link to="/chat" onClick={() => setIsOpen(false)}>
                      Start Chat
                    </Link>
                  </Button>
                </>
              ) : (
                <div className="mt-2">
                  <LoginButton
                    variant="lantern"
                    className="w-full"
                    onSuccess={() => {
                      setIsOpen(false);
                      navigate("/");
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
