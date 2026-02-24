"""
Ideas.top C-端应用 - FastAPI Backend Entry Point

Global exception handlers ensure no internal tracebacks leak in production.
"""
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.routers import health, chat, dify, auth

# ============================================================================
# Create FastAPI Application
# ============================================================================
app = FastAPI(
    title="Ideas.top API",
    description="C-端智能对话应用后端 - Dify + Supabase",
    version="0.1.0",
    docs_url="/docs" if settings.ENV == "development" else None,
    redoc_url="/redoc" if settings.ENV == "development" else None,
)

# ============================================================================
# Global Exception Handlers
# ============================================================================

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """Catch-all handler: never expose internal tracebacks in production."""
    if settings.ENV == "development":
        detail = f"{type(exc).__name__}: {exc}"
    else:
        detail = "Internal server error"
    return JSONResponse(status_code=500, content={"detail": detail})


@app.exception_handler(404)
async def not_found_handler(request: Request, exc: Exception) -> JSONResponse:
    """Standardized 404 response."""
    return JSONResponse(status_code=404, content={"detail": "Resource not found"})


# ============================================================================
# Middleware
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Startup Events
# ============================================================================
@app.on_event("startup")
async def on_startup() -> None:
    """应用启动时初始化：确保 Supabase Storage 存储桶存在"""
    from app.services.image_storage import ensure_bucket_exists
    await ensure_bucket_exists()


# ============================================================================
# Register Routers
# ============================================================================
app.include_router(health.router, tags=["Health"])
app.include_router(auth.router, prefix="/auth", tags=["Auth"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(dify.router, prefix="/dify", tags=["Dify"])
