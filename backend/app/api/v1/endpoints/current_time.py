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

    # Extract token from Bearer header
    if authorization.startswith("Bearer "):
        token = authorization.replace("Bearer ", "")
        # Try to decode as JWT token
        from app.core.security import get_user_email_from_token

        email = get_user_email_from_token(token)
        if email:
            return email

        # Fallback: support old mock token format for backward compatibility
        if token.startswith("mock_token_"):
            parts = token.split("_")
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
