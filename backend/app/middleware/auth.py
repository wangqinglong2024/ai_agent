"""
Supabase JWT Verification

Local stateless verification using SUPABASE_JWT_SECRET (HS256).
No network call per request - high-performance, zero-trust.
"""
from typing import Any

import jwt

from app.config import settings


def verify_supabase_token(token: str) -> dict[str, Any] | None:
    """
    Verify a Supabase JWT token locally.

    Args:
        token: JWT string (without 'Bearer ' prefix).

    Returns:
        Decoded payload dict on success, None on failure.
    """
    try:
        payload: dict[str, Any] = jwt.decode(
            token,
            settings.SUPABASE_JWT_SECRET,
            algorithms=["HS256"],
            audience="authenticated",
        )
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
