"""Authentication schemas."""

from typing import Optional

from pydantic import BaseModel


class OAuthInitiateRequest(BaseModel):
    """Request to initiate OAuth flow."""

    provider: str
    redirect_uri: str


class OAuthInitiateResponse(BaseModel):
    """Response with OAuth authorization URL."""

    authorization_url: str
    state: str


class OAuthCallbackRequest(BaseModel):
    """OAuth callback request."""

    code: str
    state: str
    provider: str


class OAuthCallbackResponse(BaseModel):
    """OAuth callback response with access token."""

    access_token: str
    token_type: str = "bearer"
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None


class TokenResponse(BaseModel):
    """Token response."""

    access_token: str
    token_type: str = "bearer"
