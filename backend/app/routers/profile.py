from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.profile_service import profile_service
from app.dependencies import get_current_user

router = APIRouter(prefix="/api", tags=["profile"])


class PreferencesUpdate(BaseModel):
    vibe: Optional[str] = None  # "jokester" | "cozy" | "balanced"
    coping_style: Optional[str] = None  # "talking" | "planning" | "grounding"
    routines: Optional[List[str]] = None


class MemoryUpdate(BaseModel):
    last_goal: Optional[str] = None
    last_checkin: Optional[str] = None
    playbook_state: Optional[Dict[str, Any]] = None


class ProfileUpdate(BaseModel):
    preferences: Optional[PreferencesUpdate] = None
    memory: Optional[MemoryUpdate] = None


class ApiResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None


@router.get("/preferences", response_model=ApiResponse)
async def get_preferences(user: dict = Depends(get_current_user)):
    """Get user preferences."""
    try:
        user_id = user.get("id") or user.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        data = await profile_service.get_preferences(user_id)
        return ApiResponse(success=True, data=data)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.post("/preferences", response_model=ApiResponse)
async def update_preferences(
    update: PreferencesUpdate,
    user: dict = Depends(get_current_user)
):
    """Update user preferences."""
    try:
        user_id = user.get("id") or user.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        data = await profile_service.upsert_preferences(
            user_id=user_id,
            vibe=update.vibe,
            coping_style=update.coping_style,
            routines=update.routines,
        )
        return ApiResponse(success=True, data=data)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.get("/profile", response_model=ApiResponse)
async def get_profile(user: dict = Depends(get_current_user)):
    """Get full user profile (preferences + memory)."""
    try:
        user_id = user.get("id") or user.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        data = await profile_service.get_profile(user_id)
        return ApiResponse(success=True, data=data)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.post("/profile", response_model=ApiResponse)
async def update_profile(
    update: ProfileUpdate,
    user: dict = Depends(get_current_user)
):
    """Update full user profile."""
    try:
        user_id = user.get("id") or user.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        result = {}
        
        if update.preferences:
            prefs = await profile_service.upsert_preferences(
                user_id=user_id,
                vibe=update.preferences.vibe,
                coping_style=update.preferences.coping_style,
                routines=update.preferences.routines,
            )
            result["preferences"] = prefs
        
        if update.memory:
            memory = await profile_service.upsert_memory(
                user_id=user_id,
                last_goal=update.memory.last_goal,
                last_checkin=update.memory.last_checkin,
                playbook_state=update.memory.playbook_state,
            )
            result["memory"] = memory
        
        return ApiResponse(success=True, data=result)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))


@router.delete("/profile", response_model=ApiResponse)
async def clear_profile(user: dict = Depends(get_current_user)):
    """Clear all user data (opt-out)."""
    try:
        user_id = user.get("id") or user.get("sub")
        if not user_id:
            raise HTTPException(status_code=401, detail="User ID not found")
        
        success = await profile_service.clear_profile(user_id)
        return ApiResponse(success=success)
    except Exception as e:
        return ApiResponse(success=False, error=str(e))
