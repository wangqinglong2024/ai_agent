"""
Auth Router - User registration (Admin API, no email confirmation) & avatar upload.

Uses Supabase Admin API for user creation and Supabase Storage for avatars.
All operations authenticated via JWT dependency injection.
"""
from typing import Any

from fastapi import APIRouter, HTTPException, Depends, File, UploadFile
from pydantic import BaseModel, Field
import httpx

from app.config import settings
from app.dependencies import get_current_user

router = APIRouter()

USERNAME_EMAIL_SUFFIX: str = "@ideas.local"
AVATAR_BUCKET: str = "avatars"


def _service_headers() -> dict[str, str]:
    """Headers for Supabase service-role requests."""
    return {
        "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY}",
        "apikey": settings.SUPABASE_SERVICE_ROLE_KEY,
    }


# --------------------------------------------------------------------------
# Health
# --------------------------------------------------------------------------
@router.get(
    "/health",
    summary="Auth service health check",
    response_model=dict[str, str],
)
async def auth_health() -> dict[str, str]:
    """Verify gateway is forwarding /api/auth to this service."""
    return {"status": "ok", "service": "auth"}


# --------------------------------------------------------------------------
# Registration
# --------------------------------------------------------------------------
class RegisterRequest(BaseModel):
    """User registration payload."""
    username: str = Field(..., min_length=1, max_length=64, description="Username (no @ symbol)")
    password: str = Field(..., min_length=6, max_length=72, description="Password (6-72 chars)")


class RegisterResponse(BaseModel):
    """Registration success response."""
    detail: str


@router.post(
    "/register",
    response_model=RegisterResponse,
    summary="Register a new user",
    responses={
        400: {"description": "Invalid input or user already exists"},
        502: {"description": "Cannot connect to auth service"},
    },
)
async def register(body: RegisterRequest) -> RegisterResponse:
    """
    Username + password registration.

    Uses Supabase Admin API to create the user and auto-confirm email.
    The database trigger `handle_new_user()` automatically creates
    the corresponding `user_profiles` row.
    """
    username = body.username.strip()
    if not username or "@" in username:
        raise HTTPException(status_code=400, detail="Username must not be empty or contain @")

    email = username.lower() + USERNAME_EMAIL_SUFFIX
    url = f"{settings.SUPABASE_URL.rstrip('/')}/auth/v1/admin/users"
    headers = {
        **_service_headers(),
        "Content-Type": "application/json",
    }
    payload = {
        "email": email,
        "password": body.password,
        "email_confirm": True,
        "user_metadata": {"username": username, "nickname": username},
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Cannot reach auth service: {exc}")

    if resp.status_code in (200, 201):
        return RegisterResponse(detail="Registration successful, please log in")

    # Duplicate or validation error
    try:
        err_body: dict[str, Any] = resp.json()
        msg = (
            err_body.get("msg")
            or err_body.get("message")
            or err_body.get("error_description")
            or resp.text
            or "Registration failed"
        )
    except Exception:
        msg = resp.text or "Registration failed"

    raise HTTPException(status_code=400, detail=msg)


# --------------------------------------------------------------------------
# Avatar Upload
# --------------------------------------------------------------------------
class AvatarResponse(BaseModel):
    """Avatar upload success response."""
    url: str = Field(..., description="Public URL of the uploaded avatar")


@router.post(
    "/avatar",
    response_model=AvatarResponse,
    summary="Upload user avatar",
    responses={
        400: {"description": "Invalid file or upload error"},
        502: {"description": "Storage service error"},
    },
)
async def upload_avatar(
    user: dict[str, Any] = Depends(get_current_user),
    file: UploadFile = File(..., description="Image file (max 2 MB)"),
) -> AvatarResponse:
    """
    Upload user avatar via Supabase Storage.

    Requires `Authorization: Bearer <supabase_access_token>` header.
    Overwrites existing avatar using upsert.
    """
    if not file.content_type or not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="Only image files are accepted")

    content = await file.read()
    if len(content) > 2 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="Image must be under 2 MB")

    base = settings.SUPABASE_URL.rstrip("/")
    user_id: str = user.get("sub", "")
    if not user_id:
        raise HTTPException(status_code=401, detail="Invalid user identity")

    ext = (file.filename or "").rsplit(".", 1)[-1].lower() if file.filename else "jpg"
    if ext not in ("jpg", "jpeg", "png", "gif", "webp"):
        ext = "jpg"
    object_path = f"{user_id}/avatar.{ext}"

    upload_url = f"{base}/storage/v1/object/{AVATAR_BUCKET}/{object_path}"
    headers = {
        **_service_headers(),
        "Content-Type": file.content_type or "image/jpeg",
        "x-upsert": "true",
    }

    try:
        async with httpx.AsyncClient(timeout=15.0) as client:
            resp = await client.post(upload_url, content=content, headers=headers)
    except httpx.RequestError as exc:
        raise HTTPException(status_code=502, detail=f"Storage service error: {exc}")

    if resp.status_code not in (200, 201):
        try:
            err_body = resp.json()
            msg = err_body.get("message") or err_body.get("error") or resp.text
        except Exception:
            msg = resp.text
        raise HTTPException(status_code=400, detail=msg or "Upload failed")

    public_url = f"{base}/storage/v1/object/public/{AVATAR_BUCKET}/{object_path}"
    return AvatarResponse(url=public_url)
