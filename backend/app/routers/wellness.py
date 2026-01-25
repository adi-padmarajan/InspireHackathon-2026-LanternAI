from fastapi import APIRouter, Depends, HTTPException
from supabase import Client
from ..models.schemas import MoodEntryInput, MoodEntry, ApiResponse
from ..services.wellness_service import WellnessService
from ..auth.dependencies import get_current_user, TokenData
from ..config import get_supabase_client

router = APIRouter(prefix="/wellness", tags=["wellness"])


def get_wellness_service() -> WellnessService:
    try:
        client = get_supabase_client()
        return WellnessService(client)
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))


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
        raise HTTPException(status_code=500, detail=str(e))
