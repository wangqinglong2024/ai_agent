"""
Dify API 集成服务 — 流式输出版
自适应 Workflow / Chatflow，实时推送工作流节点进度 + 增量文本 + 图片结果
"""
import json
import re
from typing import AsyncGenerator

import httpx

from app.config import settings


class DifyService:
    """Dify ContentOps 调用服务 — 全链路流式推送"""

    def __init__(self) -> None:
        self.base_url = settings.DIFY_API_URL
        self.api_key = settings.DIFY_API_KEY
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    # ==================================================================
    # 对外唯一入口 — 异步生成器，逐事件 yield
    # ==================================================================
    async def stream_contentops(
        self, query: str, user_id: str,
    ) -> AsyncGenerator[dict, None]:
        """
        流式调用 ContentOps。先尝试 Chat API，不匹配时自动回退 Workflow API。

        Yields 事件字典（type 字段标识类型）:
          step       — {"title": str, "status": "running"|"done"}
          delta      — {"text": str}                  增量文本
          text_done  — {"text": str}                  全量文本
          images     — {"status": "generating"|"done", "urls": [...]}
          thinking   — {"node_title": str, "content": str}  LLM 推理/思考内容
          error      — {"message": str}
          done       — {}
        """
        async for event in self._try_chat_stream(query, user_id):
            if event.get("type") == "_fallback_needed":
                async for wf_event in self._try_workflow_stream(query, user_id):
                    yield wf_event
                return
            yield event

    # ==================================================================
    # Chat API — 流式
    # ==================================================================
    async def _try_chat_stream(
        self, query: str, user_id: str,
    ) -> AsyncGenerator[dict, None]:
        payload = {
            "inputs": {},
            "query": query,
            "response_mode": "streaming",
            "user": user_id,
        }

        full_text = ""
        images: list[str] = []
        has_text = False
        sent_generating = False

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/chat-messages",
                    json=payload,
                    headers=self.headers,
                ) as resp:
                    if resp.status_code != 200:
                        error_body = await resp.aread()
                        try:
                            body = json.loads(error_body)
                            code = body.get("code", "")
                            if code in ("not_chat_app", "not_completion_app"):
                                yield {"type": "_fallback_needed"}
                                return
                            yield {
                                "type": "error",
                                "message": f"Chat API (HTTP {resp.status_code}): "
                                           f"{body.get('message', '')}",
                            }
                        except Exception:
                            yield {
                                "type": "error",
                                "message": f"Chat API (HTTP {resp.status_code})",
                            }
                        yield {"type": "done"}
                        return

                    event_name = ""
                    async for line in resp.aiter_lines():
                        line = line.strip()
                        if not line:
                            continue
                        if line.startswith("event:"):
                            event_name = line[6:].strip()
                            continue
                        if not line.startswith("data:"):
                            continue

                        data_str = line[5:].strip()
                        if not data_str:
                            continue
                        try:
                            data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        ev = data.get("event", event_name)

                        if ev == "workflow_started":
                            yield {"type": "step", "title": "工作流启动", "status": "running"}

                        elif ev == "node_started":
                            nd = data.get("data", data)
                            title = nd.get("title", "处理中")
                            yield {"type": "step", "title": title, "status": "running"}
                            if has_text and not images and not sent_generating:
                                sent_generating = True
                                yield {"type": "images", "status": "generating", "urls": []}

                        elif ev == "node_finished":
                            nd = data.get("data", data)
                            title = nd.get("title", "处理中")
                            yield {"type": "step", "title": title, "status": "done"}
                            # 提取 LLM 节点的 thinking/reasoning 内容
                            thinking = self._extract_thinking(nd)
                            if thinking:
                                yield {"type": "thinking", "node_title": title, "content": thinking}
                            outputs = nd.get("outputs") or {}
                            if isinstance(outputs, dict):
                                ni = self._extract_images(outputs, "")
                                if ni:
                                    images = list(dict.fromkeys(images + ni))
                                    yield {"type": "images", "status": "done", "urls": images}

                        elif ev == "agent_thought":
                            # Dify agent 模式思考链事件
                            thought_text = data.get("thought", "")
                            if thought_text:
                                yield {"type": "thinking", "node_title": "AI 推理", "content": thought_text}

                        elif ev == "message":
                            chunk = data.get("answer", "")
                            if chunk:
                                has_text = True
                                full_text += chunk
                                yield {"type": "delta", "text": chunk}

                        elif ev == "message_file":
                            url = data.get("url", "")
                            if url and url not in images:
                                images.append(url)
                                yield {"type": "images", "status": "done", "urls": images}

                        elif ev == "message_end":
                            meta = data.get("metadata", {})
                            for res in meta.get("retriever_resources", []):
                                src = res.get("source", "")
                                if src.startswith("http") and src not in images:
                                    images.append(src)
                            ti = self._extract_images_from_text(full_text)
                            for u in ti:
                                if u not in images:
                                    images.append(u)
                            if full_text:
                                yield {"type": "text_done", "text": full_text}
                            if images:
                                yield {"type": "images", "status": "done", "urls": images}

                        elif ev == "workflow_finished":
                            wfd = data.get("data", data)
                            outputs = wfd.get("outputs") or {}
                            if isinstance(outputs, dict):
                                if not full_text:
                                    t = self._extract_text(outputs)
                                    if t and t != "工作流未返回文本结果":
                                        full_text = t
                                        yield {"type": "text_done", "text": full_text}
                                wi = self._extract_images(outputs, full_text)
                                for u in wi:
                                    if u not in images:
                                        images.append(u)
                                if images:
                                    yield {"type": "images", "status": "done", "urls": images}

        except httpx.ConnectError:
            yield {"type": "error", "message": "无法连接到 Dify 服务，请检查配置"}
        except httpx.ReadTimeout:
            yield {"type": "error", "message": "Dify 服务响应超时，请稍后重试"}
        except Exception as e:
            yield {"type": "error", "message": f"调用异常: {e!s}"}

        yield {"type": "done"}

    # ==================================================================
    # Workflow API — 流式
    # ==================================================================
    async def _try_workflow_stream(
        self, query: str, user_id: str,
    ) -> AsyncGenerator[dict, None]:
        payload = {
            "inputs": {"query": query},
            "response_mode": "streaming",
            "user": user_id,
        }

        full_text = ""
        images: list[str] = []
        has_text = False
        sent_generating = False

        try:
            async with httpx.AsyncClient(timeout=300.0) as client:
                async with client.stream(
                    "POST",
                    f"{self.base_url}/workflows/run",
                    json=payload,
                    headers=self.headers,
                ) as resp:
                    if resp.status_code != 200:
                        error_body = await resp.aread()
                        try:
                            body = json.loads(error_body)
                            yield {
                                "type": "error",
                                "message": f"Workflow (HTTP {resp.status_code}): "
                                           f"{body.get('message', '')}",
                            }
                        except Exception:
                            yield {
                                "type": "error",
                                "message": f"Workflow (HTTP {resp.status_code})",
                            }
                        yield {"type": "done"}
                        return

                    event_name = ""
                    async for line in resp.aiter_lines():
                        line = line.strip()
                        if not line:
                            continue
                        if line.startswith("event:"):
                            event_name = line[6:].strip()
                            continue
                        if not line.startswith("data:"):
                            continue

                        data_str = line[5:].strip()
                        if not data_str:
                            continue
                        try:
                            data = json.loads(data_str)
                        except json.JSONDecodeError:
                            continue

                        ev = data.get("event", event_name)

                        if ev == "workflow_started":
                            yield {"type": "step", "title": "工作流启动", "status": "running"}

                        elif ev == "node_started":
                            nd = data.get("data", data)
                            title = nd.get("title", "处理中")
                            yield {"type": "step", "title": title, "status": "running"}
                            if has_text and not images and not sent_generating:
                                sent_generating = True
                                yield {"type": "images", "status": "generating", "urls": []}

                        elif ev == "node_finished":
                            nd = data.get("data", data)
                            title = nd.get("title", "处理中")
                            yield {"type": "step", "title": title, "status": "done"}
                            # 提取 LLM 节点的 thinking/reasoning 内容
                            thinking = self._extract_thinking(nd)
                            if thinking:
                                yield {"type": "thinking", "node_title": title, "content": thinking}
                            outputs = nd.get("outputs") or {}
                            if isinstance(outputs, dict):
                                ni = self._extract_images(outputs, "")
                                if ni:
                                    images = list(dict.fromkeys(images + ni))
                                    yield {"type": "images", "status": "done", "urls": images}

                        elif ev == "text_chunk":
                            inner = data.get("data", data)
                            chunk = inner.get("text", "")
                            if chunk:
                                has_text = True
                                full_text += chunk
                                yield {"type": "delta", "text": chunk}

                        elif ev == "workflow_finished":
                            wfd = data.get("data", data)
                            outputs = wfd.get("outputs") or {}
                            if isinstance(outputs, dict):
                                if not full_text:
                                    t = self._extract_text(outputs)
                                    if t and t != "工作流未返回文本结果":
                                        full_text = t
                                elif full_text:
                                    pass
                                wi = self._extract_images(outputs, full_text)
                                for u in wi:
                                    if u not in images:
                                        images.append(u)

                            ti = self._extract_images_from_text(full_text)
                            for u in ti:
                                if u not in images:
                                    images.append(u)

                            if full_text:
                                yield {"type": "text_done", "text": full_text}
                            if images:
                                yield {"type": "images", "status": "done", "urls": images}

        except httpx.ConnectError:
            yield {"type": "error", "message": "无法连接到 Dify 服务"}
        except httpx.ReadTimeout:
            yield {"type": "error", "message": "Dify 服务响应超时"}
        except Exception as e:
            yield {"type": "error", "message": f"Workflow 调用异常: {e!s}"}

        yield {"type": "done"}

    # ==================================================================
    # Thinking/Reasoning 提取器 — 从 LLM 节点数据中提取思考内容
    # ==================================================================
    def _extract_thinking(self, node_data: dict) -> str:
        """
        从 Dify node_finished 数据中提取 LLM 的思考/推理内容。
         支持多种 Dify 版本的数据结构：
          - process_data.reasoning (Dify 1.x)
          - process_data.reasoning_content (部分模型)
          - outputs.reasoning_content (Gemini 等扩展思考)
          - execution_metadata.reasoning (部分版本)
        """
        # 仅对 LLM 类型节点提取 thinking
        node_type = node_data.get("node_type", "")
        if node_type not in ("llm", "agent", "parameter-extractor", "question-classifier"):
            return ""

        # 优先从 process_data 提取
        process_data = node_data.get("process_data") or {}
        if isinstance(process_data, dict):
            for key in ("reasoning", "reasoning_content", "thought", "thinking"):
                val = process_data.get(key, "")
                if isinstance(val, str) and val.strip():
                    return val.strip()
            # 检查 model_outputs 内的 reasoning
            model_outputs = process_data.get("model_outputs") or {}
            if isinstance(model_outputs, dict):
                for key in ("reasoning_content", "reasoning", "thinking"):
                    val = model_outputs.get(key, "")
                    if isinstance(val, str) and val.strip():
                        return val.strip()

        # 从 outputs 提取
        outputs = node_data.get("outputs") or {}
        if isinstance(outputs, dict):
            for key in ("reasoning_content", "reasoning", "thinking"):
                val = outputs.get(key, "")
                if isinstance(val, str) and val.strip():
                    return val.strip()

        # 从 execution_metadata 提取
        exec_meta = node_data.get("execution_metadata") or {}
        if isinstance(exec_meta, dict):
            for key in ("reasoning", "reasoning_content"):
                val = exec_meta.get(key, "")
                if isinstance(val, str) and val.strip():
                    return val.strip()

        return ""

    # ==================================================================
    # 通用提取器（复用原有逻辑）
    # ==================================================================
    def _extract_text(self, outputs: dict) -> str:
        for key in (
            "text", "output", "result", "content",
            "answer", "response", "copy", "copywriting",
        ):
            if key in outputs and isinstance(outputs[key], str) and outputs[key].strip():
                return outputs[key].strip()
        all_texts = [v.strip() for v in outputs.values() if isinstance(v, str) and v.strip()]
        return "\n\n".join(all_texts) if all_texts else "工作流未返回文本结果"

    def _extract_images(self, outputs: dict, text: str) -> list[str]:
        for key in (
            "images", "image_urls", "image_url", "urls",
            "files", "pictures", "photos", "image",
        ):
            if key in outputs and outputs[key]:
                urls = self._parse_image_urls(outputs[key])
                if urls:
                    return urls
        return self._extract_images_from_text(text)

    def _extract_images_from_text(self, text: str) -> list[str]:
        if not text:
            return []
        md_urls = re.findall(r'!\[.*?\]\((https?://\S+?)\)', text)
        direct_urls = re.findall(
            r'https?://\S+?\.(?:jpg|jpeg|png|gif|webp|svg|bmp)(?:\?\S*)?',
            text, re.IGNORECASE,
        )
        return list(dict.fromkeys(md_urls + direct_urls))

    def _parse_image_urls(self, value: object) -> list[str]:
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
