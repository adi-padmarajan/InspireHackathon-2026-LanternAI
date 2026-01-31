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


class CompanionProfile(BaseModel):
    preferred_name: Optional[str] = None
    vibe: Optional[str] = None
    drink: Optional[str] = None


class CompanionMemory(BaseModel):
    last_topic: Optional[str] = None
    last_goal: Optional[str] = None
    last_interaction_at: Optional[int] = None


class ChatMessageInput(BaseModel):
    """Input model for chat messages."""
    message: str = Field(..., min_length=1, description="The user's message")
    mode: ChatMode = ChatMode.WELLNESS
    session_id: Optional[str] = Field(None, description="Optional session ID for conversation continuity")
    profile: Optional[CompanionProfile] = Field(None, description="Optional user profile context")
    memory: Optional[CompanionMemory] = Field(None, description="Optional memory context")


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


class WeatherContext(BaseModel):
    description: Optional[str] = None
    temperature: Optional[float] = None
    condition: Optional[str] = None
    location: Optional[str] = None


class WellnessSuggestionRequest(BaseModel):
    mood: MoodLevel
    note: Optional[str] = None
    weather: Optional[WeatherContext] = None


class WellnessSuggestionResponse(BaseModel):
    suggestions: list[str]
    follow_up_question: str


class WellnessChecklistRequest(BaseModel):
    mood: MoodLevel
    note: Optional[str] = None
    suggestions: Optional[list[str]] = None
    weather: Optional[WeatherContext] = None
    max_items: int = Field(5, ge=3, le=8)


class WellnessChecklistResponse(BaseModel):
    title: Optional[str] = None
    items: list[str]


class WellnessCheckInRequest(BaseModel):
    mood: MoodLevel
    note: Optional[str] = None
    weather: Optional[WeatherContext] = None
    checklist_summary: Optional[str] = None


class WellnessCheckInResponse(BaseModel):
    message: str


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


# Resource models
class ResourceCardOut(BaseModel):
    id: str
    name: str
    description: str
    categories: list[str]
    url: str
    location: Optional[str] = None


# Playbook models
class PlaybookStage(str, Enum):
    VENT = "vent"
    TRIAGE = "triage"
    PLAN = "plan"


class PlaybookState(BaseModel):
    playbook_id: Optional[str] = None
    stage: PlaybookStage = PlaybookStage.VENT
    context: Optional[dict] = None


class PlaybookRunRequest(BaseModel):
    message: str = Field(..., min_length=1, description="User message to route into a playbook")
    state: Optional[PlaybookState] = None


class PlaybookRunResponse(BaseModel):
    playbook_id: str
    stage: PlaybookStage
    validation: str
    triage_question: Optional[str] = None
    action_title: str
    actions: list[str]
    resource_ids: list[str]
    resources: list[ResourceCardOut] = Field(default_factory=list)
    next_state: PlaybookState
