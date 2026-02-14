"""
Supabase 客户端工厂
提供 Admin 客户端 (service_role_key) 和 User 客户端 (user JWT) 两种模式
"""
from supabase import create_client, Client

from app.config import settings

# 单例 - Admin 客户端 (使用 service_role_key，绕过 RLS)
_admin_client: Client | None = None


def get_supabase_admin() -> Client:
    """
    获取 Supabase Admin 客户端
    使用 service_role_key，可以操作所有数据 (绕过 RLS)
    后端业务逻辑中使用此客户端
    """
    global _admin_client
    if _admin_client is None:
        _admin_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
        )
    return _admin_client


def get_supabase_user(access_token: str) -> Client:
    """
    获取以用户身份运行的 Supabase 客户端
    使用 anon_key + 用户 JWT，遵守 RLS 规则
    当需要以用户身份进行操作时使用
    """
    client = create_client(
        settings.SUPABASE_URL,
        settings.SUPABASE_ANON_KEY,
    )
    client.auth.set_session(access_token, "")
    return client
