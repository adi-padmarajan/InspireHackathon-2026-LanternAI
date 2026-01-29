from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime
from typing import Generic, TypeVar, Optional

T = TypeVar("T")


# Chat models - Simplified for Mental Health & Wellness focus
class ChatMode(str, Enum):
    """Chat modes focused on mental health and wellness."""
    WELLNESS = "wellness"          # General wellness support
    MENTAL_HEALTH = "mental_health"  # Mental health conversations
    CRISIS = "crisis"              # Crisis support mode


class ChatMessageInput(BaseModel):
    """Input model for chat messages."""
    message: str = Field(..., min_length=1, description="The user's message")
    mode: ChatMode = ChatMode.WELLNESS
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation continuity")


class ChatResponse(BaseModel):
    """Response model for chat messages."""
    message: str
    timestamp: datetime


# Wellness models
class MoodLevel(str, Enum):
    GREAT = "great"
    GOOD = "good"
    OKAY = "okay"
    LOW = "low"
    STRUGGLING = "struggling"


class MoodEntryInput(BaseModel):
    mood: MoodLevel
    note: Optional[str] = None


class MoodEntry(BaseModel):
    id: str
    mood: MoodLevel
    note: Optional[str] = None
    created_at: datetime


# Generic API response
class ApiResponse(BaseModel, Generic[T]):
    success: bool
    data: Optional[T] = None
    error: Optional[str] = None
