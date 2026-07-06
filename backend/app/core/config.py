from typing import List
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    project_name: str = "Reaproveita"
    api_version: str = "0.1.0"
    api_prefix: str = "/api"
    environment: str = "development"
    cors_origins: List[str] = ["http://localhost:5173"]
    database_url: str = "sqlite:///./reaproveita.db"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    @field_validator("cors_origins", mode="before")
    @classmethod
    def split_cors(cls, v):
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(",")]
        return v


settings = Settings()