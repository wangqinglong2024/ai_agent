"""
对话管理路由
职责：创建对话、发送消息、获取历史记录
消息发送后自动调用 Dify 获取 AI 回复 (SSE 流式)

新增功能：第一条消息发送后，自动根据内容生成对话标题
"""
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

    # 确认该对话属于当前用户
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
@router.get("/conversations/{conversation_id}/messages", response_model=list[MessageResponse])
async def get_messages(
    conversation_id: str,
    user: dict[str, Any] = Depends(get_current_user),
) -> list[dict[str, Any]]:
    """获取某个对话的所有消息"""
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    # 先验证对话所有权
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
    
    策略：提取前30个字符作为标题，去除换行符，添加省略号
    未来可以调用 Dify workflow 或 LLM 生成更智能的标题
    """
    # 简单策略：取前30个字符
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
    发送消息并获取 AI 回复 (SSE 流式)
    
    流程:
    1. 保存用户消息到 Supabase
    2. 如果是第一条消息，自动生成对话标题
    3. 调用 Dify API 获取 AI 回复 (流式)
    4. 将流式内容转发给前端
    5. 流结束后保存 AI 完整回复到 Supabase
    """
    supabase = get_supabase_admin()
    user_id: str = user["sub"]

    # 验证对话所有权
    conv = (
        supabase.table("conversations")
        .select("id, title, dify_conversation_id")
        .eq("id", conversation_id)
        .eq("user_id", user_id)
        .execute()
    )
    if not conv.data:
        raise HTTPException(status_code=404, detail="对话不存在")

    current_title: str = conv.data[0].get("title", "")
    dify_conversation_id: str = conv.data[0].get("dify_conversation_id", "")

    # 检查是否是第一条用户消息（用于自动命名）
    existing_messages = (
        supabase.table("messages")
        .select("id")
        .eq("conversation_id", conversation_id)
        .eq("role", "user")
        .execute()
    )
    is_first_message = len(existing_messages.data) == 0

    # 1. 保存用户消息
    supabase.table("messages").insert({
        "conversation_id": conversation_id,
        "role": "user",
        "content": body.content,
    }).execute()

    # 2. 如果是第一条消息且标题是默认的，自动生成标题
    if is_first_message and current_title == "新对话":
        new_title = _generate_title_from_query(body.content)
        supabase.table("conversations").update({
            "title": new_title,
        }).eq("id", conversation_id).execute()

    # 3. 调用 Dify 并流式返回
    dify = DifyService()

    async def event_generator():
        full_answer = ""
        new_dify_conv_id = dify_conversation_id

        async for chunk in dify.chat_stream(
            query=body.content,
            user_id=user_id,
            conversation_id=dify_conversation_id,
        ):
            if chunk["type"] == "message":
                full_answer += chunk["content"]
                yield f"data: {chunk['content']}\n\n"
            elif chunk["type"] == "message_end":
                new_dify_conv_id = chunk.get("conversation_id", new_dify_conv_id)
            elif chunk["type"] == "error":
                yield f"event: error\ndata: {chunk['content']}\n\n"

        # 4. 保存 AI 完整回复
        if full_answer:
            supabase.table("messages").insert({
                "conversation_id": conversation_id,
                "role": "assistant",
                "content": full_answer,
            }).execute()

        # 5. 更新 Dify 对话 ID (首次对话时 Dify 会返回新 ID)
        if new_dify_conv_id and new_dify_conv_id != dify_conversation_id:
            supabase.table("conversations").update({
                "dify_conversation_id": new_dify_conv_id,
            }).eq("id", conversation_id).execute()

        yield "event: done\ndata: [DONE]\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",  # 告诉 Nginx 不缓冲
        },
    )
