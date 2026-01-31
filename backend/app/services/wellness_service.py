from datetime import datetime
from typing import Optional
import json
from supabase import Client
import google.generativeai as genai
from ..config import settings
from ..models.schemas import (
    MoodLevel,
    MoodEntry,
    WeatherContext,
    WellnessSuggestionResponse,
    WellnessChecklistResponse,
    WellnessCheckInResponse,
    ResourceCardOut,
)
from .safety import (
    detect_crisis,
    get_crisis_action_steps,
    get_crisis_resource_lines,
    build_crisis_follow_up_question,
    build_crisis_checkin_message,
)
from .resource_service import get_resource_service, build_resource_id
from .seasonal_service import seasonal_service

# Configure Google Gemini (safe to call multiple times)
genai.configure(api_key=settings.google_ai_api_key)

GEMINI_MODEL_NAME = "gemini-3-flash-preview"

SUGGESTIONS_SYSTEM_PROMPT = """You are Lantern - a warm, best-friend companion.
Give 3-5 concise, practical suggestions for a UVic student based on mood, optional note, and current weather in Victoria.
Use friendly, non-clinical language. Avoid medical advice.
If the user hints at self-harm or suicide, prioritize safety resources.
Return JSON ONLY in this format:
{"suggestions":["..."],"follow_up_question":"..."}"""

CHECKLIST_SYSTEM_PROMPT = """You are Lantern - a warm, best-friend companion.
Create a short checklist (3-6 items) that feels doable in the next few hours.
Use the mood, note, suggestions, and weather context if provided.
Return JSON ONLY in this format:
{"title":"Optional short title","items":["..."]}"""

CHECKIN_SYSTEM_PROMPT = """You are Lantern - a warm, best-friend companion.
Write a short check-in message after a user completes their checklist.
Ask how they feel now and keep it gentle (1-2 sentences).
Return JSON ONLY in this format:
{"message":"..."}"""


def _extract_json(text: str) -> dict | None:
    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None
    try:
        return json.loads(text[start : end + 1])
    except json.JSONDecodeError:
        return None


def _normalize_list(value: object) -> list[str]:
    if not isinstance(value, list):
        return []
    cleaned: list[str] = []
    for item in value:
        text = str(item).strip()
        if text:
            cleaned.append(text)
    return cleaned


def _weather_line(weather: Optional[WeatherContext]) -> str:
    if not weather:
        return "Weather in Victoria: unknown."
    parts: list[str] = []
    if weather.description:
        parts.append(weather.description)
    if weather.temperature is not None:
        parts.append(f"{weather.temperature}°C")
    if weather.location:
        parts.append(weather.location)
    if not parts:
        return "Weather in Victoria: unknown."
    return f"Weather in Victoria: {', '.join(parts)}."


def _dedupe(items: list[str]) -> list[str]:
    seen = set()
    unique = []
    for item in items:
        key = item.strip().lower()
        if not key or key in seen:
            continue
        seen.add(key)
        unique.append(item)
    return unique


def _is_academic_note(note: Optional[str]) -> bool:
    if not note:
        return False
    lowered = note.lower()
    return any(term in lowered for term in ["exam", "midterm", "assignment", "paper", "deadline", "grade", "class"])


def _is_lonely_note(note: Optional[str]) -> bool:
    if not note:
        return False
    lowered = note.lower()
    return any(term in lowered for term in ["lonely", "alone", "isolated", "homesick", "no friends", "friendless"])


def _is_anxious_note(note: Optional[str]) -> bool:
    if not note:
        return False
    lowered = note.lower()
    return any(term in lowered for term in ["anxious", "anxiety", "panic", "worried", "nervous", "on edge"])


def _seasonal_suggestions(weather: Optional[WeatherContext]) -> list[str]:
    if not weather:
        return []
    context = seasonal_service.get_seasonal_context(
        weather_description=weather.description,
        temperature=weather.temperature,
        condition=weather.condition,
        location=weather.location or "Victoria, BC",
    )
    return context.get("suggestions", [])[:1]


def _deterministic_suggestions(
    mood: MoodLevel,
    note: Optional[str],
    weather: Optional[WeatherContext],
) -> list[str]:
    suggestions: list[str] = []
    suggestions.extend(_seasonal_suggestions(weather))

    if mood in {MoodLevel.GREAT, MoodLevel.GOOD}:
        suggestions.extend([
            "Keep the momentum: take a short loop around Ring Road or Mystic Vale.",
            "Block one focused study session at McPherson Library or your favorite spot.",
            "Try one low-pressure campus activity or club this week.",
        ])
    elif mood == MoodLevel.OKAY:
        suggestions.extend([
            "Do a quick reset: water, a stretch, and three slow breaths.",
            "Pick one small task you can finish in 15 minutes.",
            "Give yourself a short break at the SUB or a quiet corner.",
        ])
    else:
        suggestions.extend([
            "Start tiny: 3 deep breaths, shoulders down, feet grounded.",
            "If you can, take a 5-minute walk inside or outside to reset.",
            "Consider reaching out to Student Wellness or UVic Counselling.",
        ])

    if _is_academic_note(note):
        suggestions.append("If academics are heavy, the Academic Skills Centre can help you plan.")
    if _is_lonely_note(note):
        suggestions.append("Low-pressure connection idea: drop into UVic Global Community or a club page.")
    if _is_anxious_note(note):
        suggestions.append("Try a 2-minute box breath: 4 in, 4 hold, 4 out, 4 hold.")

    return _dedupe(suggestions)[:5]


def _fallback_suggestions(mood: MoodLevel, weather: Optional[WeatherContext]) -> WellnessSuggestionResponse:
    weather_hint = (weather.description or "").lower() if weather else ""
    if "rain" in weather_hint or "overcast" in weather_hint:
        weather_tip = "Keep it cozy today: warm drink, soft lighting, and a short stretch indoors."
    elif "clear" in weather_hint or "sunny" in weather_hint:
        weather_tip = "If you can, step outside for a 5-10 minute reset in the fresh air."
    else:
        weather_tip = "Take a 3-minute pause to breathe and reset before jumping back in."

    suggestions = [
        "Name the one thing that feels heaviest right now and write it down.",
        "Do a 60-second body reset: unclench jaw, drop shoulders, slow breath.",
        weather_tip,
    ]

    return WellnessSuggestionResponse(
        suggestions=suggestions,
        follow_up_question="Want me to turn these into a quick checklist?",
        resources=[],
    )


def _crisis_suggestions() -> WellnessSuggestionResponse:
    suggestions = get_crisis_action_steps() + get_crisis_resource_lines()
    return WellnessSuggestionResponse(
        suggestions=suggestions[:5],
        follow_up_question=build_crisis_follow_up_question(),
        resources=[],
    )


def _fallback_checklist(weather: Optional[WeatherContext]) -> WellnessChecklistResponse:
    weather_hint = (weather.description or "").lower() if weather else ""
    if "rain" in weather_hint:
        items = [
            "Make a warm drink and sit somewhere comfortable",
            "Write 2-3 lines about what's on your mind",
            "Do a 5-minute stretch or gentle movement",
        ]
    else:
        items = [
            "Take 3 deep breaths and relax your shoulders",
            "Do one small task you've been avoiding",
            "Step away for 5 minutes and reset",
        ]
    return WellnessChecklistResponse(title="A small reset", items=items)


def _crisis_checklist() -> WellnessChecklistResponse:
    items = get_crisis_action_steps() + get_crisis_resource_lines()
    return WellnessChecklistResponse(title="Immediate support steps", items=items[:6])


def _fallback_checkin() -> WellnessCheckInResponse:
    return WellnessCheckInResponse(
        message="You made it through that checklist. How are you feeling now?"
    )


def _crisis_checkin() -> WellnessCheckInResponse:
    return WellnessCheckInResponse(message=build_crisis_checkin_message())


def _contains_crisis(*values: Optional[str]) -> bool:
    combined = " ".join([value for value in values if value])
    return detect_crisis(combined)


class WellnessService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table_name = "mood_entries"
        self.resource_service = get_resource_service()

    async def create_mood_entry(
        self,
        mood: MoodLevel,
        note: Optional[str] = None,
        user_id: Optional[str] = None
    ) -> MoodEntry:
        """Create a new mood entry in Supabase."""
        data = {
            "mood": mood.value,
            "note": note,
            "created_at": datetime.utcnow().isoformat(),
        }

        # Add user_id if provided (authenticated request)
        if user_id:
            data["user_id"] = user_id

        result = self.supabase.table(self.table_name).insert(data).execute()

        entry = result.data[0]
        return MoodEntry(
            id=entry["id"],
            mood=MoodLevel(entry["mood"]),
            note=entry.get("note"),
            created_at=entry["created_at"],
        )

    async def get_mood_history(
        self,
        limit: int = 30,
        user_id: Optional[str] = None
    ) -> list[MoodEntry]:
        """Get recent mood entries from Supabase."""
        query = self.supabase.table(self.table_name).select("*")

        # Filter by user_id if provided (authenticated request)
        if user_id:
            query = query.eq("user_id", user_id)

        result = query.order("created_at", desc=True).limit(limit).execute()

        return [
            MoodEntry(
                id=entry["id"],
                mood=MoodLevel(entry["mood"]),
                note=entry.get("note"),
                created_at=entry["created_at"],
            )
            for entry in result.data
        ]

    async def get_mood_stats(self, user_id: Optional[str] = None) -> dict[str, int]:
        """Get mood statistics from Supabase."""
        query = self.supabase.table(self.table_name).select("mood")

        # Filter by user_id if provided (authenticated request)
        if user_id:
            query = query.eq("user_id", user_id)

        result = query.execute()

        stats: dict[str, int] = {}
        for entry in result.data:
            mood = entry["mood"]
            stats[mood] = stats.get(mood, 0) + 1

        return stats

    async def generate_suggestions(
        self,
        mood: MoodLevel,
        note: Optional[str] = None,
        weather: Optional[WeatherContext] = None,
    ) -> WellnessSuggestionResponse:
        """Generate weather-aware, UVic-specific suggestions."""
        if _contains_crisis(note):
            return _crisis_suggestions()

        suggestions = _deterministic_suggestions(mood, note, weather)
        follow_up = (
            "Want me to create a gentle checklist for the next few hours?"
            if mood in {MoodLevel.LOW, MoodLevel.STRUGGLING}
            else "Want me to turn these into a quick checklist?"
        )

        resources = self._select_resources(mood, note)
        return WellnessSuggestionResponse(
            suggestions=suggestions,
            follow_up_question=follow_up,
            resources=resources,
        )

    def _select_resources(self, mood: MoodLevel, note: Optional[str]) -> list[ResourceCardOut]:
        if not self.resource_service.is_loaded:
            return []

        queries: list[str] = []
        if mood in {MoodLevel.LOW, MoodLevel.STRUGGLING}:
            queries.extend(["Student Wellness Centre", "UVic Counselling"])
        if mood == MoodLevel.OKAY:
            queries.append("Student Wellness Centre")

        if _is_academic_note(note):
            queries.append("Academic Skills Centre")
        if _is_lonely_note(note):
            queries.extend(["UVic Global Community", "clubs", "UVSS"])
        if _is_anxious_note(note):
            queries.append("Multifaith Centre")
        if mood in {MoodLevel.GREAT, MoodLevel.GOOD}:
            queries.extend(["CARSA", "Vikes Sport Clubs"])

        if not queries:
            queries = ["Student Wellness Centre", "UVic Counselling"]

        results: list[ResourceCardOut] = []
        seen_ids: set[str] = set()
        for query in queries:
            for item in self.resource_service.search(query, limit=2):
                resource_id = item.get("id") or build_resource_id(item.get("name", ""))
                if resource_id in seen_ids:
                    continue
                seen_ids.add(resource_id)
                results.append(ResourceCardOut(**{**item, "id": resource_id}))
                if len(results) >= 4:
                    return results
        return results

    async def generate_checklist(
        self,
        mood: MoodLevel,
        note: Optional[str] = None,
        suggestions: Optional[list[str]] = None,
        weather: Optional[WeatherContext] = None,
        max_items: int = 5,
    ) -> WellnessChecklistResponse:
        """Generate a checklist via Gemini Flash."""
        if _contains_crisis(note, " ".join(suggestions or [])):
            return _crisis_checklist()

        if not settings.google_ai_api_key:
            return _fallback_checklist(weather)

        suggestions_text = "\n".join([f"- {item}" for item in (suggestions or [])])
        prompt = "\n".join(
            [
                f"Mood: {mood.value}",
                f"Note: {note or 'n/a'}",
                _weather_line(weather),
                f"Suggestions provided:\n{suggestions_text or 'n/a'}",
                f"Max items: {max_items}",
            ]
        )

        try:
            model = genai.GenerativeModel(
                model_name=GEMINI_MODEL_NAME,
                system_instruction=CHECKLIST_SYSTEM_PROMPT,
            )
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=512,
                    temperature=0.6,
                    top_p=0.9,
                    top_k=40,
                ),
            )
            payload = _extract_json(response.text or "")
            if not payload:
                return _fallback_checklist(weather)

            items = _normalize_list(payload.get("items"))
            title = str(payload.get("title") or "").strip() or None
            if not items:
                return _fallback_checklist(weather)

            return WellnessChecklistResponse(
                title=title,
                items=items[:max_items],
            )
        except Exception:
            return _fallback_checklist(weather)

    async def generate_checkin(
        self,
        mood: MoodLevel,
        note: Optional[str] = None,
        weather: Optional[WeatherContext] = None,
        checklist_summary: Optional[str] = None,
    ) -> WellnessCheckInResponse:
        """Generate a follow-up check-in after checklist completion."""
        if _contains_crisis(note, checklist_summary):
            return _crisis_checkin()

        if not settings.google_ai_api_key:
            return _fallback_checkin()

        prompt = "\n".join(
            [
                f"Mood: {mood.value}",
                f"Note: {note or 'n/a'}",
                _weather_line(weather),
                f"Checklist summary: {checklist_summary or 'n/a'}",
            ]
        )

        try:
            model = genai.GenerativeModel(
                model_name=GEMINI_MODEL_NAME,
                system_instruction=CHECKIN_SYSTEM_PROMPT,
            )
            response = model.generate_content(
                prompt,
                generation_config=genai.types.GenerationConfig(
                    max_output_tokens=256,
                    temperature=0.7,
                    top_p=0.9,
                    top_k=40,
                ),
            )
            payload = _extract_json(response.text or "")
            if not payload:
                return _fallback_checkin()

            message = str(payload.get("message") or "").strip()
            if not message:
                return _fallback_checkin()

            return WellnessCheckInResponse(message=message)
        except Exception:
            return _fallback_checkin()
