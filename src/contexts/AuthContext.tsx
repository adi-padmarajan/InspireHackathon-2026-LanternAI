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

// Default user - Adi is signed in by default
const DEFAULT_USER: User = {
  id: "default-adi-user",
  netlink_id: "adi",
  display_name: "Adi",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage or default to Adi
  useEffect(() => {
    const storedToken = getAuthToken();
    const storedUser = localStorage.getItem(USER_KEY);

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        // Verify token is still valid
        verifyToken();
      } catch {
        // Fall back to default user (Adi)
        setUser(DEFAULT_USER);
        localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
        setIsLoading(false);
      }
    } else {
      // No stored auth - set Adi as default signed-in user
      setUser(DEFAULT_USER);
      localStorage.setItem(USER_KEY, JSON.stringify(DEFAULT_USER));
      setIsLoading(false);
    }
  }, []);

  const verifyToken = async () => {
    try {
      const response = await api.auth.me();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
        clearAuth();
      }
    } catch {
      clearAuth();
    } finally {
      setIsLoading(false);
    }
  };

  const clearAuth = useCallback(() => {
    removeAuthToken();
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const login = useCallback(async (netlinkId: string): Promise<boolean> => {
    try {
      const response = await api.auth.login(netlinkId);

      // Store auth data
      setAuthToken(response.access_token);
      localStorage.setItem(USER_KEY, JSON.stringify(response.user));
      setUser(response.user);

      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
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
