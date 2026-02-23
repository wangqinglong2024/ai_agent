/**
 * 对话状态管理 (Zustand)
 *
 * 重要：此store的状态与当前登录用户强绑定
 * 用户切换时必须完全重置状态，防止数据混淆
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
  conversations: Conversation[];
  activeConversationId: string | null;
  messages: Message[];
  loadingConversations: boolean;
  loadingMessages: boolean;
  streaming: boolean;
  streamingContent: string;
  /** ContentOps 工作流返回的图片链接（流式期间暂存） */
  streamingImages: string[];
  sendError: string | null;

  fetchConversations: () => Promise<void>;
  newConversation: (title?: string) => Promise<Conversation>;
  removeConversation: (id: string) => Promise<void>;
  selectConversation: (id: string) => Promise<void>;
  send: (content: string) => Promise<void>;
  reset: () => void;
}

const initialState = {
  conversations: [],
  activeConversationId: null,
  messages: [],
  loadingConversations: false,
  loadingMessages: false,
  streaming: false,
  streamingContent: "",
  streamingImages: [] as string[],
  sendError: null,
};

export const useChatStore = create<ChatState>((set, get) => ({
  ...initialState,

  fetchConversations: async () => {
    set({ loadingConversations: true });
    try {
      const conversations = await getConversations();
      set({ conversations });
    } catch (error) {
      console.error("获取对话列表失败:", error);
      set({ conversations: [] });
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
    } catch (error) {
      console.error("获取消息失败:", error);
      set({ messages: [] });
    } finally {
      set({ loadingMessages: false });
    }
  },

  send: async (content) => {
    const { activeConversationId } = get();
    if (!activeConversationId) return;

    const isFirstMessage = get().messages.length === 0;

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
      streamingImages: [],
      sendError: null,
    }));

    await sendMessage(
      activeConversationId,
      content,
      (text) => {
        set((state) => ({
          streamingContent: state.streamingContent + text,
        }));
      },
      async () => {
        const { streamingContent, streamingImages } = get();
        const metadata: Record<string, unknown> = {};
        if (streamingImages.length > 0) {
          metadata.images = streamingImages;
        }

        const assistantMsg: Message = {
          id: crypto.randomUUID(),
          conversation_id: activeConversationId,
          role: "assistant",
          content: streamingContent,
          tokens_used: 0,
          metadata,
          created_at: new Date().toISOString(),
        };

        set((state) => ({
          messages: [...state.messages, assistantMsg],
          streaming: false,
          streamingContent: "",
          streamingImages: [],
        }));

        if (isFirstMessage) {
          try {
            const updatedConversations = await getConversations();
            set({ conversations: updatedConversations });
          } catch (error) {
            console.error("刷新对话列表失败:", error);
          }
        }
      },
      (error) => {
        console.error("消息发送失败:", error);
        set({
          streaming: false,
          streamingContent: "",
          streamingImages: [],
          sendError: error,
        });
      },
      (urls) => {
        set({ streamingImages: urls });
      },
    );
  },

  reset: () => {
    set(initialState);
  },
}));
