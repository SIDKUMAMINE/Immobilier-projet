from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    """Configuration de l'application SABBAR"""
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_KEY: str

    # ✅ ANTHROPIC CLAUDE API - ACTIF
    ANTHROPIC_API_KEY: str = Field(..., env="ANTHROPIC_API_KEY")

    # API CONFIGURATION
    PROJECT_NAME: str = "SABBAR API"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # AUTHENTIFICATION JWT
    SECRET_KEY: str = Field(..., env="SECRET_KEY")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:8000"]

    # ✅ AGENT IA CONFIGURATION (Claude)
    LLM_MODEL: str = "claude-3-5-sonnet-20241022"
    LLM_MAX_TOKENS: int = 2000
    LLM_TEMPERATURE: float = 0.7

    # PYDANTIC CONFIGURATION
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True
    )


settings = Settings()