from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime

from .config import settings
from .routers import chat_router, wellness_router, auth_router, images_router

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

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(wellness_router, prefix="/api")
app.include_router(images_router, prefix="/api")


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
