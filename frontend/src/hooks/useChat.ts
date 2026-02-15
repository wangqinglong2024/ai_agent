/**
 * 对话 Hook - 简化组件中的使用
 */
import { useEffect } from "react";
import { useChatStore } from "@/stores/chatStore";

export function useChat() {
  const fetchConversations = useChatStore((s) => s.fetchConversations);
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  return useChatStore();
}
