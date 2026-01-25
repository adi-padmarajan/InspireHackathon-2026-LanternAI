/**
 * API client with authentication support
 */

const API_BASE_URL = "http://localhost:8000";
const TOKEN_KEY = "lantern_auth_token";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

/**
 * Get the stored auth token
 */
export function getAuthToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Set the auth token
 */
export function setAuthToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

/**
 * Remove the auth token
 */
export function removeAuthToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

/**
 * Make an authenticated API request
 */
export async function apiFetch<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { body, requireAuth = true, ...fetchOptions } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(fetchOptions.headers || {}),
  };

  // Add auth header if token exists and auth is required
  if (requireAuth) {
    const token = getAuthToken();
    if (token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...fetchOptions,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // Handle 401 - token expired or invalid
  if (response.status === 401) {
    removeAuthToken();
    localStorage.removeItem("lantern_user");
    // Don't redirect here - let the AuthContext handle it
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `API Error: ${response.statusText}`);
  }

  return response.json();
}

/**
 * API endpoints
 */
export const api = {
  // Auth endpoints
  auth: {
    login: (netlinkId: string) =>
      apiFetch<{
        access_token: string;
        token_type: string;
        user: { id: string; netlink_id: string; display_name?: string };
      }>("/api/auth/login", {
        method: "POST",
        body: { netlink_id: netlinkId },
        requireAuth: false,
      }),

    me: () =>
      apiFetch<{
        success: boolean;
        data: { id: string; netlink_id: string; display_name?: string };
      }>("/api/auth/me"),

    logout: () =>
      apiFetch<{ success: boolean; message: string }>("/api/auth/logout", {
        method: "POST",
      }),
  },

  // Chat endpoints
  chat: {
    send: (message: string, mode: string) =>
      apiFetch<{ data: { message: string } }>("/api/chat", {
        method: "POST",
        body: { message, mode },
        requireAuth: false, // Chat can work without auth
      }),
  },

  // Wellness endpoints (require auth)
  wellness: {
    createMoodEntry: (mood: string, note?: string) =>
      apiFetch<{ success: boolean; data: unknown }>("/api/wellness/mood", {
        method: "POST",
        body: { mood, note },
      }),

    getMoodHistory: (limit = 30) =>
      apiFetch<{ success: boolean; data: unknown[] }>(
        `/api/wellness/mood?limit=${limit}`
      ),

    getMoodStats: () =>
      apiFetch<{ success: boolean; data: Record<string, number> }>(
        "/api/wellness/stats"
      ),
  },
};
