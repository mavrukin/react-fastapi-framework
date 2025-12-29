"""API v1 router."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, current_time

api_router = APIRouter()

# Include routers
api_router.include_router(auth.router, prefix="", tags=["auth"])
api_router.include_router(current_time.router, prefix="", tags=["current-time"])
