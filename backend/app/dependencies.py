from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import Optional

from app.auth.jwt_handler import verify_token, TokenData

security = HTTPBearer()
optional_security = HTTPBearer(auto_error=False)


def _token_to_user(token_data: TokenData) -> dict:
    return {
        "id": token_data.user_id,
        "sub": token_data.user_id,
        "netlink_id": token_data.netlink_id,
    }


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Verify Lantern JWT token and return user info."""
    token_data = verify_token(credentials.credentials)
    if not token_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
        )
    return _token_to_user(token_data)


async def get_optional_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(optional_security),
) -> Optional[dict]:
    """Optionally verify Lantern JWT token - returns None if not authenticated."""
    if not credentials:
        return None

    token_data = verify_token(credentials.credentials)
    if not token_data:
        return None

    return _token_to_user(token_data)
