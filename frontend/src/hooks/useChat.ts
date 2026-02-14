/**
 * 对话 Hook - 简化组件中的使用
 */
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const store = useChatStore();

  // 组件挂载时加载对话列表
  useEffect(() => {
    store.fetchConversations();
  }, []);

  return store;
}
