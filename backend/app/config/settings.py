from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Server
    app_name: str = "Lantern API"
    debug: bool = False

    # CORS
    cors_origins: list[str] = ["http://localhost:5173"]

    # Supabase
    supabase_url: str = ""
    supabase_anon_key: str = ""

    # AI Provider
    gemini_api_key: str = ""

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
