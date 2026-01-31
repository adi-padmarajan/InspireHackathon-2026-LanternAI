from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional
import os

security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Verify JWT token and return user info."""
    from app.config import get_supabase_client
    
    try:
        supabase = get_supabase_client()
        token = credentials.credentials
        
        # Verify the JWT with Supabase
        user_response = supabase.auth.get_user(token)
        
        if user_response and user_response.user:
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "sub": user_response.user.id,
            }
        
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Authentication failed: {str(e)}",
        )


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security)
) -> Optional[dict]:
    """Optionally verify JWT token - returns None if not authenticated."""
    if not credentials:
        return None
    
    try:
        from app.config import get_supabase_client
        
        supabase = get_supabase_client()
        token = credentials.credentials
        
        user_response = supabase.auth.get_user(token)
        
        if user_response and user_response.user:
            return {
                "id": user_response.user.id,
                "email": user_response.user.email,
                "sub": user_response.user.id,
            }
    except Exception:
        pass
    
    return None
