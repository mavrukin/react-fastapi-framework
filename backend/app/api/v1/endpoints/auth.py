"""OAuth authentication endpoints."""

import base64
import json
from typing import Optional

import httpx
from fastapi import APIRouter, HTTPException, Query
from fastapi.responses import RedirectResponse

from app.core.oauth import (
    build_authorization_url,
    generate_state,
    get_oauth_provider_config,
)
from app.core.security import create_access_token
from app.schemas.auth import OAuthInitiateResponse

router = APIRouter()

# Store states temporarily (in production, use Redis or similar)
oauth_states: dict[str, dict] = {}


@router.get("/auth/initiate/{provider}", response_model=OAuthInitiateResponse)
async def initiate_oauth(
    provider: str,
    frontend_redirect_uri: str = Query(
        default="http://localhost:3000/auth/callback",
        description="Frontend redirect URI after OAuth completes",
    ),
):
    """Initiate OAuth flow for a provider."""
    if provider not in ["google", "facebook", "apple"]:
        raise HTTPException(status_code=400, detail="Invalid provider")

    config = get_oauth_provider_config(provider)
    if not config:
        raise HTTPException(
            status_code=400, detail=f"Invalid OAuth provider: {provider}"
        )
    if not config.get("client_id"):
        provider_upper = provider.upper()
        detail_msg = (
            f"{provider.capitalize()} OAuth is not configured. "
            f"Please set {provider_upper}_CLIENT_ID and "
            f"{provider_upper}_CLIENT_SECRET in your .env file."
        )
        raise HTTPException(status_code=503, detail=detail_msg)

    state = generate_state()
    # Use backend callback URL for OAuth provider redirect
    backend_redirect_uri = config["redirect_uri"]
    authorization_url = build_authorization_url(provider, state, backend_redirect_uri)

    if not authorization_url:
        raise HTTPException(status_code=500, detail="Failed to build authorization URL")

    # Store state with provider info and frontend redirect
    oauth_states[state] = {
        "provider": provider,
        "frontend_redirect_uri": frontend_redirect_uri,
    }

    return OAuthInitiateResponse(authorization_url=authorization_url, state=state)


@router.get("/auth/callback/{provider}")
async def oauth_callback(
    provider: str,
    code: Optional[str] = Query(None),
    state: Optional[str] = Query(None),
    error: Optional[str] = Query(None),
):
    """Handle OAuth callback from provider."""
    if error:
        return RedirectResponse(
            url=f"http://localhost:3000/auth/callback?error={error}"
        )

    if not code or not state:
        error_url = "http://localhost:3000/auth/callback?error=missing_code_or_state"
        return RedirectResponse(url=error_url)

    # Verify state
    if state not in oauth_states:
        return RedirectResponse(
            url="http://localhost:3000/auth/callback?error=invalid_state"
        )

    state_data = oauth_states.pop(state)
    if state_data["provider"] != provider:
        return RedirectResponse(
            url="http://localhost:3000/auth/callback?error=provider_mismatch"
        )

    config = get_oauth_provider_config(provider)
    if not config:
        error_url = "http://localhost:3000/auth/callback?error=config_error"
        return RedirectResponse(url=error_url)

    # Exchange code for access token
    try:
        token_data = await exchange_code_for_token(provider, code, config)
        user_info = await get_user_info(provider, token_data, config)

        # Create JWT token
        jwt_token = create_access_token(
            data={"email": user_info["email"], "provider": provider}
        )

        # Redirect to frontend with token
        frontend_redirect_uri = state_data.get(
            "frontend_redirect_uri", "http://localhost:3000/auth/callback"
        )
        user_name = user_info.get("name", "")
        redirect_url = (
            f"{frontend_redirect_uri}?token={jwt_token}"
            f"&email={user_info['email']}&name={user_name}"
        )
        return RedirectResponse(url=redirect_url)
    except Exception as e:
        return RedirectResponse(
            url=f"http://localhost:3000/auth/callback?error={str(e)}"
        )


async def exchange_code_for_token(provider: str, code: str, config: dict) -> dict:
    """Exchange authorization code for access token."""
    token_data = {
        "code": code,
        "client_id": config["client_id"],
        "client_secret": config["client_secret"],
        "redirect_uri": config["redirect_uri"],
    }

    if provider == "google":
        token_data["grant_type"] = "authorization_code"
    elif provider == "facebook":
        token_data["grant_type"] = "authorization_code"
    elif provider == "apple":
        token_data["grant_type"] = "authorization_code"

    async with httpx.AsyncClient() as client:
        response = await client.post(
            config["token_url"],
            data=token_data,
            headers={"Accept": "application/json"},
        )
        response.raise_for_status()
        return response.json()


async def get_user_info(provider: str, token_data: dict, config: dict) -> dict:
    """Get user information from OAuth provider."""
    access_token = token_data.get("access_token")

    if provider == "apple":
        # Apple provides user info in ID token
        id_token = token_data.get("id_token", "")
        if id_token:
            # Decode JWT (simplified - in production, verify signature)
            parts = id_token.split(".")
            if len(parts) >= 2:
                payload = json.loads(
                    base64.urlsafe_b64decode(parts[1] + "==").decode("utf-8")
                )
                return {
                    "email": payload.get("email", ""),
                    "name": payload.get("name", {}).get("fullName", ""),
                }

    if not config["userinfo_url"] or not access_token:
        raise ValueError("Unable to get user info")

    async with httpx.AsyncClient() as client:
        headers = {"Authorization": f"Bearer {access_token}"}
        response = await client.get(config["userinfo_url"], headers=headers)
        response.raise_for_status()
        data = response.json()

        if provider == "google":
            return {
                "email": data.get("email", ""),
                "name": data.get("name", ""),
                "picture": data.get("picture"),
            }
        elif provider == "facebook":
            return {
                "email": data.get("email", ""),
                "name": data.get("name", ""),
                "picture": (
                    data.get("picture", {}).get("data", {}).get("url")
                    if isinstance(data.get("picture"), dict)
                    else None
                ),
            }

    raise ValueError("Unable to parse user info")
