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
    seasonal,
    profile,
    actions,
    feedback,
)
from .services.resource_service import init_resource_service

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
app.include_router(seasonal.router)
app.include_router(profile.router)
app.include_router(actions.router)
app.include_router(feedback.router)

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
