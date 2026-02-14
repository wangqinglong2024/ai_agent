"""
FastAPI 依赖注入 - 认证、Supabase 客户端等
"""
from fastapi import Depends, HTTPException, Header

from app.middleware.auth import verify_supabase_token
from app.services.supabase_client import get_supabase_admin


async def get_current_user(authorization: str = Header(..., description="Bearer <supabase_jwt>")) -> dict:
    """
    从请求头中提取并验证 Supabase JWT，返回用户信息。
    用法: 在路由中加 `user = Depends(get_current_user)`
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="无效的认证格式，需要 Bearer token")

    token = authorization[7:]  # 去掉 "Bearer " 前缀
    payload = verify_supabase_token(token)

    if payload is None:
        raise HTTPException(status_code=401, detail="Token 验证失败或已过期")

    return payload
