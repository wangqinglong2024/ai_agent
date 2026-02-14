/**
 * 对话输入框 - 磨砂浮动 (HeroUI V3)
 */
import { useState, useCallback } from "react";
import { Button, TextArea } from "@heroui/react";
import { useChatStore } from "@/stores/chatStore";

export default function ChatInput() {
  const [input, setInput] = useState("");
  const send = useChatStore((s) => s.send);
  const streaming = useChatStore((s) => s.streaming);
  const activeConversationId = useChatStore((s) => s.activeConversationId);

  const handleSend = useCallback(async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming || !activeConversationId) return;
    setInput("");
    await send(trimmed);
  }, [input, streaming, activeConversationId, send]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-white/[0.04] glass p-4">
      <div className="max-w-4xl mx-auto flex gap-3 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeConversationId
              ? "输入消息... (Enter 发送, Shift+Enter 换行)"
              : "请先选择或创建一个对话"
          }
          rows={1}
          disabled={!activeConversationId || streaming}
          className="flex-1 resize-none bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.05] focus:border-violet-500/30 transition-all duration-300 rounded-xl px-4 py-3 text-white/80 placeholder:text-white/20 outline-none disabled:opacity-50"
        />
        <Button
          isDisabled={!input.trim() || !activeConversationId || streaming}
          onPress={handleSend}
          className="btn-glow min-w-[80px] h-10 text-white"
        >
          {streaming ? (
            <span className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce [animation-delay:0ms]" />
              <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce [animation-delay:150ms]" />
              <span className="w-1 h-1 rounded-full bg-white/60 animate-bounce [animation-delay:300ms]" />
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              发送
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </span>
          )}
        </Button>
      </div>
    </div>
  );
}
