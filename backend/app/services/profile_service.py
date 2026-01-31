from datetime import datetime
from typing import Optional, Dict, Any, List
from supabase import Client

class ProfileService:
    """Service for user preferences and memory management."""
    
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
    ) -> Dict[str, Any]:
        """Upsert user preferences."""
        if not self.supabase:
            raise Exception("Database not configured")
        
        data = {
            "user_id": user_id,
            "updated_at": datetime.utcnow().isoformat(),
        }
        
        if vibe is not None:
            data["vibe"] = vibe
        if coping_style is not None:
            data["coping_style"] = coping_style
        if routines is not None:
            data["routines"] = routines
        
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
