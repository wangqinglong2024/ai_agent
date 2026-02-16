"""
Health Check Router
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health", response_model=dict[str, str], summary="Health check")
async def health_check() -> dict[str, str]:
    """Health check endpoint for Docker and Nginx probes."""
    return {"status": "ok", "service": "ideas-api"}
