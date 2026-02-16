import { useState, useCallback } from "react";
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
    <div className="shrink-0 px-3 pb-3 pt-2 md:px-5 md:pb-5 md:pt-3">
      <div className="glass-elevated mx-auto flex max-w-4xl items-end gap-3 rounded-2xl p-3">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            activeConversationId
              ? "输入消息... (Enter 发送, Shift+Enter 换行)"
              : "请先选择或新建对话"
          }
          rows={1}
          disabled={!activeConversationId || streaming}
          aria-label="消息输入框"
          className="glass-input flex-1 resize-none rounded-xl px-4 py-3 text-sm"
        />
        <button
          type="button"
          disabled={!input.trim() || !activeConversationId || streaming}
          onClick={handleSend}
          aria-label="发送消息"
          className="btn-primary flex h-[42px] shrink-0 items-center justify-center min-w-[80px] rounded-xl"
        >
          {streaming ? (
            <span className="flex items-center gap-1.5">
              <span className="h-1 w-1 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
              <span className="h-1 w-1 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
              <span className="h-1 w-1 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
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
        </button>
      </div>
    </div>
  );
}
