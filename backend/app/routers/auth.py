from fastapi import APIRouter, HTTPException, Depends, status
from ..auth.jwt_handler import create_access_token
from ..auth.dependencies import get_current_user, TokenData
from ..services.user_service import UserService
from ..models.schemas import ApiResponse
from ..models.user import UserLogin, UserResponse, AuthResponse
from ..config.supabase import get_supabase_client

router = APIRouter(prefix="/auth", tags=["authentication"])


def get_user_service() -> UserService:
    """Dependency to get UserService instance."""
    return UserService(get_supabase_client())


@router.post("/login", response_model=AuthResponse)
async def login(
    body: UserLogin,
    user_service: UserService = Depends(get_user_service)
):
    """
    Login with NetLink ID (Demo Mode).
    Creates user if not exists, returns JWT token.
    """
    try:
        # Get or create user
        user = await user_service.get_or_create(
            netlink_id=body.netlink_id
        )

        # Create JWT token
        access_token = create_access_token(
            user_id=str(user.id),
            netlink_id=user.netlink_id
        )

        return AuthResponse(
            access_token=access_token,
            token_type="bearer",
            user=UserResponse(
                id=str(user.id),
                netlink_id=user.netlink_id,
                display_name=user.display_name
            )
        )

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Login failed: {str(e)}"
        )


@router.get("/me", response_model=ApiResponse[UserResponse])
async def get_current_user_info(
    current_user: TokenData = Depends(get_current_user),
    user_service: UserService = Depends(get_user_service)
):
    """Get current authenticated user's info."""
    user = await user_service.get_by_id(current_user.user_id)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )

    return ApiResponse(
        success=True,
        data=UserResponse(
            id=str(user.id),
            netlink_id=user.netlink_id,
            display_name=user.display_name
        )
    )


@router.post("/logout")
async def logout():
    """
    Logout endpoint (client-side token removal).
    In demo mode, just returns success - client handles token removal.
    """
    return {"success": True, "message": "Logged out successfully"}
