/**
 * 后端 API 调用封装
 * 自动附加 Supabase JWT Token
 */
import { supabase } from "./supabase";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "/api";

/**
 * 获取当前用户的 access_token
 */
async function getAccessToken(): Promise<string> {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.access_token || "";
}

/**
 * 通用 fetch 封装
 */
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

/** 获取对话列表 */
export function getConversations(): Promise<Conversation[]> {
  return request("/chat/conversations");
}

/** 创建新对话 */
export function createConversation(title = "新对话"): Promise<Conversation> {
  return request("/chat/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
}

/** 删除对话 */
export function deleteConversation(id: string): Promise<void> {
  return request(`/chat/conversations/${id}`, { method: "DELETE" });
}

/** 获取对话消息列表 */
export function getMessages(conversationId: string): Promise<Message[]> {
  return request(`/chat/conversations/${conversationId}/messages`);
}

/**
 * 发送消息（SSE 流式接收 AI 回复）
 *
 * @param conversationId 对话 ID
 * @param content 用户消息
 * @param onChunk 每收到一段文字的回调
 * @param onDone 流式结束回调
 * @param onError 错误回调
 */
export async function sendMessage(
  conversationId: string,
  content: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (error: string) => void
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
    onError(err.detail || `HTTP ${response.status}`);
    return;
  }

  const reader = response.body?.getReader();
  if (!reader) {
    onError("无法读取响应流");
    return;
  }

  const decoder = new TextDecoder();
  let pendingEvent = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const text = decoder.decode(value, { stream: true });
    const lines = text.split("\n");

    for (const line of lines) {
      if (line.startsWith("event: ")) {
        pendingEvent = line.slice(7).trim();
        continue;
      }
      if (line.startsWith("data: ")) {
        const data = line.slice(6);
        if (pendingEvent === "error") {
          onError(data);
          return;
        }
        if (data === "[DONE]") {
          onDone();
          return;
        }
        onChunk(data);
        pendingEvent = "";
      }
    }
  }

  onDone();
}
