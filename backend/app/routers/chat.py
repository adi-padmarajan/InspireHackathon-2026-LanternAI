from fastapi import APIRouter, Query
from typing import Optional
from ..models.schemas import ChatMessageInput, ChatResponse, ApiResponse
from ..services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ApiResponse[ChatResponse])
async def send_message(body: ChatMessageInput) -> ApiResponse[ChatResponse]:
    """
    Send a message and get a mental health & wellness focused response.
    
    Powered by Google Gemini 3.0 Flash Preview.
    """
    response = ChatService.get_contextual_response(
        message=body.message, 
        mode=body.mode,
        session_id=body.session_id,
        profile=body.profile,
        memory=body.memory
    )
    return ApiResponse(success=True, data=response)


@router.get("/exercise/{exercise_type}", response_model=ApiResponse[str])
async def get_exercise(exercise_type: str = "breathing") -> ApiResponse[str]:
    """
    Get a quick wellness exercise guide.
    
    Available types: breathing, grounding, mindfulness
    """
    exercise = ChatService.get_quick_exercise(exercise_type)
    return ApiResponse(success=True, data=exercise)


@router.delete("/session/{session_id}", response_model=ApiResponse[bool])
async def clear_session(session_id: str) -> ApiResponse[bool]:
    """Clear conversation history for a session."""
    result = ChatService.clear_session(session_id)
    return ApiResponse(success=True, data=result)
