"""
Dify API 集成服务
专为 ContentOps 设计：自适应 Workflow / Chatflow 两种 App 类型
接收用户输入 → 返回营销文案 + 图片链接
"""
import json
import re

import httpx

from app.config import settings


class DifyService:
    """Dify ContentOps 调用服务（自适应 Workflow / Chatflow）"""

    def __init__(self):
        self.base_url = settings.DIFY_API_URL
        self.api_key = settings.DIFY_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def call_contentops(self, query: str, user_id: str) -> dict:
        """
        调用 ContentOps：先尝试 Chat API，若 App 类型不匹配则自动尝试 Workflow API
        （Chat API 更常见且与 Chatflow 兼容，优先尝试可减少延迟）

        Args:
            query: 用户输入内容
            user_id: 用户唯一标识

        Returns:
            {"text": str, "images": list[str]}
        """
        result = await self._try_chat(query, user_id)
        if result is not None:
            return result

        return await self._try_workflow_fallback(query, user_id)

    # ------------------------------------------------------------------
    # Workflow API
    # ------------------------------------------------------------------
    async def _try_workflow_fallback(self, query: str, user_id: str) -> dict:
        """回退：尝试 Workflow 端点"""
        payload = {
            "inputs": {"query": query},
            "response_mode": "blocking",
            "user": user_id,
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                resp = await client.post(
                    f"{self.base_url}/workflows/run",
                    json=payload,
                    headers=self.headers,
                )

                if resp.status_code == 200:
                    return self._parse_workflow_output(resp.json())

                body = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
                return {
                    "text": f"Workflow 调用失败 (HTTP {resp.status_code}): {body.get('message', resp.text[:200])}",
                    "images": [],
                }

        except httpx.ConnectError:
            return {"text": "无法连接到 Dify 服务，请检查 DIFY_API_URL 配置", "images": []}
        except Exception as e:
            return {"text": f"Workflow 调用异常: {str(e)}", "images": []}

    def _parse_workflow_output(self, result: dict) -> dict:
        """解析 Dify Workflow 端点的结构化输出"""
        outputs = result.get("data", {}).get("outputs", {})
        if not outputs:
            return {"text": "工作流返回为空", "images": []}

        text = self._extract_text(outputs)
        images = self._extract_images(outputs, text)
        return {"text": text, "images": images}

    # ------------------------------------------------------------------
    # Chat API (Chatflow 兼容)
    # ------------------------------------------------------------------
    async def _try_chat(self, query: str, user_id: str) -> dict | None:
        """通过 Chat API (blocking) 调用 Chatflow 类型的 ContentOps"""
        payload = {
            "inputs": {},
            "query": query,
            "response_mode": "blocking",
            "user": user_id,
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                resp = await client.post(
                    f"{self.base_url}/chat-messages",
                    json=payload,
                    headers=self.headers,
                )

                if resp.status_code == 200:
                    return self._parse_chat_output(resp.json())

                body = resp.json() if resp.headers.get("content-type", "").startswith("application/json") else {}
                code = body.get("code", "")
                if code in ("not_chat_app", "not_completion_app"):
                    return None

                return {
                    "text": f"Chat API 调用失败 (HTTP {resp.status_code}): {body.get('message', resp.text[:200])}",
                    "images": [],
                }

        except httpx.ConnectError:
            return {"text": "无法连接到 Dify 服务，请检查 DIFY_API_URL 配置", "images": []}
        except Exception as e:
            return {"text": f"Chat API 调用异常: {str(e)}", "images": []}

    def _parse_chat_output(self, result: dict) -> dict:
        """解析 Chat API 的响应，提取文案和图片"""
        answer = result.get("answer", "")

        metadata = result.get("metadata", {})
        retriever_resources = metadata.get("retriever_resources", [])

        images = self._extract_images_from_text(answer)

        file_urls = []
        for res in retriever_resources:
            src = res.get("source", "")
            if src and src.startswith("http"):
                file_urls.append(src)

        all_images = list(dict.fromkeys(images + file_urls))

        return {"text": answer, "images": all_images}

    # ------------------------------------------------------------------
    # 通用提取器
    # ------------------------------------------------------------------
    def _extract_text(self, outputs: dict) -> str:
        """从输出字典中按优先级提取文本"""
        for key in ("text", "output", "result", "content", "answer", "response", "copy", "copywriting"):
            if key in outputs and isinstance(outputs[key], str) and outputs[key].strip():
                return outputs[key].strip()

        all_texts = [v.strip() for v in outputs.values() if isinstance(v, str) and v.strip()]
        return "\n\n".join(all_texts) if all_texts else "工作流未返回文本结果"

    def _extract_images(self, outputs: dict, text: str) -> list[str]:
        """从输出字典 + 文本中提取图片链接"""
        for key in ("images", "image_urls", "image_url", "urls", "files", "pictures", "photos", "image"):
            if key in outputs and outputs[key]:
                urls = self._parse_image_urls(outputs[key])
                if urls:
                    return urls

        return self._extract_images_from_text(text)

    def _extract_images_from_text(self, text: str) -> list[str]:
        """从文本中用正则提取图片链接"""
        if not text:
            return []
        md_urls = re.findall(r'!\[.*?\]\((https?://\S+?)\)', text)
        direct_urls = re.findall(
            r'https?://\S+?\.(?:jpg|jpeg|png|gif|webp|svg|bmp)(?:\?\S*)?',
            text, re.IGNORECASE,
        )
        return list(dict.fromkeys(md_urls + direct_urls))

    def _parse_image_urls(self, value: object) -> list[str]:
        """解析多种格式的图片 URL 列表"""
        if isinstance(value, list):
            return [str(v).strip() for v in value if v and str(v).strip().startswith("http")]

        if isinstance(value, str):
            value = value.strip()
            if not value:
                return []

            if value.startswith("["):
                try:
                    parsed = json.loads(value)
                    if isinstance(parsed, list):
                        return [str(v).strip() for v in parsed if v and str(v).strip().startswith("http")]
                except json.JSONDecodeError:
                    pass

            for sep in ("\n", ",", ";", "|"):
                if sep in value:
                    urls = [u.strip() for u in value.split(sep) if u.strip()]
                    valid = [u for u in urls if u.startswith("http")]
                    if valid:
                        return valid

            if value.startswith("http"):
                return [value]

        return []
