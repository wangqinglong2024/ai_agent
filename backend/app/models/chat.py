"""
对话 & 消息数据模型
"""
from datetime import datetime
from pydantic import BaseModel, Field


# --------------------------------------------------------------------------
# 请求模型
# --------------------------------------------------------------------------
class CreateConversationRequest(BaseModel):
    """创建对话请求"""
    title: str = Field(default="新对话", max_length=200)


class SendMessageRequest(BaseModel):
    """发送消息请求"""
    content: str = Field(..., min_length=1, max_length=10000)


# --------------------------------------------------------------------------
# 响应模型
# --------------------------------------------------------------------------
class ConversationResponse(BaseModel):
    """对话响应"""
    id: str
    user_id: str
    title: str
    model: str = "default"
    dify_conversation_id: str = ""
    created_at: datetime
    updated_at: datetime


class MessageResponse(BaseModel):
    """消息响应"""
    id: str
    conversation_id: str
    role: str
    content: str
    tokens_used: int = 0
    metadata: dict = {}
    created_at: datetime
