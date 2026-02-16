"""
FastAPI Dependency Injection - Auth, Supabase client, etc.

All JWT verification is done locally using the SUPABASE_JWT_SECRET.
No network call to Supabase Auth per request (zero-trust, high-performance).
"""
from typing import Any

from fastapi import Depends, HTTPException, Header

from app.middleware.auth import verify_supabase_token


async def get_current_user(
    authorization: str = Header(..., description="Bearer <supabase_jwt>"),
) -> dict[str, Any]:
    """
    Extract and verify the Supabase JWT from the Authorization header.

    Returns the decoded payload dict containing at minimum:
      - sub: user UUID
      - email: user email
      - role: e.g. 'authenticated'

    Usage: ``user = Depends(get_current_user)``
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid auth format, expected Bearer token")

    token: str = authorization[7:]
    payload: dict[str, Any] | None = verify_supabase_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Token verification failed or expired")

    return payload
