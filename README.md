# 🏮 Lantern

**An AI-Powered Wellness & Support Companion for University of Victoria (UVic) Students**

Lantern is a comprehensive mental health and campus support platform designed to help UVic students navigate university life with ease. It combines an intelligent AI chatbot with wellness tracking features, providing 24/7 support for stress management, campus navigation, mental health resources, and more.

![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?logo=fastapi)
![Supabase](https://img.shields.io/badge/Supabase-2.9-3FCF8E?logo=supabase)

---

## ✨ Features

### 🤖 AI Chat Companion
Lantern offers 8 specialized support modes, each tailored to different student needs:

| Mode | Description |
|------|-------------|
| **💚 Wellness Companion** | 24/7 support for stress, anxiety, and emotional wellbeing |
| **🗺️ Campus Navigator** | Find buildings, services, and accessibility-aware routes |
| **👥 Social Courage Builder** | Build social confidence with low-pressure suggestions |
| **🧠 Mental Health Support** | Mood check-ins, coping strategies, and counselling connections |
| **🌍 International Student Support** | Cultural adjustment, immigration questions, and homesickness support |
| **♿ Accessibility First** | Accessible routes, elevator locations, and mobility options |
| **☀️ Seasonal Support** | Light therapy tips and strategies for Victoria's dark winters |
| **📚 Resource Connector** | Connect with UVic services and demystify support processes |

### 🧘 Wellness Dashboard
- **Mood Tracking**: Log daily moods with notes and view historical trends
- **Breathing Exercises**: Guided breathing techniques for stress relief
- **Relaxation Sounds**: Ambient soundscapes for focus and relaxation
- **Gratitude Jar**: Collect and reflect on positive moments
- **Daily Affirmations**: Personalized motivational messages

### 🎨 Customization Studio
- **Cinematic Themes**: Hollywood-inspired visual themes and effects
- **Custom Wallpapers**: Gradient, mesh, solid color, and image backgrounds
- **Unsplash Integration**: Search and apply high-quality photos
- **Mood Presets**: Pre-configured ambient settings for different moods
- **Light/Dark Mode**: System-aware theme switching

### 🔐 Authentication
- NetLink ID-based authentication (UVic student login)
- JWT token-based session management
- Persistent user preferences and mood history

---

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** component library (Radix UI primitives)
- **Framer Motion** for animations
- **React Query** for data fetching
- **React Router** for navigation
- **Recharts** for data visualization

### Backend
- **FastAPI** (Python) REST API
- **Supabase** for database (PostgreSQL) and authentication
- **OpenRouter API** with Mistral AI for chat responses
- **Pydantic** for data validation
- **JWT** for authentication tokens
- **Unsplash API** for background images

---

## 📁 Project Structure

```
lantern/
├── src/                          # Frontend source
│   ├── components/               # React components
│   │   ├── auth/                 # Authentication components
│   │   ├── chat/                 # Chat interface components
│   │   ├── wellness/             # Wellness feature components
│   │   ├── settings/             # Customization studio
│   │   ├── scenes/               # Ambient scene components
│   │   └── ui/                   # shadcn/ui components
│   ├── contexts/                 # React contexts (Auth, Theme, Scene, Weather)
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities and configurations
│   ├── pages/                    # Page components
│   └── store/                    # State management
├── backend/                      # Python FastAPI backend
│   ├── app/
│   │   ├── routers/              # API route handlers
│   │   ├── services/             # Business logic
│   │   ├── models/               # Pydantic schemas
│   │   ├── auth/                 # JWT authentication
│   │   └── config/               # Settings and Supabase client
│   └── requirements.txt          # Python dependencies
├── data/                         # Static data files
│   ├── mental_health_conversations.json
│   └── uvic_student_resources.json
└── public/                       # Static assets
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- **Python** 3.11+
- **Bun** or npm package manager

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenRouter API (for AI chat)
OPENROUTER_API_KEY=your_openrouter_api_key

# Unsplash API (for background images)
UNSPLASH_ACCESS_KEY=your_unsplash_access_key

# JWT Configuration (optional - auto-generated if not set)
JWT_SECRET_KEY=your_secret_key
```

### Database Setup

Run the schema in your Supabase SQL Editor:

```sql
-- See backend/supabase_schema.sql for full schema
-- Creates: users, mood_entries tables with RLS policies
```

### Installation

**1. Clone the repository**
```bash
git clone <repository-url>
cd lantern
```

**2. Install frontend dependencies**
```bash
bun install
# or
npm install
```

**3. Set up Python backend**
```bash
cd backend
python -m venv env
source env/bin/activate  # On Windows: env\Scripts\activate
pip install -r requirements.txt
```

### Running the Application

**Start the backend server:**
```bash
cd backend
source env/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Start the frontend development server:**
```bash
# In the root directory
bun dev
# or
npm run dev
```
---

## 📡 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/health` | GET | Health check |
| `/api/auth/login` | POST | Login with NetLink ID |
| `/api/auth/me` | GET | Get current user info |
| `/api/chat` | POST | Send message to AI chatbot |
| `/api/wellness/mood` | POST | Create mood entry |
| `/api/wellness/mood` | GET | Get mood history |
| `/api/wellness/stats` | GET | Get mood statistics |
| `/api/images/unsplash/search` | GET | Search Unsplash photos |

---

## 🧪 Testing

```bash
# Run frontend tests
bun test
# or
npm run test

# Run tests in watch mode
bun test:watch
# or
npm run test:watch
```

---

## 📱 Pages & Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/` | Public | Home page with personalized greeting |
| `/about` | Public | About Lantern |
| `/chat` | Protected | AI chat interface with mode selection |
| `/wellness` | Protected | Wellness dashboard and mood tracking |
| `/settings` | Protected | Customization studio |

---

## 🎨 Key Features Deep Dive

### Chat Modes
Each chat mode has specialized system prompts and UVic-specific knowledge:
- Crisis detection with immediate resource provision
- Pattern matching for mental health conversations
- UVic resource database integration

### Wellness Tracking
- Mood entries stored in Supabase with user association
- Historical trend visualization
- Personalized recommendations based on mood patterns

### Theme System
- 20+ pre-built themes (Lantern default, Oceanic, Aurora, etc.)
- CSS custom properties for dynamic theming
- Smooth transitions between themes

---

## 🤝 Developers

**Full Stack Developers:**
- **Aditya Padmarajan** (Computer Science @ UVic)
- **Anitta Varghese** (Software Engineering @ UVic)

---

## 📄 License

This project is developed for educational purposes at the University of Victoria.

---


