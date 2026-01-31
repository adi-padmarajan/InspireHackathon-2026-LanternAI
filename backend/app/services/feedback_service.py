from datetime import datetime
from typing import Optional, Dict, Any, List
from supabase import Client
import logging

logger = logging.getLogger(__name__)


class FeedbackService:
    """Service for user feedback and event tracking."""
    
    def __init__(self):
        self.supabase: Optional[Client] = None
    
    def set_client(self, client: Client):
        self.supabase = client
    
    async def submit_feedback(
        self,
        user_id: Optional[str],
        rating: int,
        note: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
        routine_id: Optional[str] = None,
        playbook_id: Optional[str] = None,
        action_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Submit user feedback."""
        feedback_data = {
            "user_id": user_id,
            "rating": rating,
            "note": note,
            "context": context or {},
            "routine_id": routine_id,
            "playbook_id": playbook_id,
            "action_id": action_id,
            "created_at": datetime.utcnow().isoformat(),
        }
        
        if self.supabase:
            try:
                result = self.supabase.table("user_feedback").insert(feedback_data).execute()
                
                # Update user preferences with last helpful routine if rating is good
                if user_id and rating >= 4 and (routine_id or playbook_id):
                    from app.services.profile_service import profile_service
                    await profile_service.update_last_helpful(
                        user_id=user_id,
                        routine_id=routine_id or "",
                        playbook_id=playbook_id or "",
                        rating=rating,
                    )
                
                return result.data[0] if result.data else feedback_data
            except Exception as e:
                logger.error(f"Failed to save feedback: {e}")
        
        # Log even if DB save fails
        logger.info(f"Feedback received: rating={rating}, routine={routine_id}, playbook={playbook_id}")
        return feedback_data
    
    async def log_event(
        self,
        event_type: str,
        payload: Optional[Dict[str, Any]] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Log an application event."""
        event_data = {
            "event_type": event_type,
            "payload": payload or {},
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
        }
        
        if self.supabase:
            try:
                result = self.supabase.table("app_events").insert(event_data).execute()
                return result.data[0] if result.data else event_data
            except Exception as e:
                logger.error(f"Failed to log event: {e}")
        
        # Always log to stdout for observability
        logger.info(f"Event: {event_type} | payload={payload} | user={user_id}")
        return event_data
    
    async def log_routine_used(
        self,
        routine_id: str,
        playbook_id: Optional[str] = None,
        user_id: Optional[str] = None,
        completed: bool = False,
    ) -> Dict[str, Any]:
        """Log when a routine is used."""
        return await self.log_event(
            event_type="routine_used",
            payload={
                "routine_id": routine_id,
                "playbook_id": playbook_id,
                "completed": completed,
            },
            user_id=user_id,
        )
    
    async def log_routine_repeated(
        self,
        routine_id: str,
        playbook_id: Optional[str] = None,
        user_id: Optional[str] = None,
    ) -> Dict[str, Any]:
        """Log when a routine is repeated (user clicked 'repeat')."""
        return await self.log_event(
            event_type="routine_repeated",
            payload={
                "routine_id": routine_id,
                "playbook_id": playbook_id,
            },
            user_id=user_id,
        )
    
    async def get_feedback_stats(
        self,
        days: int = 7,
    ) -> Dict[str, Any]:
        """Get feedback statistics."""
        if not self.supabase:
            return {"average_rating": None, "count": 0}
        
        try:
            result = self.supabase.table("user_feedback").select("rating, routine_id, playbook_id").execute()
            if result.data:
                ratings = [r["rating"] for r in result.data]
                
                # Group by routine
                routine_stats = {}
                for r in result.data:
                    rid = r.get("routine_id")
                    if rid:
                        if rid not in routine_stats:
                            routine_stats[rid] = {"ratings": [], "count": 0}
                        routine_stats[rid]["ratings"].append(r["rating"])
                        routine_stats[rid]["count"] += 1
                
                # Calculate averages
                for rid, stats in routine_stats.items():
                    stats["average"] = sum(stats["ratings"]) / len(stats["ratings"])
                    del stats["ratings"]
                
                return {
                    "average_rating": sum(ratings) / len(ratings),
                    "count": len(ratings),
                    "distribution": {
                        i: ratings.count(i) for i in range(1, 6)
                    },
                    "routine_stats": routine_stats,
                }
        except Exception as e:
            logger.error(f"Failed to get feedback stats: {e}")
        
        return {"average_rating": None, "count": 0}
    
    async def get_user_feedback_history(
        self,
        user_id: str,
        limit: int = 10,
    ) -> List[Dict[str, Any]]:
        """Get user's feedback history."""
        if not self.supabase:
            return []
        
        try:
            result = (
                self.supabase.table("user_feedback")
                .select("*")
                .eq("user_id", user_id)
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )
            return result.data or []
        except Exception as e:
            logger.error(f"Failed to get user feedback: {e}")
            return []


class ObservabilityService:
    """Service for structured logging and observability."""
    
    def __init__(self):
        self.logger = logging.getLogger("observability")
    
    def log_gemini_fallback(
        self,
        reason: str,
        original_error: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None,
    ):
        """Log when Gemini fallback is triggered."""
        self.logger.warning(
            f"Gemini fallback triggered: {reason}",
            extra={
                "event": "gemini_fallback",
                "reason": reason,
                "original_error": original_error,
                "context": context,
            }
        )
    
    def log_playbook_failure(
        self,
        playbook_id: str,
        stage: str,
        error: str,
        context: Optional[Dict[str, Any]] = None,
    ):
        """Log playbook execution failure."""
        self.logger.error(
            f"Playbook failure: {playbook_id} at {stage}",
            extra={
                "event": "playbook_failure",
                "playbook_id": playbook_id,
                "stage": stage,
                "error": error,
                "context": context,
            }
        )
    
    def log_resource_access(
        self,
        resource_id: str,
        resource_type: str,
        user_id: Optional[str] = None,
    ):
        """Log resource access."""
        self.logger.info(
            f"Resource accessed: {resource_type}/{resource_id}",
            extra={
                "event": "resource_access",
                "resource_id": resource_id,
                "resource_type": resource_type,
                "user_id": user_id,
            }
        )


feedback_service = FeedbackService()
observability_service = ObservabilityService()
