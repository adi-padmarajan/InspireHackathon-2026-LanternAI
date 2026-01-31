"""
Router for structured wellness playbooks.
"""

from fastapi import APIRouter

from ..models.schemas import ApiResponse, PlaybookRunRequest, PlaybookRunResponse
from ..services.playbook_service import get_playbook_service

router = APIRouter(prefix="/playbooks", tags=["playbooks"])


@router.post("/run", response_model=ApiResponse[PlaybookRunResponse])
async def run_playbook(body: PlaybookRunRequest) -> ApiResponse[PlaybookRunResponse]:
    """
    Run a structured playbook flow.

    Returns:
    - validation line
    - triage question
    - action plan/checklist
    - suggested UVic resource IDs
    """
    service = get_playbook_service()
    response = service.run(message=body.message, state=body.state)
    return ApiResponse(success=True, data=response)
