import logging
import sys
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .config import settings
from .routers import (
    chat_router,
    wellness_router,
    auth_router,
    images_router,
    resources_router,
    playbooks_router,
    seasonal_router,
    profile_router,
    actions_router,
    feedback_router,
)
from .services.resource_service import init_resource_service
from .services.profile_service import profile_service
from .services.feedback_service import feedback_service
from .config import get_supabase_client

# Configure logging
logging.basicConfig(
    level=logging.DEBUG if settings.debug else logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title=settings.app_name,
    description="Backend API for Lantern - UVic Student Support Chatbot",
    version="1.0.0",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include existing routers
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(wellness_router, prefix="/api")
app.include_router(images_router, prefix="/api")
app.include_router(resources_router, prefix="/api")
app.include_router(playbooks_router, prefix="/api")

# Include new routers (Phases 3-6)
app.include_router(seasonal_router)
app.include_router(profile_router)
app.include_router(actions_router)
app.include_router(feedback_router)

# Initialize resource service at startup
@app.on_event("startup")
async def startup_event():
    """Load resources on application startup."""
    import os
    # Resolve path relative to project root
    project_root = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    json_path = os.path.join(project_root, "data", "uvic_student_resources.json")
    init_resource_service(json_path)
    logger.info("Resource service initialized")

    try:
        supabase = get_supabase_client()
        profile_service.set_client(supabase)
        feedback_service.set_client(supabase)
        logger.info("Supabase client initialized for profile/feedback services")
    except Exception as e:
        logger.warning("Supabase client not configured: %s", e)


@app.get("/api/health")
async def health_check():
    """Health check endpoint."""
    return {
        "success": True,
        "data": {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
        },
    }


@app.get("/")
async def root():
    """Root endpoint."""
    return {
        "message": "Lantern API",
        "docs": "/docs",
        "health": "/api/health",
    }

# Phase 2-4 Types

export interface UserPreferences {
  vibe: 'jokester' | 'cozy' | 'balanced' | null;
  coping_style: 'talking' | 'planning' | 'grounding' | null;
  routines: string[];
  last_helpful_routine_id: string | null;
  last_helpful_playbook_id: string | null;
  last_feedback_rating: number | null;
  last_check_in_at: string | null;
}

export interface UserMemory {
  last_goal: string | null;
  last_checkin: string | null;
  playbook_state: Record<string, unknown>;
}

export interface UserProfile {
  preferences: UserPreferences | null;
  memory: UserMemory | null;
}

export interface PersonalizationContext {
  coping_style: 'talking' | 'planning' | 'grounding' | null;
  suggested_routine_id: string | null;
  repeat_suggestion: string | null;
}

export interface SeasonalSuggestion {
  id: string;
  text: string;
}

export interface SeasonalContext {
  tone: 'cozy' | 'bright' | 'neutral';
  seasonal_tone: 'cozy' | 'bright' | 'neutral';
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
  event_type: 'playbook_started' | 'resource_clicked' | 'script_used' | 'routine_used' | 'routine_repeated';
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