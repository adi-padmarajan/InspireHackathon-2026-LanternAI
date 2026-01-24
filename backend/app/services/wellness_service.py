from datetime import datetime
from typing import Optional
from supabase import Client
from ..models.schemas import MoodLevel, MoodEntry


class WellnessService:
    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table_name = "mood_entries"

    async def create_mood_entry(
        self, mood: MoodLevel, note: Optional[str] = None
    ) -> MoodEntry:
        """Create a new mood entry in Supabase."""
        data = {
            "mood": mood.value,
            "note": note,
            "created_at": datetime.utcnow().isoformat(),
        }

        result = self.supabase.table(self.table_name).insert(data).execute()

        entry = result.data[0]
        return MoodEntry(
            id=entry["id"],
            mood=MoodLevel(entry["mood"]),
            note=entry.get("note"),
            created_at=entry["created_at"],
        )

    async def get_mood_history(self, limit: int = 30) -> list[MoodEntry]:
        """Get recent mood entries from Supabase."""
        result = (
            self.supabase.table(self.table_name)
            .select("*")
            .order("created_at", desc=True)
            .limit(limit)
            .execute()
        )

        return [
            MoodEntry(
                id=entry["id"],
                mood=MoodLevel(entry["mood"]),
                note=entry.get("note"),
                created_at=entry["created_at"],
            )
            for entry in result.data
        ]

    async def get_mood_stats(self) -> dict[str, int]:
        """Get mood statistics from Supabase."""
        result = self.supabase.table(self.table_name).select("mood").execute()

        stats: dict[str, int] = {}
        for entry in result.data:
            mood = entry["mood"]
            stats[mood] = stats.get(mood, 0) + 1

        return stats
