from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional


class UserBase(BaseModel):
    """Base user model with common fields."""
    netlink_id: str = Field(..., min_length=1, max_length=50)
    display_name: Optional[str] = Field(None, max_length=255)


class UserCreate(UserBase):
    """Model for creating a new user."""
    pass


class UserLogin(BaseModel):
    """Model for login request."""
    netlink_id: str = Field(..., min_length=1, max_length=50, description="UVic NetLink ID")


class User(UserBase):
    """Full user model with all fields."""
    id: str
    created_at: datetime
    last_login_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    """User response model (safe for API responses)."""
    id: str
    netlink_id: str
    display_name: Optional[str] = None


class AuthResponse(BaseModel):
    """Response model for successful authentication."""
    access_token: str
    token_type: str = "bearer"
    user: UserResponse
