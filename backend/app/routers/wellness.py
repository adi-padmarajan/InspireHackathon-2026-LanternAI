import logging
from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from ..models.schemas import (
    MoodEntryInput,
    MoodEntry,
    ApiResponse,
    WellnessSuggestionRequest,
    WellnessSuggestionResponse,
    WellnessChecklistRequest,
    WellnessChecklistResponse,
    WellnessCheckInRequest,
    WellnessCheckInResponse,
)
from ..services.wellness_service import WellnessService
from ..auth.dependencies import get_current_user, TokenData
from ..config import get_supabase_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/wellness", tags=["wellness"])


def get_wellness_service() -> WellnessService:
    try:
        client = get_supabase_client()
        return WellnessService(client)
    except ValueError as e:
        logger.error("Failed to initialize wellness service: %s", e)
        raise HTTPException(status_code=500, detail="Service temporarily unavailable")


@router.post("/mood", response_model=ApiResponse[MoodEntry])
async def create_mood_entry(
    body: MoodEntryInput,
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[MoodEntry]:
    """Log a new mood entry (requires authentication)."""
    try:
        entry = await service.create_mood_entry(
            mood=body.mood,
            note=body.note,
            user_id=current_user.user_id
        )
        return ApiResponse(success=True, data=entry)
    except Exception as e:
        logger.error("Failed to create mood entry: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to save mood entry")


@router.get("/mood", response_model=ApiResponse[list[MoodEntry]])
async def get_mood_history(
    limit: int = 30,
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[list[MoodEntry]]:
    """Get mood entry history for current user (requires authentication)."""
    try:
        entries = await service.get_mood_history(
            limit=limit,
            user_id=current_user.user_id
        )
        return ApiResponse(success=True, data=entries)
    except Exception as e:
        logger.error("Failed to get mood history: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve mood history")


@router.get("/stats", response_model=ApiResponse[dict[str, int]])
async def get_mood_stats(
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[dict[str, int]]:
    """Get mood statistics for current user (requires authentication)."""
    try:
        stats = await service.get_mood_stats(user_id=current_user.user_id)
        return ApiResponse(success=True, data=stats)
    except Exception as e:
        logger.error("Failed to get mood stats: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to retrieve mood statistics")


@router.post("/suggestions", response_model=ApiResponse[WellnessSuggestionResponse])
async def get_suggestions(
    body: WellnessSuggestionRequest,
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[WellnessSuggestionResponse]:
    """Generate Lantern suggestions based on mood, note, and weather."""
    try:
        suggestions = await service.generate_suggestions(
            mood=body.mood,
            note=body.note,
            weather=body.weather,
        )
        return ApiResponse(success=True, data=suggestions)
    except Exception as e:
        logger.error("Failed to generate suggestions: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate suggestions")


@router.post("/checklist", response_model=ApiResponse[WellnessChecklistResponse])
async def create_checklist(
    body: WellnessChecklistRequest,
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[WellnessChecklistResponse]:
    """Generate a checklist based on mood, note, suggestions, and weather."""
    try:
        checklist = await service.generate_checklist(
            mood=body.mood,
            note=body.note,
            suggestions=body.suggestions,
            weather=body.weather,
            max_items=body.max_items,
        )
        return ApiResponse(success=True, data=checklist)
    except Exception as e:
        logger.error("Failed to generate checklist: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate checklist")


@router.post("/checkin", response_model=ApiResponse[WellnessCheckInResponse])
async def generate_checkin(
    body: WellnessCheckInRequest,
    current_user: TokenData = Depends(get_current_user),
    service: WellnessService = Depends(get_wellness_service),
) -> ApiResponse[WellnessCheckInResponse]:
    """Generate a follow-up check-in after checklist completion."""
    try:
        message = await service.generate_checkin(
            mood=body.mood,
            note=body.note,
            weather=body.weather,
            checklist_summary=body.checklist_summary,
        )
        return ApiResponse(success=True, data=message)
    except Exception as e:
        logger.error("Failed to generate check-in: %s", e, exc_info=True)
        raise HTTPException(status_code=500, detail="Failed to generate check-in")
