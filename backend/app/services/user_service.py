from datetime import datetime, timezone
from typing import Optional
from supabase import Client
from ..models.user import User, UserCreate


class UserService:
    """Service for user-related database operations."""

    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.table_name = "users"

    async def get_by_netlink_id(self, netlink_id: str) -> Optional[User]:
        """Get user by NetLink ID."""
        result = (
            self.supabase.table(self.table_name)
            .select("*")
            .eq("netlink_id", netlink_id.lower())
            .limit(1)
            .execute()
        )

        if not result.data:
            return None

        return User(**result.data[0])

    async def get_by_id(self, user_id: str) -> Optional[User]:
        """Get user by ID."""
        result = (
            self.supabase.table(self.table_name)
            .select("*")
            .eq("id", user_id)
            .limit(1)
            .execute()
        )

        if not result.data:
            return None

        return User(**result.data[0])

    async def create(self, user_data: UserCreate) -> User:
        """Create a new user."""
        now = datetime.now(timezone.utc).isoformat()

        data = {
            "netlink_id": user_data.netlink_id.lower(),
            "display_name": user_data.display_name,
            "created_at": now,
            "last_login_at": now,
        }

        result = self.supabase.table(self.table_name).insert(data).execute()
        return User(**result.data[0])

    async def update_last_login(self, user_id: str) -> None:
        """Update user's last login timestamp."""
        now = datetime.now(timezone.utc).isoformat()

        self.supabase.table(self.table_name).update({
            "last_login_at": now,
        }).eq("id", user_id).execute()

    async def get_or_create(
        self,
        netlink_id: str,
        display_name: Optional[str] = None
    ) -> User:
        """Get existing user or create new one."""
        user = await self.get_by_netlink_id(netlink_id)

        if user:
            await self.update_last_login(user.id)
            return user

        # Generate display name from netlink_id if not provided
        if not display_name:
            display_name = netlink_id.capitalize()

        return await self.create(UserCreate(
            netlink_id=netlink_id,
            display_name=display_name
        ))
