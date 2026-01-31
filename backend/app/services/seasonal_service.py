from datetime import datetime, timedelta
from typing import Optional, Dict, Any, List
import os
import httpx
import logging

logger = logging.getLogger(__name__)


class SeasonalService:
    """Service for Victoria-aware seasonal and weather context."""
    
    # Victoria, BC coordinates
    VICTORIA_LAT = 48.4284
    VICTORIA_LON = -123.3656
    
    CONDITION_TAGS = {
        "rain": ["rainy_day", "indoor"],
        "drizzle": ["rainy_day", "indoor"],
        "snow": ["snowy_day", "indoor", "cozy"],
        "clouds": ["overcast", "flexible"],
        "clear": ["sunny", "outdoor"],
        "sun": ["sunny", "outdoor"],
        "fog": ["misty", "indoor", "cozy"],
        "wind": ["windy", "flexible"],
        "thunderstorm": ["stormy", "indoor", "cozy"],
        "mist": ["misty", "indoor"],
    }
    
    TONE_MAP = {
        "rain": "cozy",
        "drizzle": "cozy",
        "snow": "cozy",
        "fog": "cozy",
        "mist": "cozy",
        "thunderstorm": "cozy",
        "clouds": "neutral",
        "wind": "neutral",
        "clear": "bright",
        "sun": "bright",
    }
    
    INDOOR_SUGGESTIONS = [
        {"id": "library_pod", "text": "Find a cozy study spot in the library"},
        {"id": "campus_cafe", "text": "Try a warm drink at a campus café"},
        {"id": "indoor_stretch", "text": "Indoor stretching or yoga session"},
        {"id": "tunnel_walk", "text": "Explore the tunnels between buildings"},
        {"id": "meditation_corner", "text": "Find a quiet meditation corner"},
    ]
    
    OUTDOOR_SUGGESTIONS = [
        {"id": "ring_road", "text": "Quick walk around the ring road"},
        {"id": "mystic_vale", "text": "Study break at Mystic Vale"},
        {"id": "fountain_sit", "text": "Grab coffee and sit by the fountain"},
        {"id": "cadboro_bay", "text": "Walk to Cadboro Bay if you have time"},
        {"id": "finnerty_gardens", "text": "Stroll through Finnerty Gardens"},
    ]
    
    RAINY_SUGGESTIONS = [
        {"id": "cozy_study", "text": "Perfect day for a cozy study session"},
        {"id": "hot_chocolate", "text": "Hot chocolate at the SUB"},
        {"id": "indoor_meditation", "text": "Indoor meditation in a quiet corner"},
        {"id": "rainy_playlist", "text": "Rainy day playlist while studying"},
    ]
    
    COPING_STYLE_ROUTINES = {
        "talking": [
            {"id": "talk_friend", "text": "Reach out to a friend for a quick chat"},
            {"id": "peer_support", "text": "Visit UVic peer support drop-in"},
            {"id": "journal_feelings", "text": "Write about what you're feeling"},
        ],
        "planning": [
            {"id": "mini_checklist", "text": "Create a 3-item checklist for today"},
            {"id": "time_block", "text": "Block out the next 2 hours with tasks"},
            {"id": "priority_sort", "text": "Sort tasks by urgency and importance"},
        ],
        "grounding": [
            {"id": "box_breathing", "text": "Try 4-4-4-4 box breathing for 2 minutes"},
            {"id": "five_senses", "text": "5-4-3-2-1 grounding: name 5 things you see..."},
            {"id": "body_scan", "text": "Quick body scan from head to toes"},
        ],
    }
    
    def __init__(self):
        self.weather_api_key = os.getenv("OPENWEATHER_API_KEY")
        self._cached_weather: Optional[Dict[str, Any]] = None
        self._cache_time: Optional[datetime] = None
        self._cache_duration = timedelta(minutes=30)
    
    async def fetch_weather(self, lat: float = None, lon: float = None) -> Optional[Dict[str, Any]]:
        """Fetch current weather from OpenWeatherMap API."""
        if not self.weather_api_key:
            logger.debug("No weather API key configured")
            return None
        
        lat = lat or self.VICTORIA_LAT
        lon = lon or self.VICTORIA_LON
        
        # Check cache
        if (
            self._cached_weather
            and self._cache_time
            and datetime.now() - self._cache_time < self._cache_duration
        ):
            return self._cached_weather
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    "https://api.openweathermap.org/data/2.5/weather",
                    params={
                        "lat": lat,
                        "lon": lon,
                        "appid": self.weather_api_key,
                        "units": "metric",
                    },
                    timeout=5.0,
                )
                
                if response.status_code == 200:
                    data = response.json()
                    self._cached_weather = {
                        "description": data.get("weather", [{}])[0].get("description", ""),
                        "condition": data.get("weather", [{}])[0].get("main", ""),
                        "temperature": data.get("main", {}).get("temp"),
                        "feels_like": data.get("main", {}).get("feels_like"),
                        "humidity": data.get("main", {}).get("humidity"),
                        "wind_speed": data.get("wind", {}).get("speed"),
                        "sunrise": data.get("sys", {}).get("sunrise"),
                        "sunset": data.get("sys", {}).get("sunset"),
                    }
                    self._cache_time = datetime.now()
                    return self._cached_weather
        except Exception as e:
            logger.warning(f"Failed to fetch weather: {e}")
        
        return None
    
    def get_seasonal_context(
        self,
        weather_description: Optional[str] = None,
        temperature: Optional[float] = None,
        condition: Optional[str] = None,
        location: str = "Victoria, BC",
        sunset_timestamp: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Generate seasonal context based on weather."""
        now = datetime.now()
        month = now.month
        hour = now.hour
        
        # Determine if rainy/clear
        is_rainy = False
        is_clear = False
        
        if condition:
            condition_lower = condition.lower()
            is_rainy = any(w in condition_lower for w in ["rain", "drizzle", "thunderstorm", "mist"])
            is_clear = any(w in condition_lower for w in ["clear", "sun"])
        
        # Determine tone based on condition
        tone = "neutral"
        if condition:
            condition_lower = condition.lower()
            for key, mapped_tone in self.TONE_MAP.items():
                if key in condition_lower:
                    tone = mapped_tone
                    break
        
        # Cold weather adjustment
        if temperature is not None and temperature < 5:
            tone = "cozy"
        
        # Determine tags
        tags = []
        if condition:
            condition_lower = condition.lower()
            for key, tag_list in self.CONDITION_TAGS.items():
                if key in condition_lower:
                    tags.extend(tag_list)
                    break
        
        if not tags:
            tags = ["flexible"]
        
        # Remove duplicates while preserving order
        tags = list(dict.fromkeys(tags))
        
        # Sunset alert for Victoria's dark winters
        sunset_alert = False
        minutes_to_sunset = None
        
        if sunset_timestamp:
            sunset_time = datetime.fromtimestamp(sunset_timestamp)
            time_to_sunset = sunset_time - now
            minutes_to_sunset = int(time_to_sunset.total_seconds() / 60)
            
            if 0 < minutes_to_sunset <= 60:
                sunset_alert = True
        elif month in [11, 12, 1, 2] and hour >= 15:
            # Fallback: winter months, after 3pm
            sunset_alert = True
        
        # Generate suggestions based on weather
        suggestions = []
        routine_tags = []
        
        if is_rainy or (temperature is not None and temperature < 8):
            suggestions = self.RAINY_SUGGESTIONS[:3]
            routine_tags = ["indoor", "cozy"]
        elif is_clear and temperature and temperature > 10:
            suggestions = self.OUTDOOR_SUGGESTIONS[:3]
            routine_tags = ["outdoor", "active"]
        else:
            suggestions = self.INDOOR_SUGGESTIONS[:2] + self.OUTDOOR_SUGGESTIONS[:1]
            routine_tags = ["flexible"]
        
        # Add sunset-specific suggestion
        if sunset_alert:
            suggestions.insert(0, {
                "id": "sunset_loop",
                "text": "Quick outdoor loop before it gets dark!"
            })
        
        return {
            "tone": tone,  # "cozy" | "bright" | "neutral"
            "seasonal_tone": tone,
            "is_rainy": is_rainy,
            "is_clear": is_clear,
            "temperature_c": temperature,
            "suggestions": suggestions,
            "sunset_alert": sunset_alert,
            "minutes_to_sunset": minutes_to_sunset,
            "tags": tags,
            "routine_tags": routine_tags,
        }
    
    async def get_full_seasonal_context(
        self,
        lat: Optional[float] = None,
        lon: Optional[float] = None,
    ) -> Dict[str, Any]:
        """Get seasonal context with live weather data."""
        weather = await self.fetch_weather(lat, lon)
        
        if weather:
            return self.get_seasonal_context(
                weather_description=weather.get("description"),
                temperature=weather.get("temperature"),
                condition=weather.get("condition"),
                sunset_timestamp=weather.get("sunset"),
            )
        
        # Fallback without weather data
        return self.get_seasonal_context()
    
    def get_coping_style_routines(self, coping_style: Optional[str]) -> List[Dict[str, str]]:
        """Get routines based on coping style."""
        if coping_style and coping_style in self.COPING_STYLE_ROUTINES:
            return self.COPING_STYLE_ROUTINES[coping_style]
        return []
    
    def get_personalized_suggestions(
        self,
        coping_style: Optional[str],
        is_rainy: bool = False,
        is_clear: bool = False,
    ) -> List[Dict[str, str]]:
        """Get suggestions personalized by coping style and weather."""
        suggestions = []
        
        # Add coping style routines first
        if coping_style:
            suggestions.extend(self.get_coping_style_routines(coping_style)[:2])
        
        # Add weather-appropriate suggestions
        if is_rainy:
            suggestions.extend(self.RAINY_SUGGESTIONS[:2])
        elif is_clear:
            suggestions.extend(self.OUTDOOR_SUGGESTIONS[:2])
        else:
            suggestions.extend(self.INDOOR_SUGGESTIONS[:1])
            suggestions.extend(self.OUTDOOR_SUGGESTIONS[:1])
        
        return suggestions[:5]  # Limit to 5


seasonal_service = SeasonalService()
