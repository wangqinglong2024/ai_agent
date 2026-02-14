"""
Dify 工作流路由
直接调用 Dify 的工作流 API (不经过对话系统)
适用于一次性任务、工具调用等场景
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.dependencies import get_current_user
from app.services.dify_service import DifyService

router = APIRouter()


class WorkflowRequest(BaseModel):
    """工作流执行请求"""
    inputs: dict = {}          # Dify 工作流的输入参数
    query: str = ""            # 用户问题 (部分工作流需要)


@router.post("/workflow/run")
async def run_workflow(
    body: WorkflowRequest,
    user: dict = Depends(get_current_user),
):
    """
    执行 Dify 工作流 (非流式)
    适用于需要一次性获取结果的场景
    """
    dify = DifyService()
    user_id = user["sub"]

    result = await dify.run_workflow(
        inputs=body.inputs,
        query=body.query,
        user_id=user_id,
    )

    if result is None:
        raise HTTPException(status_code=502, detail="Dify 工作流调用失败")

    return result
