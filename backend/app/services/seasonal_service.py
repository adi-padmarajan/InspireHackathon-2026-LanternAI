from datetime import datetime
from typing import Optional

class SeasonalService:
    """Service for Victoria-aware seasonal and weather context."""
    
    CONDITION_TAGS = {
        "rain": ["rainy_day", "indoor"],
        "drizzle": ["rainy_day", "indoor"],
        "snow": ["snowy_day", "indoor", "cozy"],
        "clouds": ["overcast", "flexible"],
        "clear": ["sunny", "outdoor"],
        "sun": ["sunny", "outdoor"],
        "fog": ["misty", "indoor", "cozy"],
        "wind": ["windy", "flexible"],
    }
    
    TONE_MAP = {
        "rain": "cozy",
        "drizzle": "cozy",
        "snow": "cozy",
        "fog": "cozy",
        "clouds": "gentle",
        "wind": "gentle",
        "clear": "uplifting",
        "sun": "uplifting",
    }
    
    INDOOR_SUGGESTIONS = [
        "Find a cozy study spot in the library",
        "Try a warm drink at a campus café",
        "Indoor stretching or yoga session",
        "Explore the tunnels between buildings",
    ]
    
    OUTDOOR_SUGGESTIONS = [
        "Quick walk around the ring road",
        "Study break at Mystic Vale",
        "Grab coffee and sit by the fountain",
        "Walk to Cadboro Bay if you have time",
    ]
    
    RAINY_SUGGESTIONS = [
        "Perfect day for a cozy study session",
        "Hot chocolate at the SUB",
        "Indoor meditation in a quiet corner",
        "Rainy day playlist while studying",
    ]
    
    def get_seasonal_context(
        self,
        weather_description: Optional[str] = None,
        temperature: Optional[float] = None,
        condition: Optional[str] = None,
        location: str = "Victoria, BC"
    ) -> dict:
        """Generate seasonal context based on weather."""
        now = datetime.now()
        month = now.month
        hour = now.hour
        
        # Determine tone based on condition
        tone = "gentle"  # default
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
        if month in [11, 12, 1, 2] and hour >= 15:
            sunset_alert = True
        
        # Generate suggestions
        suggestions = []
        if "indoor" in tags or (temperature is not None and temperature < 8):
            suggestions = self.INDOOR_SUGGESTIONS[:2]
            if condition and "rain" in condition.lower():
                suggestions = self.RAINY_SUGGESTIONS[:2]
        else:
            suggestions = self.OUTDOOR_SUGGESTIONS[:2]
        
        # Add sunset-specific suggestion
        if sunset_alert:
            suggestions.insert(0, "Quick outdoor loop before it gets dark!")
        
        return {
            "tone": tone,
            "suggestions": suggestions,
            "sunset_alert": sunset_alert,
            "tags": tags,
        }


seasonal_service = SeasonalService()
