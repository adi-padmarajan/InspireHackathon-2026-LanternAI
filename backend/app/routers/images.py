"""
Images Router
API endpoints for background image customization
"""

from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Query, status
from typing import Optional

from ..auth.dependencies import get_current_user, TokenData
from ..services.image_service import ImageService
from ..models.schemas import ApiResponse
from ..models.image_settings import (
    BackgroundImage,
    ThemeBackgroundSettings,
    ImageUploadResponse,
    UnsplashSearchResponse,
    SaveSettingsRequest,
    SaveSettingsResponse,
    CuratedCategory,
)
from ..config.supabase import get_supabase_client

router = APIRouter(prefix="/images", tags=["images"])


def get_image_service() -> ImageService:
    """Dependency to get ImageService instance."""
    return ImageService(get_supabase_client())


# =============================================================================
# UNSPLASH ENDPOINTS
# =============================================================================

@router.get("/unsplash/search", response_model=UnsplashSearchResponse)
async def search_unsplash(
    query: str = Query(..., min_length=1, description="Search query"),
    page: int = Query(1, ge=1, description="Page number"),
    per_page: int = Query(20, ge=1, le=30, description="Results per page"),
    orientation: str = Query("landscape", description="Image orientation"),
    image_service: ImageService = Depends(get_image_service),
):
    """
    Search Unsplash for photos.
    Proxies the request to keep API key server-side.
    """
    try:
        results = await image_service.search_unsplash(
            query=query,
            page=page,
            per_page=per_page,
            orientation=orientation,
        )
        return results
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unsplash search failed: {str(e)}"
        )


@router.get("/unsplash/random", response_model=ApiResponse[list[BackgroundImage]])
async def get_random_unsplash(
    query: str = Query("nature", description="Query for random photos"),
    count: int = Query(10, ge=1, le=30, description="Number of photos"),
    image_service: ImageService = Depends(get_image_service),
):
    """Get random photos from Unsplash for initial display."""
    try:
        photos = await image_service.get_random_unsplash(query=query, count=count)

        # Convert to BackgroundImage format
        images = [
            BackgroundImage(
                id=photo.id,
                source="unsplash",
                url=photo.urls.regular,
                thumbnail_url=photo.urls.small,
                blur_hash=photo.blur_hash,
                attribution={
                    "photographer_name": photo.user.name,
                    "photographer_username": photo.user.username,
                    "photographer_url": photo.user.links.get("html", ""),
                    "unsplash_url": f"https://unsplash.com/photos/{photo.id}",
                },
                width=photo.width,
                height=photo.height,
            )
            for photo in photos
        ]

        return ApiResponse(success=True, data=images)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get random photos: {str(e)}"
        )


@router.post("/unsplash/track/{photo_id}")
async def track_unsplash_download(
    photo_id: str,
    image_service: ImageService = Depends(get_image_service),
):
    """
    Track download as required by Unsplash API guidelines.
    Call this when user selects an Unsplash image.
    """
    await image_service.track_unsplash_download(photo_id)
    return {"success": True}


# =============================================================================
# UPLOAD ENDPOINTS
# =============================================================================

@router.post("/upload", response_model=ApiResponse[ImageUploadResponse])
async def upload_image(
    file: UploadFile = File(...),
    current_user: TokenData = Depends(get_current_user),
    image_service: ImageService = Depends(get_image_service),
):
    """
    Upload an image to storage.
    - Validates file type (JPEG, PNG, WebP, GIF)
    - Validates file size (max 5MB)
    - Processes and optimizes image
    - Creates thumbnail
    - Returns URLs and metadata
    """
    # Validate content type
    if file.content_type not in ImageService.ALLOWED_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Allowed: JPEG, PNG, WebP, GIF"
        )

    try:
        # Read file content
        content = await file.read()

        # Validate size
        if len(content) > ImageService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File too large. Maximum size is 5MB."
            )

        # Upload and process
        result = await image_service.upload_image(
            user_id=current_user.user_id,
            file_content=content,
            content_type=file.content_type,
            original_filename=file.filename or "upload.jpg",
        )

        return ApiResponse(success=True, data=result)

    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Upload failed: {str(e)}"
        )


@router.delete("/upload/{image_id}", response_model=ApiResponse)
async def delete_uploaded_image(
    image_id: str,
    current_user: TokenData = Depends(get_current_user),
    image_service: ImageService = Depends(get_image_service),
):
    """Delete a user-uploaded image."""
    success = await image_service.delete_uploaded_image(
        user_id=current_user.user_id,
        image_id=image_id,
    )

    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found or access denied"
        )

    return ApiResponse(success=True, data=None)


@router.get("/user-uploads", response_model=ApiResponse[list[BackgroundImage]])
async def get_user_uploads(
    limit: int = Query(20, ge=1, le=100),
    current_user: TokenData = Depends(get_current_user),
    image_service: ImageService = Depends(get_image_service),
):
    """Get list of user's uploaded images."""
    images = await image_service.get_user_uploads(
        user_id=current_user.user_id,
        limit=limit,
    )

    return ApiResponse(success=True, data=images)


# =============================================================================
# CURATED IMAGES
# =============================================================================

@router.get("/curated", response_model=ApiResponse[list[BackgroundImage]])
async def get_curated_images(
    category: Optional[str] = Query(None, description="Category filter"),
    image_service: ImageService = Depends(get_image_service),
):
    """
    Get curated background images by category.
    Categories: nature, abstract, minimal, space, ocean, sunset, city, forest
    """
    images = await image_service.get_curated_images(category=category)
    return ApiResponse(success=True, data=images)


@router.get("/curated/categories", response_model=ApiResponse[list[CuratedCategory]])
async def get_curated_categories():
    """Get list of curated image categories."""
    categories = [
        CuratedCategory(id="nature", name="Nature", query="nature landscape", icon="Mountain"),
        CuratedCategory(id="abstract", name="Abstract", query="abstract gradient", icon="Palette"),
        CuratedCategory(id="minimal", name="Minimal", query="minimal clean", icon="Square"),
        CuratedCategory(id="space", name="Space", query="galaxy stars", icon="Sparkles"),
        CuratedCategory(id="ocean", name="Ocean", query="ocean waves", icon="Waves"),
        CuratedCategory(id="sunset", name="Sunset", query="sunset sunrise", icon="Sunrise"),
        CuratedCategory(id="city", name="City", query="city skyline", icon="Building2"),
        CuratedCategory(id="forest", name="Forest", query="forest trees", icon="TreePine"),
    ]

    return ApiResponse(success=True, data=categories)


# =============================================================================
# SETTINGS PERSISTENCE
# =============================================================================

@router.post("/settings", response_model=SaveSettingsResponse)
async def save_background_settings(
    request: SaveSettingsRequest,
    current_user: TokenData = Depends(get_current_user),
    image_service: ImageService = Depends(get_image_service),
):
    """Save user's background settings to database."""
    try:
        await image_service.save_background_settings(
            user_id=current_user.user_id,
            settings_data=request.settings,
        )
        return SaveSettingsResponse(success=True, message="Settings saved successfully")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save settings: {str(e)}"
        )


@router.get("/settings", response_model=ApiResponse[Optional[ThemeBackgroundSettings]])
async def get_background_settings(
    current_user: TokenData = Depends(get_current_user),
    image_service: ImageService = Depends(get_image_service),
):
    """Get user's background settings."""
    settings = await image_service.get_background_settings(
        user_id=current_user.user_id,
    )

    return ApiResponse(success=True, data=settings)
