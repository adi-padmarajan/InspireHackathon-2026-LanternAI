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
 * Upload a file with authentication
 */
export async function uploadFile<T>(
  endpoint: string,
  file: File
): Promise<T> {
  const formData = new FormData();
  formData.append("file", file);

  const headers: HeadersInit = {};
  const token = getAuthToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (response.status === 401) {
    removeAuthToken();
    localStorage.removeItem("lantern_user");
    throw new Error("Unauthorized");
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || `Upload Error: ${response.statusText}`);
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

    getSuggestions: (payload: {
      mood: string;
      note?: string;
      weather?: {
        description?: string;
        temperature?: number;
        condition?: string;
        location?: string;
      };
    }) =>
      apiFetch<{
        success: boolean;
        data: { suggestions: string[]; follow_up_question: string };
      }>("/api/wellness/suggestions", {
        method: "POST",
        body: payload,
      }),

    createChecklist: (payload: {
      mood: string;
      note?: string;
      suggestions?: string[];
      weather?: {
        description?: string;
        temperature?: number;
        condition?: string;
        location?: string;
      };
      max_items?: number;
    }) =>
      apiFetch<{
        success: boolean;
        data: { title?: string; items: string[] };
      }>("/api/wellness/checklist", {
        method: "POST",
        body: payload,
      }),

    generateCheckIn: (payload: {
      mood: string;
      note?: string;
      weather?: {
        description?: string;
        temperature?: number;
        condition?: string;
        location?: string;
      };
      checklist_summary?: string;
    }) =>
      apiFetch<{
        success: boolean;
        data: { message: string };
      }>("/api/wellness/checkin", {
        method: "POST",
        body: payload,
      }),
  },

  // Image endpoints
  images: {
    searchUnsplash: (query: string, page = 1, perPage = 20) =>
      apiFetch<{
        total: number;
        total_pages: number;
        results: Array<{
          id: string;
          width: number;
          height: number;
          color: string;
          blur_hash: string;
          description: string | null;
          alt_description: string | null;
          urls: {
            raw: string;
            full: string;
            regular: string;
            small: string;
            thumb: string;
          };
          user: {
            id: string;
            username: string;
            name: string;
            links: { html: string };
          };
        }>;
      }>(`/api/images/unsplash/search?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`, {
        requireAuth: false,
      }),

    getRandomUnsplash: (query = "nature", count = 10) =>
      apiFetch<{
        success: boolean;
        data: Array<{
          id: string;
          source: string;
          url: string;
          thumbnail_url?: string;
          blur_hash?: string;
          attribution?: {
            photographer_name: string;
            photographer_username: string;
            photographer_url: string;
            unsplash_url: string;
          };
          width: number;
          height: number;
        }>;
      }>(`/api/images/unsplash/random?query=${encodeURIComponent(query)}&count=${count}`, {
        requireAuth: false,
      }),

    trackUnsplashDownload: (photoId: string) =>
      apiFetch<{ success: boolean }>(`/api/images/unsplash/track/${photoId}`, {
        method: "POST",
        requireAuth: false,
      }),

    getCurated: (category?: string) =>
      apiFetch<{
        success: boolean;
        data: Array<{
          id: string;
          source: string;
          url: string;
          thumbnail_url?: string;
          blur_hash?: string;
          attribution?: {
            photographer_name: string;
            photographer_username: string;
            photographer_url: string;
            unsplash_url: string;
          };
          width: number;
          height: number;
        }>;
      }>(`/api/images/curated${category ? `?category=${category}` : ""}`, {
        requireAuth: false,
      }),

    getCuratedCategories: () =>
      apiFetch<{
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          query: string;
          icon: string;
        }>;
      }>("/api/images/curated/categories", {
        requireAuth: false,
      }),

    getUserUploads: (limit = 20) =>
      apiFetch<{
        success: boolean;
        data: Array<{
          id: string;
          source: string;
          url: string;
          thumbnail_url?: string;
          width: number;
          height: number;
          uploaded_at?: string;
        }>;
      }>(`/api/images/user-uploads?limit=${limit}`),

    deleteUpload: (imageId: string) =>
      apiFetch<{ success: boolean }>(`/api/images/upload/${imageId}`, {
        method: "DELETE",
      }),

    saveSettings: (settings: unknown) =>
      apiFetch<{ success: boolean; message: string }>("/api/images/settings", {
        method: "POST",
        body: { settings },
      }),

    getSettings: () =>
      apiFetch<{
        success: boolean;
        data: {
          use_global_background: boolean;
          global_background: unknown;
          theme_backgrounds: Record<string, unknown>;
        } | null;
      }>("/api/images/settings"),
  },
};
