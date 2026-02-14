"""
健康检查路由
"""
from fastapi import APIRouter

router = APIRouter()


@router.get("/health")
async def health_check():
    """健康检查端点，供 Docker 和 Nginx 使用"""
    return {"status": "ok", "service": "ideas-api"}
