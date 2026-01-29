from pydantic_settings import BaseSettings
from functools import lru_cache
import secrets


class Settings(BaseSettings):
    # Server
    app_name: str = "Lantern API"
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["http://localhost:5173", "http://localhost:8080", "http://localhost:8081"]

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # Google AI (Gemini) API
    google_ai_api_key: str = ""

    # Unsplash API
    unsplash_access_key: str = ""

    # JWT Authentication
    jwt_secret_key: str = secrets.token_hex(32)  # Generate default if not set
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 1440  # 24 hours

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
