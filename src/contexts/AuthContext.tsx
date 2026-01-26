import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { api, setAuthToken, removeAuthToken, getAuthToken } from "@/lib/api";

interface User {
  id: string;
  netlink_id: string;
  display_name?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (netlinkId: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USER_KEY = "lantern_user";
const LOGGED_OUT_KEY = "lantern_logged_out";

// Default user - Adi is signed in by default
const DEFAULT_USER: User = {
  id: "default-adi-user",
  netlink_id: "adi",
  display_name: "Adi",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const clearAuth = useCallback(() => {
    removeAuthToken();
    localStorage.removeItem(USER_KEY);
    localStorage.setItem(LOGGED_OUT_KEY, "true");
    setUser(null);
  }, []);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = getAuthToken();
      const storedUser = localStorage.getItem(USER_KEY);
      const wasLoggedOut = localStorage.getItem(LOGGED_OUT_KEY);

      // If user has explicitly logged out, don't auto-login
      if (wasLoggedOut === "true") {
        setIsLoading(false);
        return;
      }

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Try to verify token with backend (optional - may fail if backend not running)
          try {
            const response = await api.auth.me();
            if (response.success && response.data) {
              setUser(response.data);
            }
          } catch {
            // Backend not available - keep using stored user (demo mode)
          }
        } catch {
          // Invalid stored data - use default user
          setUser(DEFAULT_USER);
          localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
        }
      } else {
        // No stored auth - set default user (Adi)
        setUser(DEFAULT_USER);
        localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = useCallback(async (netlinkId: string): Promise<boolean> => {
    try {
      // Try backend login first
      const response = await api.auth.login(netlinkId);

      // Store auth data
      setAuthToken(response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      localStorage.removeItem(LOGGED_OUT_KEY);
      setUser(response.user);

      return true;
    } catch {
      // Backend not available - use demo mode login
      const demoUser: User = {
        id: `demo-${netlinkId}-${Date.now()}`,
        netlink_id: netlinkId,
        display_name: netlinkId.charAt(0).toUpperCase() + netlinkId.slice(1),
      };

      // Store demo user
      setAuthToken(`demo-token-${netlinkId}`);
      localStorage.setItem(USER_KEY, JSON.stringify(demoUser));
      localStorage.removeItem(LOGGED_OUT_KEY);
      setUser(demoUser);

      return true;
    }
  }, []);

  const logout = useCallback(() => {
    // Call logout endpoint (fire and forget)
    api.auth.logout().catch(() => {});
    clearAuth();
  }, [clearAuth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
