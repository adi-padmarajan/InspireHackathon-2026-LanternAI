/**
 * API client with authentication support
 */

const API_BASE_URL = "http://localhost:8000";
const TOKEN_KEY = "lantern_auth_token";

interface FetchOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  requireAuth?: boolean;
}

export interface UserPreferences {
  vibe: "jokester" | "cozy" | "balanced" | null;
  coping_style: "talking" | "planning" | "grounding" | null;
  routines: string[];
  last_helpful_routine_id: string | null;
  last_helpful_playbook_id: string | null;
  last_feedback_rating: number | null;
  last_check_in_at: string | null;
}

export interface UserMemory {
  last_goal: string | null;
  last_checkin: string | null;
  playbook_state: Record<string, unknown> | null;
}

export interface UserProfile {
  preferences: UserPreferences | null;
  memory: UserMemory | null;
}

export interface PersonalizationContext {
  coping_style: "talking" | "planning" | "grounding" | null;
  suggested_routine_id: string | null;
  repeat_suggestion: string | null;
}

export interface SeasonalSuggestion {
  id: string;
  text: string;
}

export interface SeasonalContext {
  tone: "cozy" | "bright" | "neutral";
  seasonal_tone: "cozy" | "bright" | "neutral";
  is_rainy: boolean;
  is_clear: boolean;
  temperature_c: number | null;
  suggestions: SeasonalSuggestion[];
  sunset_alert: boolean;
  minutes_to_sunset: number | null;
  tags: string[];
  routine_tags: string[];
  personalized_suggestions?: SeasonalSuggestion[];
}

export interface FeedbackRequest {
  rating: number;
  note?: string;
  routine_id?: string;
  playbook_id?: string;
  action_id?: string;
  context?: {
    playbook_id?: string;
    stage?: string;
    session_id?: string;
  };
}

export interface EventRequest {
  event_type:
    | "playbook_started"
    | "resource_clicked"
    | "script_used"
    | "routine_used"
    | "routine_repeated";
  payload?: {
    playbook_id?: string;
    resource_id?: string;
    resource_type?: string;
    script_scenario?: string;
    routine_id?: string;
    completed?: boolean;
    extra?: Record<string, unknown>;
  };
}

export interface ActionScriptContext {
  course?: string;
  deadline?: string;
  name?: string;
  topic?: string;
}

export interface ActionScriptResult {
  title: string;
  script: string;
  checklist: string[];
  suggested_next_steps: string[];
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
        data: {
          suggestions: string[];
          follow_up_question: string;
          resources?: Array<{
            id: string;
            name: string;
            description: string;
            categories: string[];
            url: string;
            location?: string | null;
          }>;
        };
      }>("/api/wellness/suggestions", {
        method: "POST",
        body: payload,
        requireAuth: false,
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
        requireAuth: false,
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
        requireAuth: false,
      }),
  },

  // Personalization/profile endpoints
  preferences: {
    get: () =>
      apiFetch<{
        success: boolean;
        data: UserPreferences | null;
      }>("/api/preferences"),
    update: (payload: Partial<UserPreferences>) =>
      apiFetch<{
        success: boolean;
        data: UserPreferences | null;
      }>("/api/preferences", {
        method: "POST",
        body: payload,
      }),
    clear: () =>
      apiFetch<{ success: boolean }>("/api/profile", {
        method: "DELETE",
      }),
    personalization: (playbookId: string) =>
      apiFetch<{
        success: boolean;
        data: PersonalizationContext | null;
      }>(`/api/profile/personalization?playbook_id=${encodeURIComponent(playbookId)}`),
  },

  seasonal: {
    context: (payload: {
      weather?: {
        description?: string;
        temperature?: number;
        condition?: string;
      } | null;
      location?: string;
      lat?: number;
      lon?: number;
      coping_style?: string | null;
    }) =>
      apiFetch<{
        success: boolean;
        data: SeasonalContext;
      }>("/api/context/seasonal", {
        method: "POST",
        body: payload,
        requireAuth: false,
      }),
    live: () =>
      apiFetch<{
        success: boolean;
        data: SeasonalContext;
      }>("/api/context/seasonal/live", {
        requireAuth: false,
      }),
  },

  actions: {
    script: (payload: {
      scenario: "extension_request" | "text_friend" | "self_advocacy";
      tone?: "gentle" | "direct" | "warm";
      context?: ActionScriptContext;
    }) =>
      apiFetch<{
        success: boolean;
        data: ActionScriptResult;
      }>("/api/actions/script", {
        method: "POST",
        body: payload,
        requireAuth: false,
      }),
    scenarios: () =>
      apiFetch<{
        success: boolean;
        data: { scenarios: string[]; tones: string[] };
      }>("/api/actions/scenarios", {
        requireAuth: false,
      }),
  },

  feedback: {
    submit: (payload: FeedbackRequest) =>
      apiFetch<{ success: boolean; data?: { submitted: boolean; id?: string } }>(
        "/api/feedback",
        {
          method: "POST",
          body: payload,
        }
      ),
    history: (limit = 10) =>
      apiFetch<{ success: boolean; data?: { history: unknown[] } }>(
        `/api/feedback/history?limit=${limit}`
      ),
  },

  events: {
    log: (payload: EventRequest) =>
      apiFetch<{ success: boolean; data?: { logged: boolean } }>("/api/events", {
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
