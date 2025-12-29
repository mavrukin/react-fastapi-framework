"""Main FastAPI application entry point."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.api import api_router
from app.core.config import settings

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# Set all CORS enabled origins
if settings.BACKEND_CORS_ORIGINS:
    # Convert AnyHttpUrl to string and normalize for CORS matching
    # AnyHttpUrl normalizes URLs with trailing slashes, but browsers send without
    cors_origins = []
    for origin in settings.BACKEND_CORS_ORIGINS:
        origin_str = str(origin).rstrip("/")
        cors_origins.append(origin_str)

    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/")
async def root():
    """Root endpoint."""
    return {"message": "Reach FastAPI Framework", "version": settings.VERSION}


@app.get("/health")
async def health():
    """Health check endpoint."""
    return {"status": "healthy"}
