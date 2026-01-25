from datetime import datetime, timedelta, timezone
from typing import Optional
from jose import jwt, JWTError
from pydantic import BaseModel
from ..config.settings import settings


class TokenData(BaseModel):
    """Data extracted from a validated JWT token."""
    user_id: str
    netlink_id: str
    exp: datetime


def create_access_token(user_id: str, netlink_id: str) -> str:
    """Create a new JWT access token."""
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.jwt_expire_minutes
    )

    payload = {
        "sub": user_id,
        "netlink_id": netlink_id,
        "exp": expire,
        "iat": datetime.now(timezone.utc),
    }

    return jwt.encode(
        payload,
        settings.jwt_secret_key,
        algorithm=settings.jwt_algorithm
    )


def verify_token(token: str) -> Optional[TokenData]:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(
            token,
            settings.jwt_secret_key,
            algorithms=[settings.jwt_algorithm]
        )

        user_id = payload.get("sub")
        netlink_id = payload.get("netlink_id")
        exp = payload.get("exp")

        if not user_id or not netlink_id:
            return None

        return TokenData(
            user_id=user_id,
            netlink_id=netlink_id,
            exp=datetime.fromtimestamp(exp, tz=timezone.utc)
        )
    except JWTError:
        return None
