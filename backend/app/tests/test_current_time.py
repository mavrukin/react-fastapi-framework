"""Tests for current time endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_get_current_time_without_auth():
    """Test getting current time without authentication."""
    response = client.post(
        "/api/v1/current_time",
        json={"timezone": "America/New_York"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "current_time" in data
    assert "timezone" in data
    assert data["timezone"] == "America/New_York"
    assert "email" not in data or data["email"] is None


def test_get_current_time_with_auth():
    """Test getting current time with authentication."""
    response = client.post(
        "/api/v1/current_time",
        json={"timezone": "UTC"},
        headers={"Authorization": "Bearer mock_token_google_1234567890"},
    )
    assert response.status_code == 200
    data = response.json()
    assert "current_time" in data
    assert "timezone" in data
    assert "email" in data
    assert data["email"] == "user@google.com"


def test_get_current_time_invalid_timezone():
    """Test getting current time with invalid timezone."""
    response = client.post(
        "/api/v1/current_time",
        json={"timezone": "Invalid/Timezone"},
    )
    assert response.status_code == 400
    assert "Invalid timezone" in response.json()["detail"]


def test_get_current_time_missing_timezone():
    """Test getting current time without timezone parameter."""
    response = client.post(
        "/api/v1/current_time",
        json={},
    )
    assert response.status_code == 422  # Validation error
