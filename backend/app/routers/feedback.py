from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any

from app.services.feedback_service import feedback_service
from app.dependencies import get_optional_user

router = APIRouter(prefix="/api", tags=["feedback"])


class FeedbackContext(BaseModel):
    playbook_id: Optional[str] = None
    stage: Optional[str] = None
    session_id: Optional[str] = None


class FeedbackRequest(BaseModel):
    rating: int = Field(..., ge=1, le=5)
    note: Optional[str] = None
    context: Optional[FeedbackContext] = None


class EventPayload(BaseModel):
    playbook_id: Optional[str] = None
    resource_id: Optional[str] = None
    resource_type: Optional[str] = None
    script_scenario: Optional[str] = None
    extra: Optional[Dict[str, Any]] = None


class EventRequest(BaseModel):
    event_type: str  # "playbook_started" | "resource_clicked" | "script_used"
    payload: Optional[EventPayload] = None


class ApiResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.post("/feedback", response_model=ApiResponse)
async def submit_feedback(
    request: FeedbackRequest,
    user: Optional[dict] = Depends(get_optional_user)
):
    """Submit user feedback."""
    try:
        user_id = None
        if user:
            user_id = user.get("id") or user.get("sub")
        
        context_dict = request.context.model_dump() if request.context else None
        
        result = await feedback_service.submit_feedback(
            user_id=user_id,
            rating=request.rating,
            note=request.note,
            context=context_dict,
        )
        return ApiResponse(success=True, data={"submitted": True})
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.post("/events", response_model=ApiResponse)
async def log_event(
    request: EventRequest,
    user: Optional[dict] = Depends(get_optional_user)
):
    """Log an application event."""
    try:
        user_id = None
        if user:
            user_id = user.get("id") or user.get("sub")
        
        payload_dict = request.payload.model_dump() if request.payload else None
        
        result = await feedback_service.log_event(
            event_type=request.event_type,
            payload=payload_dict,
            user_id=user_id,
        )
        return ApiResponse(success=True, data={"logged": True})
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.get("/feedback/stats", response_model=ApiResponse)
async def get_feedback_stats():
    """Get feedback statistics (admin)."""
    try:
        stats = await feedback_service.get_feedback_stats()
        return ApiResponse(success=True, data=stats)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))
