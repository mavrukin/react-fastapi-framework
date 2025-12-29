"""Schemas for current time endpoint."""

from pydantic import BaseModel, Field


class CurrentTimeRequest(BaseModel):
    """Request schema for current time endpoint."""

    timezone: str = Field(
        ..., description="Timezone identifier (e.g., 'America/New_York')"
    )


class CurrentTimeResponse(BaseModel):
    """Response schema for current time endpoint."""

    current_time: str = Field(..., description="Current time in ISO format")
    timezone: str = Field(..., description="Timezone used")
    email: str | None = Field(None, description="User email if authenticated")
