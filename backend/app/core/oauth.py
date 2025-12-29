"""OAuth configuration and utilities."""

import secrets
from typing import Any, Dict, Optional
from urllib.parse import urlencode

from app.core.config import settings


def get_oauth_provider_config(provider: str) -> Optional[Dict[str, Any]]:
    """Get OAuth configuration for a provider."""
    backend_url = "http://localhost:8000"

    configs: Dict[str, Dict[str, Any]] = {
        "google": {
            "authorization_url": ("https://accounts.google.com/o/oauth2/v2/auth"),
            "token_url": "https://oauth2.googleapis.com/token",
            "userinfo_url": ("https://www.googleapis.com/oauth2/v2/userinfo"),
            "client_id": settings.GOOGLE_CLIENT_ID or "",
            "client_secret": settings.GOOGLE_CLIENT_SECRET or "",
            "redirect_uri": f"{backend_url}/api/v1/auth/callback/google",
            "scope": "openid email profile",
        },
        "facebook": {
            "authorization_url": ("https://www.facebook.com/v18.0/dialog/oauth"),
            "token_url": ("https://graph.facebook.com/v18.0/oauth/access_token"),
            "userinfo_url": ("https://graph.facebook.com/me?fields=id,name,email"),
            "client_id": settings.FACEBOOK_CLIENT_ID or "",
            "client_secret": settings.FACEBOOK_CLIENT_SECRET or "",
            "redirect_uri": f"{backend_url}/api/v1/auth/callback/facebook",
            "scope": "email public_profile",
        },
        "apple": {
            "authorization_url": "https://appleid.apple.com/auth/authorize",
            "token_url": "https://appleid.apple.com/auth/token",
            "userinfo_url": None,  # Apple provides user info in ID token
            "client_id": settings.APPLE_CLIENT_ID or "",
            "client_secret": settings.APPLE_CLIENT_SECRET or "",
            "redirect_uri": f"{backend_url}/api/v1/auth/callback/apple",
            "scope": "email name",
        },
    }
    return configs.get(provider)


def generate_state() -> str:
    """Generate a random state for OAuth flow."""
    return secrets.token_urlsafe(32)


def build_authorization_url(
    provider: str, state: str, redirect_uri: str
) -> Optional[str]:
    """Build OAuth authorization URL."""
    config = get_oauth_provider_config(provider)
    if not config or not config["client_id"]:
        return None

    params = {
        "client_id": config["client_id"],
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": config["scope"],
        "state": state,
    }

    if provider == "apple":
        params["response_mode"] = "form_post"

    return f"{config['authorization_url']}?{urlencode(params)}"
