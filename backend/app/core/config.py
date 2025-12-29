"""Application configuration settings."""

from typing import List, Optional, Union

from pydantic import AnyHttpUrl, field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings."""

    PROJECT_NAME: str = "Reach FastAPI Framework"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # CORS - use Union to allow string input from .env, then convert to List[AnyHttpUrl]
    BACKEND_CORS_ORIGINS: Union[str, List[AnyHttpUrl]] = [
        AnyHttpUrl("http://localhost:3000"),  # React dev server
        AnyHttpUrl("http://localhost:8000"),  # FastAPI dev server
    ]

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(
        cls, v: Union[str, List[str], List[AnyHttpUrl]]
    ) -> List[AnyHttpUrl]:
        """Convert CORS origins to List[AnyHttpUrl] format."""
        if isinstance(v, str):
            # Handle comma-separated string from .env file
            return [
                AnyHttpUrl(origin.strip()) for origin in v.split(",") if origin.strip()
            ]
        elif isinstance(v, list):
            # Convert list of strings to list of AnyHttpUrl
            result = []
            for item in v:
                if isinstance(item, str):
                    result.append(AnyHttpUrl(item))
                elif isinstance(item, AnyHttpUrl):
                    result.append(item)
            return result
        return v

    # Database
    DATABASE_URL: str = "sqlite:///./app.db"
    DATABASE_ECHO: bool = False

    # MySQL specific settings (optional, used when DATABASE_URL contains mysql)
    MYSQL_HOST: Optional[str] = None
    MYSQL_PORT: int = 3306
    MYSQL_USER: Optional[str] = None
    MYSQL_PASSWORD: Optional[str] = None
    MYSQL_DATABASE: Optional[str] = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
    )


settings = Settings()
