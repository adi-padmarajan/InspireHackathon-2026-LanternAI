from datetime import datetime
from typing import Optional, Dict, Any, List
from supabase import Client

class ProfileService:
    """Service for user preferences and memory management."""
    
    VALID_COPING_STYLES = ["talking", "planning", "grounding"]
    VALID_VIBES = ["jokester", "cozy", "balanced"]
    
    def __init__(self):
        self.supabase: Optional[Client] = None
    
    def set_client(self, client: Client):
        self.supabase = client
    
    async def get_preferences(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user preferences."""
        if not self.supabase:
            return None
        
        try:
            result = self.supabase.table("user_preferences").select("*").eq("user_id", user_id).single().execute()
            return result.data
        except Exception:
            return None
    
    async def upsert_preferences(
        self,
        user_id: str,
        vibe: Optional[str] = None,
        coping_style: Optional[str] = None,
        routines: Optional[List[str]] = None,
        last_helpful_routine_id: Optional[str] = None,
        last_helpful_playbook_id: Optional[str] = None,
        last_feedback_rating: Optional[int] = None,
    ) -> Dict[str, Any]:
        """Upsert user preferences."""
        if not self.supabase:
            raise Exception("Database not configured")
        
        data = {
            "user_id": user_id,
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        if vibe is not None and vibe in self.VALID_VIBES:
            data["vibe"] = vibe
        if coping_style is not None and coping_style in self.VALID_COPING_STYLES:
            data["coping_style"] = coping_style
        if routines is not None:
            data["routines"] = routines
        if last_helpful_routine_id is not None:
            data["last_helpful_routine_id"] = last_helpful_routine_id
        if last_helpful_playbook_id is not None:
            data["last_helpful_playbook_id"] = last_helpful_playbook_id
        if last_feedback_rating is not None and 1 <= last_feedback_rating <= 5:
            data["last_feedback_rating"] = last_feedback_rating
        
        result = self.supabase.table("user_preferences").upsert(data, on_conflict="user_id").execute()
        return result.data[0] if result.data else data
    
    async def update_last_helpful(
        self,
        user_id: str,
        routine_id: str,
        playbook_id: str,
        rating: int,
    ) -> Dict[str, Any]:
        """Update last helpful routine after positive feedback."""
        if not self.supabase:
            raise Exception("Database not configured")
        
        # Only store if rating is 4 or 5 (helpful)
        if rating < 4:
            return {}
        
        data = {
            "user_id": user_id,
            "last_helpful_routine_id": routine_id,
            "last_helpful_playbook_id": playbook_id,
            "last_feedback_rating": rating,
            "last_check_in_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        result = self.supabase.table("user_preferences").upsert(data, on_conflict="user_id").execute()
        return result.data[0] if result.data else data
    
    async def get_memory(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user memory state."""
        if not self.supabase:
            return None
        
        try:
            result = self.supabase.table("user_memory").select("*").eq("user_id", user_id).single().execute()
            return result.data
        except Exception:
            return None
    
    async def upsert_memory(
        self,
        user_id: str,
        last_goal: Optional[str] = None,
        last_checkin: Optional[str] = None,
        playbook_state: Optional[Dict[str, Any]] = None,
    ) -> Dict[str, Any]:
        """Upsert user memory."""
        if not self.supabase:
            raise Exception("Database not configured")
        
        data = {
            "user_id": user_id,
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        if last_goal is not None:
            data["last_goal"] = last_goal
        if last_checkin is not None:
            data["last_checkin"] = last_checkin
        if playbook_state is not None:
            data["playbook_state"] = playbook_state
        
        result = self.supabase.table("user_memory").upsert(data, on_conflict="user_id").execute()
        return result.data[0] if result.data else data
    
    async def get_profile(self, user_id: str) -> Dict[str, Any]:
        """Get combined profile (preferences + memory)."""
        preferences = await self.get_preferences(user_id)
        memory = await self.get_memory(user_id)
        
        return {
            "preferences": preferences,
            "memory": memory,
        }
    
    async def get_personalization_context(self, user_id: str, playbook_id: str) -> Dict[str, Any]:
        """Get personalization context for playbook integration."""
        preferences = await self.get_preferences(user_id)
        
        if not preferences:
            return {
                "coping_style": None,
                "suggested_routine_id": None,
                "repeat_suggestion": None,
            }
        
        context = {
            "coping_style": preferences.get("coping_style"),
            "suggested_routine_id": None,
            "repeat_suggestion": None,
        }
        
        # Check if last helpful routine matches current playbook
        if (
            preferences.get("last_helpful_playbook_id") == playbook_id
            and preferences.get("last_helpful_routine_id")
            and preferences.get("last_feedback_rating", 0) >= 4
        ):
            context["suggested_routine_id"] = preferences.get("last_helpful_routine_id")
            context["repeat_suggestion"] = "This helped you last time. Want to try it again?"
        
        return context
    
    async def clear_profile(self, user_id: str) -> bool:
        """Clear all user data (for opt-out)."""
        if not self.supabase:
            return False
        
        try:
            self.supabase.table("user_preferences").delete().eq("user_id", user_id).execute()
            self.supabase.table("user_memory").delete().eq("user_id", user_id).execute()
            return True
        except Exception:
            return False


profile_service = ProfileService()
