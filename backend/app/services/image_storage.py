"""
图片永久存储服务
将 Dify 工作流返回的临时图片 URL (fal.ai 等) 下载并上传到 Supabase Storage
确保图片链接永不过期

存储路径格式: chat-images/{user_id}/{conversation_id}/{uuid}.{ext}
公共访问URL: {SUPABASE_PUBLIC_URL}/storage/v1/object/public/chat-images/...
"""
import hashlib
import uuid
from urllib.parse import urlparse

import httpx

from app.config import settings
from app.services.supabase_client import get_supabase_admin

# 存储桶名称
BUCKET_NAME = "chat-images"

# Supabase 公共 URL（外部访问用，非 Docker 内网地址）
# 从 SUPABASE_URL 中推导：如果是内网地址就用固定的公网域名
SUPABASE_PUBLIC_URL = settings.SUPABASE_PUBLIC_URL if hasattr(settings, "SUPABASE_PUBLIC_URL") and settings.SUPABASE_PUBLIC_URL else settings.SUPABASE_URL

# 已知的临时图片域名列表（这些域名的图片链接会过期）
TEMPORARY_DOMAINS = {
    "fal.media",
    "v3b.fal.media",
    "v3.fal.media",
    "fal-cdn.batiks.ai",
    "storage.googleapis.com",
    "oaidalleapiprodscus.blob.core.windows.net",
}


def _is_temporary_url(url: str) -> bool:
    """判断 URL 是否来自临时存储（需要持久化）"""
    try:
        host = urlparse(url).hostname or ""
        return any(domain in host for domain in TEMPORARY_DOMAINS)
    except Exception:
        return False


def _is_already_persisted(url: str) -> bool:
    """判断 URL 是否已经是 Supabase Storage 的永久链接"""
    return "/storage/v1/object/public/" in url


def _guess_extension(url: str, content_type: str = "") -> str:
    """从 URL 路径或 Content-Type 推断文件扩展名"""
    # 先从 Content-Type 推断
    ct_map = {
        "image/png": "png",
        "image/jpeg": "jpg",
        "image/gif": "gif",
        "image/webp": "webp",
        "image/svg+xml": "svg",
        "image/bmp": "bmp",
    }
    for ct, ext in ct_map.items():
        if ct in content_type:
            return ext

    # 从 URL 路径推断
    path = urlparse(url).path.lower()
    for ext in ("png", "jpg", "jpeg", "gif", "webp", "svg", "bmp"):
        if path.endswith(f".{ext}"):
            return ext

    # 默认 PNG
    return "png"


def _generate_storage_path(
    user_id: str, conversation_id: str, original_url: str, ext: str,
) -> str:
    """生成存储路径，用 URL hash 防重复"""
    url_hash = hashlib.md5(original_url.encode()).hexdigest()[:12]
    file_id = uuid.uuid4().hex[:8]
    return f"{user_id}/{conversation_id}/{file_id}_{url_hash}.{ext}"


async def persist_image(
    url: str, user_id: str, conversation_id: str,
) -> str:
    """
    将单张图片下载并上传到 Supabase Storage
    
    返回值：
      - 成功：返回 Supabase Storage 的公共永久 URL
      - 已持久化：直接返回原 URL
      - 非临时链接：直接返回原 URL
      - 失败：返回原 URL（降级，不阻断主流程）
    """
    if not url or not url.startswith("http"):
        return url

    if _is_already_persisted(url):
        return url

    if not _is_temporary_url(url):
        return url

    try:
        # 下载远程图片（超时设短，避免阻塞主流程太久）
        async with httpx.AsyncClient(timeout=10.0) as client:
            resp = await client.get(url, follow_redirects=True)
            if resp.status_code != 200:
                print(f"[ImageStorage] 下载失败 HTTP {resp.status_code}: {url}")
                return url

            content_type = resp.headers.get("content-type", "")
            image_data = resp.content

            if len(image_data) < 100:
                print(f"[ImageStorage] 图片数据过小，跳过: {url}")
                return url

        # 推断扩展名并生成存储路径
        ext = _guess_extension(url, content_type)
        storage_path = _generate_storage_path(user_id, conversation_id, url, ext)

        # 确定 MIME 类型
        mime_map = {
            "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
            "gif": "image/gif", "webp": "image/webp", "svg": "image/svg+xml",
            "bmp": "image/bmp",
        }
        mime_type = mime_map.get(ext, "image/png")

        # 上传到 Supabase Storage
        supabase = get_supabase_admin()
        supabase.storage.from_(BUCKET_NAME).upload(
            path=storage_path,
            file=image_data,
            file_options={"content-type": mime_type, "upsert": "true"},
        )

        # 构造公共访问 URL
        public_url = f"{SUPABASE_PUBLIC_URL}/storage/v1/object/public/{BUCKET_NAME}/{storage_path}"
        print(f"[ImageStorage] 持久化成功: {url[:60]}... -> {public_url[:80]}...")
        return public_url

    except Exception as e:
        print(f"[ImageStorage] 持久化失败 ({e!s}): {url[:80]}")
        return url


async def persist_images(
    urls: list[str], user_id: str, conversation_id: str,
) -> list[str]:
    """
    批量持久化图片列表
    对每张图片依次下载并上传（避免并发过高导致超时）
    """
    if not urls:
        return urls

    result: list[str] = []
    for url in urls:
        persisted = await persist_image(url, user_id, conversation_id)
        result.append(persisted)
    return result


async def ensure_bucket_exists() -> None:
    """
    确保 chat-images 存储桶存在（应用启动时调用一次）
    使用 service_role_key 拥有完整权限
    """
    try:
        supabase = get_supabase_admin()
        # 尝试获取桶信息
        try:
            supabase.storage.get_bucket(BUCKET_NAME)
            print(f"[ImageStorage] 存储桶 '{BUCKET_NAME}' 已存在")
        except Exception:
            # 桶不存在，创建它
            supabase.storage.create_bucket(
                BUCKET_NAME,
                options={
                    "public": True,
                    "file_size_limit": 10485760,  # 10MB
                    "allowed_mime_types": [
                        "image/png", "image/jpeg", "image/gif",
                        "image/webp", "image/svg+xml",
                    ],
                },
            )
            print(f"[ImageStorage] 已创建存储桶 '{BUCKET_NAME}'")
    except Exception as e:
        print(f"[ImageStorage] 存储桶初始化警告: {e!s}")
