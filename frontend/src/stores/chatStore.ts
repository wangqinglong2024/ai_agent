/**
 * 对话状态管理 (Zustand)
 */
import { create } from "zustand";
import {
  Conversation,
  Message,
  getConversations,
  createConversation,
  deleteConversation,
  getMessages,
  sendMessage,
} from "@/lib/api";

interface ChatState {
  /** 对话列表 */
  conversations: Conversation[];
  /** 当前对话 ID */
  activeConversationId: string | null;
  /** 当前对话的消息列表 */
  messages: Message[];
  /** 正在加载对话列表 */
  loadingConversations: boolean;
  /** 正在加载消息 */
  loadingMessages: boolean;
  /** AI 是否正在回复中 */
  streaming: boolean;
  /** 正在流式生成的内容 */
  streamingContent: string;

  /** 加载对话列表 */
  fetchConversations: () => Promise<void>;
  /** 创建新对话并设为活跃 */
  newConversation: (title?: string) => Promise<Conversation>;
  /** 删除对话 */
  removeConversation: (id: string) => Promise<void>;
  /** 选中对话并加载消息 */
  selectConversation: (id: string) => Promise<void>;
  /** 发送消息 (触发 AI 流式回复) */
  send: (content: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  conversations: [],
  activeConversationId: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  streaming: false,
  streamingContent: "",

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const conversations = await getConversations();
      set({ conversations });
    } finally {
      set({ loadingConversations: false });
    }
  },

  newConversation: async (title = "新对话") => {
    const conv = await createConversation(title);
    set((state) => ({
      conversations: [conv, ...state.conversations],
      activeConversationId: conv.id,
      messages: [],
    }));
    return conv;
  },

  removeConversation: async (id) => {
    await deleteConversation(id);
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      activeConversationId:
        state.activeConversationId === id
          ? null
          : state.activeConversationId,
      messages:
        state.activeConversationId === id ? [] : state.messages,
    }));
  },

  selectConversation: async (id) => {
    set({ activeConversationId: id, loadingMessages: true, messages: [] });
    try {
      const messages = await getMessages(id);
      set({ messages });
    } finally {
      set({ loadingMessages: false });
    }
  },

  send: async (content) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    // 乐观更新 - 先把用户消息显示出来
    const userMsg: Message = {
      id: crypto.randomUUID(),
      conversation_id: activeConversationId,
      role: "user",
      content,
      tokens_used: 0,
      metadata: {},
      created_at: new Date().toISOString(),
    };

    set((state) => ({
      messages: [...state.messages, userMsg],
      streaming: true,
      streamingContent: "",
    }));

    await sendMessage(
      activeConversationId,
      content,
      // onChunk: 每收到一段文字
      (text) => {
        set((state) => ({
          streamingContent: state.streamingContent + text,
        }));
      },
      // onDone: 流结束
      () => {
        const { streamingContent } = get();
        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          conversation_id: activeConversationId,
          role: "assistant",
          content: streamingContent,
          tokens_used: 0,
          metadata: {},
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          messages: [...state.messages, assistantMsg],
          streaming: false,
          streamingContent: "",
        }));
      },
      // onError
      (error) => {
        console.error("消息发送失败:", error);
        set({ streaming: false, streamingContent: "" });
      }
    );
  },
}));
