from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List

from ..services.seasonal_service import seasonal_service
from ..models.schemas import ApiResponse

router = APIRouter(prefix="/api/context", tags=["context"])


class WeatherData(BaseModel):
    description: Optional[str] = None
    temperature: Optional[float] = None
    condition: Optional[str] = None


class SeasonalRequest(BaseModel):
    weather: Optional[WeatherData] = None
    location: str = "Victoria, BC"


class SeasonalData(BaseModel):
    tone: str
    suggestions: List[str]
    sunset_alert: bool
    tags: List[str]


@router.post("/seasonal", response_model=ApiResponse[SeasonalData])
async def get_seasonal_context(request: SeasonalRequest):
    """Get seasonal and weather-aware context for Victoria."""
    try:
        weather = request.weather
        context = seasonal_service.get_seasonal_context(
            weather_description=weather.description if weather else None,
            temperature=weather.temperature if weather else None,
            condition=weather.condition if weather else None,
            location=request.location,
        )
        return ApiResponse(success=True, data=SeasonalData(**context))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
