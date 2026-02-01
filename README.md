# 🏮 Lantern

**Lantern is a warm, proactive AI wellness companion built for UVic students.**

A cinematic, calm web app that combines a best-friend style chat experience with structured wellness support. Features validation-first conversations, personalized playbooks for common student struggles, and deep customization options.

---

## 🏆 Hackathon Result

**Secured 2nd place at Inspire Hackathon 2026.**

---

## 📸 Screenshots

![Lantern UI 1](Lantern1.png)
![Lantern UI 2](Lantern2.png)

---

## ✨ Features

### 💬 Chat Companion
- **Personalized Onboarding** — "Meet-cute" style intro that learns your name, preferred vibe (jokester/cozy/balanced), and conversational style
- **Structured Playbooks** — Pre-built flows for common feelings: overwhelmed, anxious, lonely, burnout
- **Crisis Detection** — Automatic detection of crisis language with immediate connection to BC Crisis Line and UVic resources
- **Session Memory** — Remembers conversation context, recent topics, and goals within a session
- **Multiple Chat Modes** — Default, wellness, mental health, seasonal, and resource-focused modes

### 🧘 Wellness Studio
- **Mood Tracking** — Log daily moods (great/good/okay/low/struggling) with optional notes
- **AI Suggestions** — Get personalized wellness tips based on mood and Victoria weather
- **Dynamic Checklists** — AI-generated actionable checklists based on your current state
- **Mood History & Stats** — Track patterns over time

### 🎨 Customization
- **Theme System** — Multiple built-in themes with light/dark mode support
- **Unsplash Backgrounds** — Search and set high-quality wallpapers from Unsplash
- **Custom Uploads** — Upload your own background images (stored in Supabase)
- **Built-in Wallpapers** — Curated nature, campus, and seasonal backgrounds
- **Animation Controls** — Adjust ambient animation intensity

### 🌦️ Weather Integration
- **Live Victoria Weather** — Real-time weather data for Victoria, BC via Open-Meteo API
- **Seasonal Context** — Weather-aware suggestions (indoor vs outdoor activities)
- **Sunset Alerts** — Notifications about golden hour and sunset times
- **Adaptive UI** — Greetings and suggestions adapt to current conditions

### 📚 UVic Resources
- **Curated Resource Database** — 20+ UVic student support services
- **Smart Search** — Fuzzy search across resources by name, category, and description
- **Contextual Suggestions** — Resources recommended based on conversation topics
- **Quick Access Panel** — Always-visible trusted resources sidebar

### 🎬 Action Scripts
- **Extension Request Scripts** — Pre-written templates for asking professors for extensions
- **Self-Advocacy Scripts** — Templates for difficult conversations
- **Text-a-Friend Scripts** — Help reaching out when you're struggling
- **Customizable Tone** — Gentle, direct, or warm variations

---

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** (Vite)
- **Tailwind CSS** + **shadcn/ui** (Radix primitives)
- **Framer Motion** — Animations and transitions
- **TanStack Query** — Data fetching and caching
- **React Router v6** — Client-side routing
- **Zustand** — State management for background/color settings

### Backend
- **FastAPI** (Python 3.11+)
- **Google Gemini AI** — Conversational responses and suggestions
- **Supabase** — PostgreSQL database, authentication, and file storage
- **Unsplash API** — Background image search
- **Open-Meteo API** — Weather data (no API key required)

---

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** (or Bun)
- **Python 3.11+**
- **Supabase account** (for database and storage)

### Frontend Setup
```bash
# Install dependencies
bun install
# or
npm install

# Start development server
bun run dev
# or
npm run dev
```
Frontend runs at `http://localhost:8080`

### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start server
uvicorn app.main:app --reload --port 8000
```
Backend runs at `http://localhost:8000`

---

## ⚙️ Environment Variables

Create `backend/.env`:

```env
# Debug mode
DEBUG=false

# CORS (frontend URLs)
CORS_ORIGINS=["http://localhost:8080","http://localhost:5173"]

# Supabase (required for persistence)
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI / Gemini (required for chat)
GOOGLE_AI_API_KEY=your_gemini_api_key

# Unsplash (optional, for background search)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# JWT (auto-generated if not set)
JWT_SECRET_KEY=your_secret_key
```

---

## 🗄️ Database Setup

Run these SQL scripts in your Supabase SQL Editor:

1. **Core tables** — `backend/supabase_schema.sql`
   - `users` — User accounts (NetLink ID auth)
   - `mood_entries` — Mood tracking data
   - `chat_history` — Conversation logs

2. **Personalization tables** — `backend/migrations/003_personalization_tables.sql`
   - `user_preferences` — Vibe, coping style, routines
   - `user_memory` — Goals, last check-in, playbook state
   - `user_feedback` — Ratings and feedback
   - `app_events` — Analytics events

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/login` — Login with NetLink ID
- `POST /api/auth/logout` — Logout current user
- `GET /api/auth/me` — Get current user info

### Chat
- `POST /api/chat` — Send message, get AI response
- `GET /api/chat/exercise/{type}` — Get wellness exercise guide
- `DELETE /api/chat/session/{id}` — Clear session history

### Playbooks
- `POST /api/playbooks/run` — Run structured conversation flow

### Wellness
- `POST /api/wellness/mood` — Log mood entry
- `GET /api/wellness/mood` — Get mood history
- `GET /api/wellness/stats` — Get mood statistics
- `POST /api/wellness/suggestions` — Get AI suggestions
- `POST /api/wellness/checklist` — Generate checklist
- `POST /api/wellness/checkin` — Get check-in message

### Resources
- `GET /api/resources/search?q=` — Search UVic resources

### Images
- `GET /api/images/unsplash/search` — Search Unsplash photos
- `GET /api/images/unsplash/random` — Get random photos
- `POST /api/images/upload` — Upload custom image
- `GET /api/images/wallpapers` — Get built-in wallpapers

### Profile & Personalization
- `GET /api/preferences` — Get user preferences
- `POST /api/preferences` — Update preferences
- `GET /api/memory` — Get user memory
- `POST /api/memory` — Update memory
- `GET /api/profile` — Get full profile
- `GET /api/personalization/{playbook_id}` — Get personalized context

### Seasonal
- `POST /api/seasonal/context` — Get weather-aware suggestions

### Actions
- `POST /api/actions/script` — Generate action script
- `GET /api/actions/scenarios` — Get available scenarios

### Feedback
- `POST /api/feedback` — Submit feedback
- `POST /api/events` — Log app event

---

## 🧪 Testing

```bash
# Frontend tests
npm run test

# Backend tests
cd backend
python -m pytest
```

---

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Home page with cinematic hero and quick action chips |
| `/chat` | Main chat interface with playbook support (protected) |
| `/wellness` | Mood tracking and AI suggestions (protected) |
| `/settings` | Theme, background, and customization options (protected) |

---

## 🎯 Playbooks

Structured conversation flows for common student challenges:

| Playbook | Triggers | Flow |
|----------|----------|------|
| **Overwhelmed** | "stressed", "too much", "deadline", "exam" | Validate → Triage (academics/personal) → Mini plan |
| **Anxious** | "anxious", "worried", "nervous", "panic" | Validate → Identify source → Grounding + plan |
| **Lonely** | "lonely", "isolated", "no friends" | Validate → Connection check → Social suggestions |
| **Burnout** | "burned out", "exhausted", "can't anymore" | Validate → Energy audit → Recovery steps |
| **Crisis** | Suicidal ideation keywords | Immediate crisis resources + BC Crisis Line |

---

## 🏫 UVic Resources

Built-in resource database includes:
- UVic Counselling Services
- Here2Talk (24/7)
- Student Wellness Centre
- Peer Support Network
- Indigenous Student Support
- Multi-faith Services
- Academic Advising
- Writing Centre
- Learning Strategies
- BC Crisis Line

---

## 📄 License

This project was built for Inspire Hackathon 2026.

---

## Developers 

- **Aditya Padmarajan** — CS @ UVic
- **Anitta Varghese** — BSeng @ UVic

---
