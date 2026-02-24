"""
全局配置 - 从环境变量加载
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """应用配置，自动从 .env 文件和环境变量读取"""

    # 运行环境
    ENV: str = "development"

    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_ANON_KEY: str = ""
    SUPABASE_SERVICE_ROLE_KEY: str = ""
    SUPABASE_JWT_SECRET: str = ""
    # Supabase 公共 URL（前端/外部访问，如 https://supabase.ideas.top）
    # 若不设置则回退到 SUPABASE_URL
    SUPABASE_PUBLIC_URL: str = ""

    # Dify
    DIFY_API_URL: str = ""
    DIFY_API_KEY: str = ""

    # Openclaw
    OPENCLAW_API_URL: str = ""
    OPENCLAW_API_KEY: str = ""

    # CORS
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost"

    @property
    def cors_origins_list(self) -> list[str]:
        """将逗号分隔的 CORS 配置转为列表"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()
