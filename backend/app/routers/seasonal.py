from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional, List, Dict, Any

from app.services.seasonal_service import seasonal_service
from app.dependencies import get_optional_user

router = APIRouter(prefix="/api/context", tags=["context"])


class WeatherData(BaseModel):
    description: Optional[str] = None
    temperature: Optional[float] = None
    condition: Optional[str] = None


class SeasonalRequest(BaseModel):
    weather: Optional[WeatherData] = None
    location: str = "Victoria, BC"
    lat: Optional[float] = None
    lon: Optional[float] = None
    coping_style: Optional[str] = None


class SuggestionItem(BaseModel):
    id: str
    text: str


class SeasonalData(BaseModel):
    tone: str
    seasonal_tone: str
    is_rainy: bool
    is_clear: bool
    temperature_c: Optional[float]
    suggestions: List[Dict[str, str]]
    personalized_suggestions: Optional[List[Dict[str, str]]] = None
    sunset_alert: bool
    minutes_to_sunset: Optional[int]
    tags: List[str]
    routine_tags: List[str]


class SeasonalResponse(BaseModel):
    success: bool
    data: SeasonalData


@router.post("/seasonal", response_model=SeasonalResponse)
async def get_seasonal_context(
    request: SeasonalRequest,
    user: Optional[dict] = Depends(get_optional_user)
):
    """Get seasonal and weather-aware context for Victoria."""
    try:
        # Try to get live weather if no weather data provided
        if not request.weather and (request.lat or request.lon):
            context = await seasonal_service.get_full_seasonal_context(
                lat=request.lat,
                lon=request.lon,
            )
        elif request.weather:
            context = seasonal_service.get_seasonal_context(
                weather_description=request.weather.description,
                temperature=request.weather.temperature,
                condition=request.weather.condition,
                location=request.location,
            )
        else:
            # Try to fetch Victoria weather
            context = await seasonal_service.get_full_seasonal_context()
        
        # Add personalized suggestions if coping style provided
        if request.coping_style:
            personalized = seasonal_service.get_personalized_suggestions(
                coping_style=request.coping_style,
                is_rainy=context.get("is_rainy", False),
                is_clear=context.get("is_clear", False),
            )
            context["personalized_suggestions"] = personalized
        
        return SeasonalResponse(success=True, data=SeasonalData(**context))
    except Exception as e:
        # Return default context on error
        default_context = seasonal_service.get_seasonal_context()
        return SeasonalResponse(success=True, data=SeasonalData(**default_context))


@router.get("/seasonal/live")
async def get_live_seasonal_context():
    """Get live seasonal context for Victoria (auto-fetches weather)."""
    try:
        context = await seasonal_service.get_full_seasonal_context()
        return {"success": True, "data": context}
    except Exception as e:
        default_context = seasonal_service.get_seasonal_context()
        return {"success": True, "data": default_context}
