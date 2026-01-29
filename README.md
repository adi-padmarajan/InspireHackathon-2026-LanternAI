# 🏮 Lantern

**Lantern is a warm, proactive AI companion for UVic students.**

It blends a cinematic, calm UI with a best‑friend style chat flow: a gentle meet‑cute onboarding, memory of small details, validation‑first support when things are hard, and thoughtful follow‑ups later.

---

## ✨ Experience Highlights

- **The Meet‑Cute (Onboarding as Greeting)**
  - “Hey! I'm Lantern. I've been looking forward to meeting you. What should I call you?”
  - Personality calibration (jokester vs warm‑tea energy)
  - A playful “secret handshake” question
- **Passive Presence**
  - Low‑stakes check‑ins based on recent context
  - Occasional reflective notes to keep it two‑sided
- **In‑the‑Trenches Flow**
  - Validation first, then collaboration: “Want to brainstorm or just sit with it?”
- **Memory Lane**
  - Remembers names, goals, and recent topics (client + session memory)
- **Wellness Studio**
  - Mood check‑ins, breathing exercise, gratitude jar, affirmations, relaxation sounds
- **Personalization**
  - Themes, ambient backgrounds, Unsplash wallpapers, and uploads
- **Weather‑aware touches**
  - Live Victoria weather used for subtle ambiance and greetings

---

## 🛠️ Tech Stack

**Frontend**
- React + TypeScript (Vite)
- Tailwind CSS + Radix UI (shadcn/ui)
- Framer Motion
- TanStack Query, React Router

**Backend**
- FastAPI (Python)
- Google Gemini 3 Flash (companion responses)
- Supabase (auth/data/storage)
- Unsplash API (backgrounds)
- Pydantic, JWT

---

## 📁 Project Structure

```
/ (repo root)
├── src/                      # Frontend app
│   ├── components/           # UI + feature components
│   ├── contexts/             # Auth/Theme/Weather providers
│   ├── hooks/                # Client hooks
│   ├── lib/                  # Utilities + API clients
│   └── pages/                # Routes
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── routers/           # API routes
│   │   ├── services/          # Chat, wellness, images
│   │   ├── models/            # Pydantic schemas
│   │   └── auth/              # JWT + auth helpers
├── data/                     # Static data (resources, prompts)
└── public/                   # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Bun or npm

### Install
```bash
# Frontend
bun install
# or
npm install

# Backend
cd backend
python -m venv env
source env/bin/activate  # Windows: env\Scripts\activate
pip install -r requirements.txt
```

### Environment Variables (backend/.env)
```env
# Core
DEBUG=false
CORS_ORIGINS=["http://localhost:5173"]

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI (Gemini)
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Unsplash
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# JWT
JWT_SECRET_KEY=your_secret_key
JWT_EXPIRE_MINUTES=1440
```

> You can run the frontend without Supabase/Unsplash, but image uploads and some settings will be limited. Chat will fall back to a safe response if the Gemini key isn’t set.

### Run
```bash
# Backend
cd backend
source env/bin/activate
uvicorn app.main:app --reload --port 8000

# Frontend (repo root)
bun dev
# or
npm run dev
```

---

## 📍 Routes

| Route | Access | Description |
|------|--------|-------------|
| `/` | Public | Cinematic home + quick actions |
| `/chat` | Protected | Companion chat flow |
| `/wellness` | Protected | Wellness studio |
| `/settings` | Protected | Personalization studio |

> Auth is demo‑friendly: if you’re not signed in, Lantern can still run locally with a fallback user.

---

## 📡 API Endpoints (Backend)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/login` | POST | NetLink ID login (demo) |
| `/api/auth/me` | GET | Current user |
| `/api/auth/logout` | POST | Logout |
| `/api/chat` | POST | Companion chat (profile + memory supported) |
| `/api/chat/exercise/{type}` | GET | Quick exercise (breathing/grounding/etc) |
| `/api/chat/session/{id}` | DELETE | Clear chat session |
| `/api/wellness/mood` | POST/GET | Mood entries |
| `/api/wellness/stats` | GET | Mood stats |
| `/api/images/unsplash/search` | GET | Unsplash search |
| `/api/images/upload` | POST | Upload background image |

---

## 🧪 Testing

```bash
bun test
# or
npm run test
```

---

## 🤝 Team

- Aditya Padmarajan
- Anitta Varghese

---

## 📄 License

Built for Inspire Hackathon 2026 and educational use.
