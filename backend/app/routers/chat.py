from fastapi import APIRouter
from ..models.schemas import ChatMessageInput, ChatResponse, ApiResponse
from ..services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("", response_model=ApiResponse[ChatResponse])
async def send_message(body: ChatMessageInput) -> ApiResponse[ChatResponse]:
    """Send a message and get a contextual response."""
    response = ChatService.get_contextual_response(body.message, body.mode)
    return ApiResponse(success=True, data=response)
