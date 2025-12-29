"""Current time endpoint."""

from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Depends, Header, HTTPException

from app.schemas.current_time import CurrentTimeRequest, CurrentTimeResponse

router = APIRouter()


def get_user_email(authorization: Optional[str] = Header(None)) -> Optional[str]:
    """Extract user email from authorization token."""
    if not authorization:
        return None

    # For now, we'll use a simple mock token format
    # In production, this would decode a JWT token
    if authorization.startswith("Bearer mock_token_"):
        # Extract email from mock token format: mock_token_provider_timestamp
        # For demo, we'll return a mock email based on the token
        parts = authorization.replace("Bearer ", "").split("_")
        if len(parts) >= 3:
            provider = parts[2]
            return f"user@{provider}.com"
    return None


@router.post("/current_time", response_model=CurrentTimeResponse)
async def get_current_time(
    request: CurrentTimeRequest,
    email: Optional[str] = Depends(get_user_email),
) -> CurrentTimeResponse:
    """
    Get current time for a given timezone.

    - **timezone**: Timezone identifier (e.g., 'America/New_York', 'UTC')
    - Returns current time in ISO format
    - If authenticated, includes user email in response
    """
    try:
        # Get current time in the specified timezone
        from zoneinfo import ZoneInfo

        now = datetime.now(ZoneInfo(request.timezone))
        current_time_str = now.isoformat()
    except Exception as e:
        raise HTTPException(
            status_code=400, detail=f"Invalid timezone: {str(e)}"
        ) from e

    return CurrentTimeResponse(
        current_time=current_time_str,
        timezone=request.timezone,
        email=email,
    )
