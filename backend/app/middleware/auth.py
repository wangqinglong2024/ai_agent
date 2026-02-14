"""
Supabase JWT 认证中间件
验证前端传来的 Supabase Access Token
"""
import jwt
from app.config import settings


def verify_supabase_token(token: str) -> dict | None:
    """
    验证 Supabase JWT Token
    
    Args:
        token: JWT token 字符串 (不含 Bearer 前缀)
        
    Returns:
        解码后的 payload dict，验证失败返回 None
    """
    try:
        payload = jwt.decode(
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
