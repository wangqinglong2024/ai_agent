"""
Ideas.top C端应用 - FastAPI 后端入口
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import health, chat, dify

# ============================================================================
# 创建 FastAPI 应用
# ============================================================================
app = FastAPI(
    title="Ideas.top API",
    description="C端智能对话应用后端",
    version="0.1.0",
)

# ============================================================================
# 中间件配置
# ============================================================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# 注册路由
# ============================================================================
app.include_router(health.router, tags=["Health"])
app.include_router(chat.router, prefix="/chat", tags=["Chat"])
app.include_router(dify.router, prefix="/dify", tags=["Dify"])
