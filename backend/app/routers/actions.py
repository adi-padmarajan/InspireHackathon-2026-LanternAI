from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.action_service import action_service

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


class ScriptResponse(BaseModel):
    success: bool
    data: ScriptData


class ScenariosResponse(BaseModel):
    success: bool
    data: Dict[str, List[str]]


@router.post("/script", response_model=ScriptResponse)
async def generate_script(request: ScriptRequest):
    """Generate an action script for a given scenario."""
    context_dict = request.context.model_dump() if request.context else None
    
    result = action_service.generate_script(
        scenario=request.scenario,
        tone=request.tone,
        context=context_dict,
    )
    
    return ScriptResponse(success=True, data=ScriptData(**result))


@router.get("/scenarios", response_model=ScenariosResponse)
async def get_scenarios():
    """Get available scenarios and tones."""
    return ScenariosResponse(
        success=True,
        data={
            "scenarios": action_service.get_available_scenarios(),
            "tones": action_service.get_available_tones(),
        }
    )
