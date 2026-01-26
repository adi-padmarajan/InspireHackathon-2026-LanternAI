"""
Image Settings Models
Pydantic models for background image customization
"""

from pydantic import BaseModel, Field
from typing import Optional, Dict, Literal
from datetime import datetime


# ============================================================================
# CORE MODELS
# ============================================================================

class ImagePosition(BaseModel):
    """Position for background image focal point"""
    x: float = Field(50, ge=0, le=100, description="Horizontal position (0-100%)")
    y: float = Field(50, ge=0, le=100, description="Vertical position (0-100%)")


class UnsplashAttribution(BaseModel):
    """Attribution data for Unsplash images (required by API guidelines)"""
    photographer_name: str
    photographer_username: str
    photographer_url: str
    unsplash_url: str


class BackgroundImage(BaseModel):
    """Background image data"""
    id: str
    source: Literal['unsplash', 'upload', 'curated', 'none']
    url: str
    thumbnail_url: Optional[str] = None
    blur_hash: Optional[str] = None
    attribution: Optional[UnsplashAttribution] = None
    uploaded_at: Optional[datetime] = None
    width: int
    height: int


class BackgroundSettings(BaseModel):
    """Settings for a single background"""
    enabled: bool = False
    image: Optional[BackgroundImage] = None
    position: ImagePosition = Field(default_factory=ImagePosition)
    overlay_opacity: int = Field(40, ge=0, le=100, description="Overlay opacity (0-100)")
    overlay_color: Literal['theme', 'dark', 'light', 'custom'] = "theme"
    custom_overlay_color: Optional[str] = None
    blur: int = Field(0, ge=0, le=20, description="Blur amount in pixels")
    brightness: int = Field(100, ge=50, le=150, description="Brightness percentage")
    saturation: int = Field(100, ge=0, le=200, description="Saturation percentage")


class ThemeBackgroundSettings(BaseModel):
    """Complete background settings with global and per-theme options"""
    use_global_background: bool = True
    global_background: Optional[BackgroundSettings] = None
    theme_backgrounds: Dict[str, BackgroundSettings] = Field(default_factory=dict)


# ============================================================================
# API REQUEST/RESPONSE MODELS
# ============================================================================

class ImageUploadResponse(BaseModel):
    """Response after successful image upload"""
    id: str
    url: str
    thumbnail_url: str
    width: int
    height: int
    file_size: int
    mime_type: str


class UnsplashPhotoUrls(BaseModel):
    """Unsplash image URLs at different sizes"""
    raw: str
    full: str
    regular: str
    small: str
    thumb: str


class UnsplashUser(BaseModel):
    """Unsplash photographer data"""
    id: str
    username: str
    name: str
    links: Dict[str, str]


class UnsplashPhoto(BaseModel):
    """Single Unsplash photo"""
    id: str
    created_at: str
    width: int
    height: int
    color: str
    blur_hash: Optional[str] = None
    description: Optional[str] = None
    alt_description: Optional[str] = None
    urls: UnsplashPhotoUrls
    user: UnsplashUser


class UnsplashSearchResponse(BaseModel):
    """Unsplash search API response"""
    total: int
    total_pages: int
    results: list[UnsplashPhoto]


class CuratedCategory(BaseModel):
    """Curated image category"""
    id: str
    name: str
    query: str
    icon: str


class SaveSettingsRequest(BaseModel):
    """Request to save background settings"""
    settings: ThemeBackgroundSettings


class SaveSettingsResponse(BaseModel):
    """Response after saving settings"""
    success: bool
    message: str
