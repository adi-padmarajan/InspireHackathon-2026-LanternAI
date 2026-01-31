"""
Router for UVic student resources search.
"""

import logging
from typing import Optional
from fastapi import APIRouter, Query
from pydantic import BaseModel

from ..models.schemas import ApiResponse
from ..services.resource_service import get_resource_service

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/resources", tags=["resources"])


class ResourceCard(BaseModel):
    """Resource card response model."""
    name: str
    description: str
    categories: list[str]
    url: str
    location: Optional[str] = None


class ResourceSearchData(BaseModel):
    """Resource search result data."""
    query: str
    results: list[ResourceCard]


@router.get("/search", response_model=ApiResponse[ResourceSearchData])
async def search_resources(
    q: Optional[str] = Query(None, description="Search query string"),
) -> ApiResponse[ResourceSearchData]:
    """
    Search UVic student resources.
    
    Returns top 5 matching resources ranked by relevance:
    - name match = +3 points
    - description match = +2 points
    - category match = +1 point
    - location match = +1 point
    
    Results sorted by score descending, then name ascending.
    """
    service = get_resource_service()

    # Check if resources are loaded
    if not service.is_loaded:
        error_msg = service.load_error or "Resources not loaded"
        logger.error("Resource search failed: %s", error_msg)
        return ApiResponse(
            success=False,
            error=error_msg,
        )

    # Perform search
    query_str = q or ""
    results = service.search(query_str)

    # Convert to ResourceCard models
    resource_cards = [ResourceCard(**r) for r in results]

    return ApiResponse(
        success=True,
        data=ResourceSearchData(
            query=query_str,
            results=resource_cards,
        ),
    )
