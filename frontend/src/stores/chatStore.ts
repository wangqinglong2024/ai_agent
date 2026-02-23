/**
 * 对话状态管理 (Zustand)
 *
 * 支持流式工作流进度追踪：步骤/增量文本/图片分阶段推送
 */
import { create } from "zustand";
import {
  Conversation,
  Message,
  WorkflowStep,
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
  streamingImages: string[];
  streamingSteps: WorkflowStep[];
  imagesLoading: boolean;
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
  streamingSteps: [] as WorkflowStep[],
  imagesLoading: false,
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
        state.activeConversationId === id ? null : state.activeConversationId,
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
      streamingSteps: [],
      imagesLoading: false,
      sendError: null,
    }));

    await sendMessage(activeConversationId, content, {
      onStep: (step) => {
        set((state) => {
          const steps = [...state.streamingSteps];
          const idx = steps.findIndex((s) => s.title === step.title);
          if (idx >= 0) {
            steps[idx] = { ...steps[idx], status: step.status };
          } else {
            steps.push(step);
          }
          return { streamingSteps: steps };
        });
      },

      onDelta: (text) => {
        set((state) => ({
          streamingContent: state.streamingContent + text,
        }));
      },

      onTextDone: (text) => {
        set({ streamingContent: text });
      },

      onImages: (data) => {
        if (data.status === "generating") {
          set({ imagesLoading: true });
        } else if (data.status === "done" && data.urls.length > 0) {
          set({ streamingImages: data.urls, imagesLoading: false });
        }
      },

      onDone: async () => {
        const { streamingContent, streamingImages, streamingSteps } = get();
        const metadata: Record<string, unknown> = {};
        if (streamingImages.length > 0) {
          metadata.images = streamingImages;
        }
        if (streamingSteps.length > 0) {
          metadata.steps = streamingSteps;
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
          streamingSteps: [],
          imagesLoading: false,
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

      onError: (error) => {
        console.error("消息发送失败:", error);
        set({
          streaming: false,
          streamingContent: "",
          streamingImages: [],
          streamingSteps: [],
          imagesLoading: false,
          sendError: error,
        });
      },
    });
  },

  reset: () => {
    set(initialState);
  },
}));
