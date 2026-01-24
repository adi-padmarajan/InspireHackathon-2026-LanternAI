from pydantic import BaseModel, Field
from enum import Enum
from datetime import datetime
from typing import Generic, TypeVar, Optional

T = TypeVar("T")


# Chat models
class ChatMode(str, Enum):
    WELLNESS = "wellness"
    NAVIGATOR = "navigator"
    SOCIAL = "social"
    MENTAL_HEALTH = "mental_health"
    INTERNATIONAL = "international"
    ACCESSIBILITY = "accessibility"
    SEASONAL = "seasonal"
    RESOURCES = "resources"


class ChatMessageInput(BaseModel):
    message: str = Field(..., min_length=1)
    mode: ChatMode = ChatMode.WELLNESS


class ChatResponse(BaseModel):
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
