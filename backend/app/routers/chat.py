"""
对话管理路由
职责：创建对话、发送消息、获取历史记录
消息发送后通过 Dify 流式 API 实时推送工作流进度

SSE 事件协议（前端新版）：
  event: step       → data: {"title":"...", "status":"running"|"done"}
  event: delta      → data: {"text":"增量文本"}
  event: text_done  → data: {"text":"全量文本"}
  event: images     → data: {"status":"generating"|"done", "urls":[...]}
  event: error      → data: {"message":"错误信息"}
  event: done       → data: [DONE]
"""
import json
from typing import Any

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse

from app.dependencies import get_current_user
from app.models.chat import (
    CreateConversationRequest,
    SendMessageRequest,
    ConversationResponse,
    MessageResponse,
)
from app.services.supabase_client import get_supabase_admin
from app.services.dify_service import DifyService

router = APIRouter()


# --------------------------------------------------------------------------
# 对话 CRUD
# --------------------------------------------------------------------------
@router.post("/conversations", response_model=ConversationResponse)
async def create_conversation(
    body: CreateConversationRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, Any]:
    """创建新的对话"""
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    result = (
        supabase.table("conversations")
        .insert({"user_id": user_id, "title": body.title})
        .execute()
    )

    if not result.data:
        raise HTTPException(status_code=500, detail="创建对话失败")

    return result.data[0]


@router.get("/conversations", response_model=list[ConversationResponse])
async def list_conversations(
    user: dict[str, Any] = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """获取当前用户的所有对话列表"""
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    result = (
        supabase.table("conversations")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )

    return result.data


@router.delete("/conversations/{conversation_id}")
async def delete_conversation(
    conversation_id: str,
    user: dict[str, Any] = Depends(get_current_user),
) -> dict[str, str]:
    """删除对话 (级联删除消息)"""
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    check = (
        supabase.table("conversations")
        .select("id")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not check.data:
        raise HTTPException(status_code=404, detail="对话不存在")

    supabase.table("conversations").delete().eq("id", conversation_id).execute()
    return {"detail": "已删除"}


# --------------------------------------------------------------------------
# 消息
# --------------------------------------------------------------------------
@router.get(
    "/conversations/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
async def get_messages(
    conversation_id: str,
    user: dict[str, Any] = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """获取某个对话的所有消息"""
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    check = (
        supabase.table("conversations")
        .select("id")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not check.data:
        raise HTTPException(status_code=404, detail="对话不存在")

    result = (
        supabase.table("messages")
        .select("*")
        .eq("conversation_id", conversation_id)
        .order("created_at", desc=False)
        .execute()
    )

    return result.data


def _generate_title_from_query(query: str) -> str:
    clean_query = query.replace("\n", " ").replace("\r", " ").strip()
    if len(clean_query) <= 30:
        return clean_query
    return clean_query[:30] + "..."


def _sse(event: str, data: str) -> str:
    """构造单条 SSE 帧"""
    return f"event: {event}\ndata: {data}\n\n"


@router.post("/conversations/{conversation_id}/messages")
async def send_message(
    conversation_id: str,
    body: SendMessageRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> StreamingResponse:
    """
    发送消息并流式返回 Dify 工作流进度 + 营销文案 + 图片 (SSE)

    流程:
    1. 保存用户消息
    2. 自动生成对话标题 (首条消息)
    3. 流式消费 Dify 事件并即时转发给前端
    4. 完成后持久化 AI 回复 (text + images + steps)
    """
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    conv = (
        supabase.table("conversations")
        .select("id, title")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not conv.data:
        raise HTTPException(status_code=404, detail="对话不存在")

    current_title: str = conv.data[0].get("title", "")

    existing_messages = (
        supabase.table("messages")
        .select("id")
        .eq("conversation_id", conversation_id)
        .eq("role", "user")
        .execute()
    )
    is_first_message = len(existing_messages.data) == 0

    supabase.table("messages").insert({
        "conversation_id": conversation_id,
        "role": "user",
        "content": body.content,
    }).execute()

    if is_first_message and current_title == "新对话":
        new_title = _generate_title_from_query(body.content)
        supabase.table("conversations").update({
            "title": new_title,
        }).eq("id", conversation_id).execute()

    dify = DifyService()

    async def event_generator():
        full_text = ""
        all_images: list[str] = []
        steps: list[dict[str, str]] = []

        try:
            async for event in dify.stream_contentops(
                query=body.content, user_id=user_id,
            ):
                etype = event.get("type", "")

                if etype == "step":
                    title = event.get("title", "")
                    status = event.get("status", "")
                    existing = next((s for s in steps if s["title"] == title), None)
                    if existing:
                        existing["status"] = status
                    else:
                        steps.append({"title": title, "status": status})
                    yield _sse("step", json.dumps(
                        {"title": title, "status": status},
                        ensure_ascii=False,
                    ))

                elif etype == "delta":
                    chunk = event.get("text", "")
                    full_text += chunk
                    yield _sse("delta", json.dumps(
                        {"text": chunk}, ensure_ascii=False,
                    ))

                elif etype == "text_done":
                    full_text = event.get("text", full_text)
                    yield _sse("text_done", json.dumps(
                        {"text": full_text}, ensure_ascii=False,
                    ))

                elif etype == "images":
                    status = event.get("status", "")
                    urls = event.get("urls", [])
                    if urls:
                        all_images = urls
                    yield _sse("images", json.dumps(
                        {"status": status, "urls": urls},
                        ensure_ascii=False,
                    ))

                elif etype == "error":
                    yield _sse("error", json.dumps(
                        {"message": event.get("message", "未知错误")},
                        ensure_ascii=False,
                    ))

                elif etype == "done":
                    pass

            for step in steps:
                if step["status"] == "running":
                    step["status"] = "done"
                    yield _sse("step", json.dumps(
                        {"title": step["title"], "status": "done"},
                        ensure_ascii=False,
                    ))

            metadata: dict[str, Any] = {}
            if all_images:
                metadata["images"] = all_images
            if steps:
                metadata["steps"] = steps

            supabase.table("messages").insert({
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": full_text or "工作流未返回结果",
                "metadata": metadata,
            }).execute()

        except Exception as e:
            yield _sse("error", json.dumps(
                {"message": f"ContentOps 调用异常: {e!s}"},
                ensure_ascii=False,
            ))

        yield _sse("done", "[DONE]")

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
