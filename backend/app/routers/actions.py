from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from ..services.action_service import action_service
from ..models.schemas import ApiResponse

router = APIRouter(prefix="/api/actions", tags=["actions"])


class ScriptContext(BaseModel):
    course: Optional[str] = None
    deadline: Optional[str] = None
    name: Optional[str] = None
    topic: Optional[str] = None


class ScriptRequest(BaseModel):
    scenario: str  # "extension_request" | "text_friend" | "self_advocacy"
    tone: str = "gentle"  # "gentle" | "direct" | "warm"
    context: Optional[ScriptContext] = None


class ScriptData(BaseModel):
    title: str
    script: str
    checklist: List[str]
    suggested_next_steps: List[str]


@router.post("/script", response_model=ApiResponse[ScriptData])
async def generate_script(request: ScriptRequest):
    """Generate an action script for a given scenario."""
    context_dict = request.context.model_dump() if request.context else None
    
    result = action_service.generate_script(
        scenario=request.scenario,
        tone=request.tone,
        context=context_dict,
    )
    
    return ApiResponse(success=True, data=ScriptData(**result))

@router.get("/scenarios", response_model=ApiResponse[Dict[str, List[str]]])
async def get_scenarios():
    """Get available scenarios and tones."""
    return ApiResponse(
        success=True,
        data={
            "scenarios": action_service.get_available_scenarios(),
            "tones": action_service.get_available_tones(),
        }
    )
