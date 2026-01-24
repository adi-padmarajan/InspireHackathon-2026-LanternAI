from supabase import create_client, Client
from .settings import settings


def get_supabase_client() -> Client:
    if not settings.supabase_url or not settings.supabase_anon_key:
        raise ValueError("Supabase URL and anon key must be configured")

    return create_client(settings.supabase_url, settings.supabase_anon_key)
