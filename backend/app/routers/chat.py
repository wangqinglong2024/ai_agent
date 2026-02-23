"""
对话管理路由
职责：创建对话、发送消息、获取历史记录
消息发送后调用 Dify ContentOps 工作流，获取营销文案 + 图片链接

SSE 事件协议：
  event: result  → data: {"text": "...", "images": [...]}
  event: done    → data: [DONE]
  event: error   → data: 错误信息
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
    """
    根据用户的第一条消息生成对话标题
    策略：提取前30个字符作为标题，去除换行符
    """
    clean_query = query.replace("\n", " ").replace("\r", " ").strip()
    if len(clean_query) <= 30:
        return clean_query
    return clean_query[:30] + "..."


@router.post("/conversations/{conversation_id}/messages")
async def send_message(
    conversation_id: str,
    body: SendMessageRequest,
    user: dict[str, Any] = Depends(get_current_user),
) -> StreamingResponse:
    """
    发送消息并调用 ContentOps 工作流获取营销文案 + 图片 (SSE)

    流程:
    1. 保存用户消息到 Supabase
    2. 如果是第一条消息，自动生成对话标题
    3. 调用 Dify ContentOps 工作流 (blocking)
    4. 将结果以 SSE 格式返回前端 (result 事件包含 text + images)
    5. 保存 AI 回复到 Supabase (content + metadata.images)
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
        try:
            result = await dify.call_contentops(
                query=body.content,
                user_id=user_id,
            )

            text: str = result.get("text", "")
            images: list[str] = result.get("images", [])

            # 以 JSON 格式发送结果，json.dumps 自动转义换行符确保 SSE 单行安全
            response_data = json.dumps(
                {"text": text, "images": images},
                ensure_ascii=False,
            )
            yield f"event: result\ndata: {response_data}\n\n"

            # 持久化 AI 回复
            metadata: dict[str, Any] = {}
            if images:
                metadata["images"] = images

            supabase.table("messages").insert({
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": text or "工作流未返回结果",
                "metadata": metadata,
            }).execute()

        except Exception as e:
            yield f"event: error\ndata: ContentOps 调用异常: {str(e)}\n\n"

        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
