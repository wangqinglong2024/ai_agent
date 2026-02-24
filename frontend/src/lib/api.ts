/**
 * 后端 API 调用封装
 * 自动附加 Supabase JWT Token
 */
import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || "";
}

async function request<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = await getAccessToken();

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "请求失败" }));
    throw new Error(error.detail || `HTTP ${response.status}`);
  }

  return response.json();
}

// ============================================================================
// 对话 API
// ============================================================================

export interface Conversation {
  id: string;
  user_id: string;
  title: string;
  model: string;
  dify_conversation_id: string;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  role: "user" | "assistant" | "system";
  content: string;
  tokens_used: number;
  metadata: Record<string, unknown>;
  created_at: string;
}

export function getConversations(): Promise<Conversation[]> {
  return request("/chat/conversations");
}

export function createConversation(title = "新对话"): Promise<Conversation> {
  return request("/chat/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

export function deleteConversation(id: string): Promise<void> {
  return request(`/chat/conversations/${id}`, { method: "DELETE" });
}

export function getMessages(conversationId: string): Promise<Message[]> {
  return request(`/chat/conversations/${conversationId}/messages`);
}

// ============================================================================
// 流式消息 — 支持工作流步骤进度 + 增量文本 + 图片
// ============================================================================

export interface WorkflowStep {
  title: string;
  status: "running" | "done";
}

/** LLM 思考/推理内容（如 Gemini 扩展思维） */
export interface ThinkingItem {
  nodeTitle: string;
  content: string;
}

export interface StreamCallbacks {
  onStep?: (step: WorkflowStep) => void;
  onDelta?: (text: string) => void;
  onTextDone?: (text: string) => void;
  onImages?: (data: { status: string; urls: string[] }) => void;
  onThinking?: (item: ThinkingItem) => void;
  onDone?: () => void;
  onError?: (error: string) => void;
}

/**
 * 发送消息并通过 SSE 接收流式事件
 *
 * SSE 事件协议：
 *   step       — 工作流节点进度
 *   delta      — 增量文本
 *   text_done  — 全量文本（最终校正）
 *   images     — 图片状态 (generating / done + urls)
 *   thinking   — LLM 思考/推理内容
 *   error      — 错误信息
 *   done       — 流结束
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  callbacks: StreamCallbacks,
): Promise<void> {
  const token = await getAccessToken();

  const response = await fetch(
    `${API_BASE}/chat/conversations/${conversationId}/messages`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({ detail: "请求失败" }));
    callbacks.onError?.(err.detail || `HTTP ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    callbacks.onError?.("无法读取响应流");
    return;
  }

  const decoder = new TextDecoder();
  let pendingEvent = "";
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      if (trimmed.startsWith("event: ")) {
        pendingEvent = trimmed.slice(7).trim();
        continue;
      }

      if (trimmed.startsWith("data: ")) {
        const raw = trimmed.slice(6);

        if (raw === "[DONE]") {
          callbacks.onDone?.();
          return;
        }

        try {
          const data = JSON.parse(raw);

          switch (pendingEvent) {
            case "step":
              callbacks.onStep?.({
                title: data.title || "",
                status: data.status || "running",
              });
              break;

            case "delta":
              callbacks.onDelta?.(data.text || "");
              break;

            case "text_done":
              callbacks.onTextDone?.(data.text || "");
              break;

            case "images":
              callbacks.onImages?.({
                status: data.status || "",
                urls: data.urls || [],
              });
              break;

            case "thinking":
              callbacks.onThinking?.({
                nodeTitle: data.node_title || "",
                content: data.content || "",
              });
              break;

            case "error":
              callbacks.onError?.(data.message || "未知错误");
              return;

            default:
              break;
          }
        } catch {
          if (pendingEvent === "error") {
            callbacks.onError?.(raw);
            return;
          }
        }

        pendingEvent = "";
      }
    }
  }

  callbacks.onDone?.();
}
