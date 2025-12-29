"""Integration tests for current time endpoint."""

from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_current_time_flow_unauthenticated():
    """Test complete flow for unauthenticated user."""
    # Request current time
    response = client.post(
        "/api/v1/current_time",
        json={"timezone": "America/New_York"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "current_time" in data
    assert data["timezone"] == "America/New_York"
    assert data.get("email") is None


def test_current_time_flow_authenticated():
    """Test complete flow for authenticated user."""
    # Request current time with auth
    response = client.post(
        "/api/v1/current_time",
        json={"timezone": "Europe/London"},
        headers={"Authorization": "Bearer mock_token_facebook_1234567890"},
    )

    assert response.status_code == 200
    data = response.json()
    assert "current_time" in data
    assert data["timezone"] == "Europe/London"
    assert data["email"] == "user@facebook.com"


def test_current_time_multiple_timezones():
    """Test current time with different timezones."""
    timezones = ["UTC", "America/New_York", "Asia/Tokyo", "Europe/London"]

    for timezone in timezones:
        response = client.post(
            "/api/v1/current_time",
            json={"timezone": timezone},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["timezone"] == timezone
        assert "current_time" in data
