"""
Image Service
Handles image upload, storage, and Unsplash API integration
"""

import httpx
import uuid
import io
from datetime import datetime, timezone
from typing import Optional
from supabase import Client
from PIL import Image

from ..config import settings
from ..models.image_settings import (
    BackgroundImage,
    ThemeBackgroundSettings,
    ImageUploadResponse,
    UnsplashPhoto,
    UnsplashSearchResponse,
)


class ImageService:
    """Service for image operations including upload, storage, and Unsplash API."""

    BUCKET_NAME = "user-backgrounds"
    MAX_WIDTH = 2560  # Max image width after resize
    THUMBNAIL_WIDTH = 400
    ALLOWED_TYPES = {"image/jpeg", "image/png", "image/webp", "image/gif"}
    MAX_FILE_SIZE = 5 * 1024 * 1024  # 5MB

    def __init__(self, supabase: Client):
        self.supabase = supabase
        self.unsplash_base_url = "https://api.unsplash.com"
        self.table_name = "user_background_settings"
        self.uploads_table = "user_uploaded_images"

    # =========================================================================
    # UNSPLASH API
    # =========================================================================

    async def search_unsplash(
        self,
        query: str,
        page: int = 1,
        per_page: int = 20,
        orientation: str = "landscape"
    ) -> UnsplashSearchResponse:
        """Search Unsplash for photos."""
        if not settings.unsplash_access_key:
            # Return empty results if no API key configured
            return UnsplashSearchResponse(total=0, total_pages=0, results=[])

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.unsplash_base_url}/search/photos",
                params={
                    "query": query,
                    "page": page,
                    "per_page": per_page,
                    "orientation": orientation,
                },
                headers={
                    "Authorization": f"Client-ID {settings.unsplash_access_key}",
                    "Accept-Version": "v1",
                },
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()

            return UnsplashSearchResponse(
                total=data.get("total", 0),
                total_pages=data.get("total_pages", 0),
                results=[UnsplashPhoto(**photo) for photo in data.get("results", [])],
            )

    async def get_random_unsplash(
        self,
        query: str = "nature",
        count: int = 10
    ) -> list[UnsplashPhoto]:
        """Get random photos from Unsplash."""
        if not settings.unsplash_access_key:
            return []

        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.unsplash_base_url}/photos/random",
                params={
                    "query": query,
                    "count": min(count, 30),  # Unsplash max is 30
                    "orientation": "landscape",
                },
                headers={
                    "Authorization": f"Client-ID {settings.unsplash_access_key}",
                    "Accept-Version": "v1",
                },
                timeout=10.0,
            )
            response.raise_for_status()
            data = response.json()

            # Response is a list when count > 1
            if isinstance(data, list):
                return [UnsplashPhoto(**photo) for photo in data]
            return [UnsplashPhoto(**data)]

    async def track_unsplash_download(self, photo_id: str) -> None:
        """Track download as required by Unsplash API guidelines."""
        if not settings.unsplash_access_key:
            return

        try:
            async with httpx.AsyncClient() as client:
                await client.get(
                    f"{self.unsplash_base_url}/photos/{photo_id}/download",
                    headers={
                        "Authorization": f"Client-ID {settings.unsplash_access_key}",
                    },
                    timeout=5.0,
                )
        except Exception:
            # Non-critical, just log and continue
            pass

    # =========================================================================
    # IMAGE UPLOAD
    # =========================================================================

    def _resize_image(self, image: Image.Image, max_width: int) -> Image.Image:
        """Resize image maintaining aspect ratio."""
        if image.width <= max_width:
            return image

        ratio = max_width / image.width
        new_height = int(image.height * ratio)
        return image.resize((max_width, new_height), Image.Resampling.LANCZOS)

    def _process_image(self, file_content: bytes, content_type: str) -> tuple[bytes, bytes, int, int]:
        """
        Process uploaded image: resize and create thumbnail.
        Returns: (processed_image, thumbnail, width, height)
        """
        # Open image
        image = Image.open(io.BytesIO(file_content))

        # Convert to RGB if necessary (for PNG with transparency)
        if image.mode in ('RGBA', 'P'):
            background = Image.new('RGB', image.size, (255, 255, 255))
            if image.mode == 'P':
                image = image.convert('RGBA')
            background.paste(image, mask=image.split()[-1] if image.mode == 'RGBA' else None)
            image = background

        # Resize main image
        processed = self._resize_image(image, self.MAX_WIDTH)
        width, height = processed.size

        # Create thumbnail
        thumbnail = self._resize_image(image, self.THUMBNAIL_WIDTH)

        # Save to bytes (WebP for better compression)
        main_buffer = io.BytesIO()
        processed.save(main_buffer, format='WEBP', quality=90)
        main_bytes = main_buffer.getvalue()

        thumb_buffer = io.BytesIO()
        thumbnail.save(thumb_buffer, format='WEBP', quality=85)
        thumb_bytes = thumb_buffer.getvalue()

        return main_bytes, thumb_bytes, width, height

    async def upload_image(
        self,
        user_id: str,
        file_content: bytes,
        content_type: str,
        original_filename: str
    ) -> ImageUploadResponse:
        """
        Upload and process an image.
        Returns the uploaded image metadata.
        """
        # Validate content type
        if content_type not in self.ALLOWED_TYPES:
            raise ValueError(f"Invalid file type: {content_type}")

        # Validate file size
        if len(file_content) > self.MAX_FILE_SIZE:
            raise ValueError("File too large. Maximum size is 5MB.")

        # Process image
        processed_bytes, thumb_bytes, width, height = self._process_image(
            file_content, content_type
        )

        # Generate unique filename
        image_id = str(uuid.uuid4())
        main_path = f"{user_id}/originals/{image_id}.webp"
        thumb_path = f"{user_id}/thumbnails/{image_id}_thumb.webp"

        # Upload to Supabase Storage
        self.supabase.storage.from_(self.BUCKET_NAME).upload(
            path=main_path,
            file=processed_bytes,
            file_options={"content-type": "image/webp"}
        )

        self.supabase.storage.from_(self.BUCKET_NAME).upload(
            path=thumb_path,
            file=thumb_bytes,
            file_options={"content-type": "image/webp"}
        )

        # Get public URLs
        main_url = self.supabase.storage.from_(self.BUCKET_NAME).get_public_url(main_path)
        thumb_url = self.supabase.storage.from_(self.BUCKET_NAME).get_public_url(thumb_path)

        # Store metadata in database
        now = datetime.now(timezone.utc).isoformat()
        self.supabase.table(self.uploads_table).insert({
            "id": image_id,
            "user_id": user_id,
            "storage_path": main_path,
            "thumbnail_path": thumb_path,
            "width": width,
            "height": height,
            "file_size": len(processed_bytes),
            "mime_type": "image/webp",
            "created_at": now,
        }).execute()

        return ImageUploadResponse(
            id=image_id,
            url=main_url,
            thumbnail_url=thumb_url,
            width=width,
            height=height,
            file_size=len(processed_bytes),
            mime_type="image/webp",
        )

    async def delete_uploaded_image(self, user_id: str, image_id: str) -> bool:
        """Delete an uploaded image."""
        # Verify ownership
        result = self.supabase.table(self.uploads_table).select("*").eq(
            "id", image_id
        ).eq("user_id", user_id).execute()

        if not result.data:
            return False

        image_data = result.data[0]

        # Delete from storage
        try:
            self.supabase.storage.from_(self.BUCKET_NAME).remove([
                image_data["storage_path"],
                image_data["thumbnail_path"],
            ])
        except Exception:
            pass  # Continue even if storage delete fails

        # Delete from database
        self.supabase.table(self.uploads_table).delete().eq("id", image_id).execute()

        return True

    async def get_user_uploads(self, user_id: str, limit: int = 20) -> list[BackgroundImage]:
        """Get list of user's uploaded images."""
        result = self.supabase.table(self.uploads_table).select("*").eq(
            "user_id", user_id
        ).order("created_at", desc=True).limit(limit).execute()

        images = []
        for row in result.data:
            main_url = self.supabase.storage.from_(self.BUCKET_NAME).get_public_url(
                row["storage_path"]
            )
            thumb_url = self.supabase.storage.from_(self.BUCKET_NAME).get_public_url(
                row["thumbnail_path"]
            )

            images.append(BackgroundImage(
                id=row["id"],
                source="upload",
                url=main_url,
                thumbnail_url=thumb_url,
                uploaded_at=row["created_at"],
                width=row["width"],
                height=row["height"],
            ))

        return images

    # =========================================================================
    # SETTINGS PERSISTENCE
    # =========================================================================

    async def save_background_settings(
        self,
        user_id: str,
        settings_data: ThemeBackgroundSettings
    ) -> bool:
        """Save user's background settings."""
        now = datetime.now(timezone.utc).isoformat()

        # Check if settings exist
        existing = self.supabase.table(self.table_name).select("id").eq(
            "user_id", user_id
        ).execute()

        data = {
            "use_global_background": settings_data.use_global_background,
            "global_background": settings_data.global_background.model_dump() if settings_data.global_background else None,
            "theme_backgrounds": {k: v.model_dump() for k, v in settings_data.theme_backgrounds.items()},
            "updated_at": now,
        }

        if existing.data:
            # Update existing
            self.supabase.table(self.table_name).update(data).eq(
                "user_id", user_id
            ).execute()
        else:
            # Insert new
            data["user_id"] = user_id
            data["created_at"] = now
            self.supabase.table(self.table_name).insert(data).execute()

        return True

    async def get_background_settings(self, user_id: str) -> Optional[ThemeBackgroundSettings]:
        """Get user's background settings."""
        result = self.supabase.table(self.table_name).select("*").eq(
            "user_id", user_id
        ).execute()

        if not result.data:
            return None

        row = result.data[0]

        # Reconstruct settings
        from ..models.image_settings import BackgroundSettings

        global_bg = None
        if row.get("global_background"):
            global_bg = BackgroundSettings(**row["global_background"])

        theme_bgs = {}
        if row.get("theme_backgrounds"):
            for theme_id, bg_data in row["theme_backgrounds"].items():
                theme_bgs[theme_id] = BackgroundSettings(**bg_data)

        return ThemeBackgroundSettings(
            use_global_background=row.get("use_global_background", True),
            global_background=global_bg,
            theme_backgrounds=theme_bgs,
        )

    # =========================================================================
    # CURATED IMAGES
    # =========================================================================

    async def get_curated_images(self, category: Optional[str] = None) -> list[BackgroundImage]:
        """
        Get curated background images.
        Uses Unsplash random endpoint with predefined queries.
        """
        categories = {
            "nature": "nature landscape mountains forest",
            "abstract": "abstract gradient colorful art",
            "minimal": "minimal clean white simple aesthetic",
            "space": "galaxy stars nebula cosmos night sky",
            "ocean": "ocean waves beach sea coast",
            "sunset": "sunset sunrise golden hour clouds",
            "city": "city skyline architecture urban night",
            "forest": "forest trees woods green nature",
        }

        query = categories.get(category, "wallpaper background aesthetic") if category else "wallpaper background aesthetic"

        photos = await self.get_random_unsplash(query=query, count=12)

        return [
            BackgroundImage(
                id=photo.id,
                source="curated",
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
