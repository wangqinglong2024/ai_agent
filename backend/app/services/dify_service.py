"""
Dify API 集成服务
支持 Chat (流式) 和 Workflow 两种模式
"""
import json
from typing import AsyncGenerator

import httpx

from app.config import settings


class DifyService:
    """Dify API 调用服务"""

    def __init__(self):
        self.base_url = settings.DIFY_API_URL
        self.api_key = settings.DIFY_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat_stream(
        self,
        query: str,
        user_id: str,
        conversation_id: str = "",
    ) -> AsyncGenerator[dict, None]:
        """
        调用 Dify Chat API (SSE 流式)
        
        Args:
            query: 用户消息
            user_id: 用户 ID
            conversation_id: Dify 侧的对话 ID (为空则创建新对话)
            
        Yields:
            dict: {type: "message"|"message_end"|"error", content: str, ...}
        """
        payload = {
            "inputs": {},
            "query": query,
            "response_mode": "streaming",
            "user": user_id,
        }
        if conversation_id:
            payload["conversation_id"] = conversation_id

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat-messages",
                    json=payload,
                    headers=self.headers,
                ) as response:
                    if response.status_code != 200:
                        error_text = await response.aread()
                        yield {
                            "type": "error",
                            "content": f"Dify API 错误: {response.status_code} - {error_text.decode()}",
                        }
                        return

                    async for line in response.aiter_lines():
                        if not line or not line.startswith("data: "):
                            continue

                        data_str = line[6:]  # 去掉 "data: " 前缀
                        try:
                            data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        event = data.get("event", "")

                        if event == "message":
                            yield {
                                "type": "message",
                                "content": data.get("answer", ""),
                            }
                        elif event == "message_end":
                            yield {
                                "type": "message_end",
                                "conversation_id": data.get("conversation_id", ""),
                                "content": "",
                            }
                        elif event == "error":
                            yield {
                                "type": "error",
                                "content": data.get("message", "未知错误"),
                            }

        except httpx.ConnectError:
            yield {
                "type": "error",
                "content": "无法连接到 Dify 服务，请检查 DIFY_API_URL 配置",
            }
        except Exception as e:
            yield {
                "type": "error",
                "content": f"Dify 调用异常: {str(e)}",
            }

    async def run_workflow(
        self,
        inputs: dict,
        query: str,
        user_id: str,
    ) -> dict | None:
        """
        调用 Dify Workflow API (非流式)
        
        Args:
            inputs: 工作流输入参数
            query: 用户问题
            user_id: 用户 ID
            
        Returns:
            Dify 返回的结果 dict，失败返回 None
        """
        payload = {
            "inputs": inputs,
            "query": query,
            "response_mode": "blocking",
            "user": user_id,
        }

        try:
            async with httpx.AsyncClient(timeout=120.0) as client:
                response = await client.post(
                    f"{self.base_url}/workflows/run",
                    json=payload,
                    headers=self.headers,
                )

                if response.status_code == 200:
                    return response.json()
                return None

        except Exception:
            return None
